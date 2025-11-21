import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronLeft, Check, Trash2, Repeat } from 'lucide-react';
import { generateRecurringDates } from '../utils/scheduleHelpers';
import clsx from 'clsx';
import { addMonths, format } from 'date-fns';

export function ClassForm() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { addSession, updateSession, deleteSession, sessions, students } = useStore();

    const isEditMode = Boolean(id);
    const existingSession = id ? sessions.find(s => s.id === id) : null;

    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('14:00');
    const [endTime, setEndTime] = useState('16:00');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

    // Recurring State
    const [isRecurring, setIsRecurring] = useState(false);
    const [endDate, setEndDate] = useState(format(addMonths(new Date(), 1), 'yyyy-MM-dd'));
    const [selectedDays, setSelectedDays] = useState<number[]>([]); // 0=Sun, 1=Mon...

    useEffect(() => {
        if (isEditMode && existingSession) {
            setDate(existingSession.date);
            setStartTime(existingSession.startTime);
            setEndTime(existingSession.endTime);
            setSelectedStudents(existingSession.studentIds);
        }
    }, [isEditMode, existingSession]);

    const toggleStudent = (id: string) => {
        setSelectedStudents(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const toggleDay = (day: number) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    const handleDelete = () => {
        if (confirm('确定要删除这节课吗？')) {
            if (id) deleteSession(id);
            navigate('/schedule');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStudents.length === 0) return;

        if (isEditMode && id) {
            // Update existing session
            updateSession(id, {
                date,
                startTime,
                endTime,
                studentIds: selectedStudents,
            });
        } else if (isRecurring) {
            // Create recurring sessions
            const dates = generateRecurringDates(date, endDate, selectedDays);
            if (dates.length === 0) {
                alert('所选时间段内没有符合日期的课程，请检查重复设置。');
                return;
            }

            dates.forEach(d => {
                addSession({
                    id: crypto.randomUUID(),
                    date: d,
                    startTime,
                    endTime,
                    studentIds: selectedStudents,
                    completed: false,
                });
            });
            alert(`已成功添加 ${dates.length} 节课程`);
        } else {
            // Create single session
            addSession({
                id: crypto.randomUUID(),
                date,
                startTime,
                endTime,
                studentIds: selectedStudents,
                completed: false,
            });
        }

        navigate('/schedule');
    };

    const weekDays = [
        { val: 1, label: '一' },
        { val: 2, label: '二' },
        { val: 3, label: '三' },
        { val: 4, label: '四' },
        { val: 5, label: '五' },
        { val: 6, label: '六' },
        { val: 0, label: '日' },
    ];

    if (isEditMode && !existingSession) {
        return <div className="p-4">课程不存在</div>;
    }

    return (
        <div className="p-4 pt-6 pb-48">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">{isEditMode ? '编辑课程' : '添加课程'}</h1>
                </div>
                {isEditMode && (
                    <button onClick={handleDelete} className="text-red-500 p-2 bg-red-50 rounded-full">
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                    {!isEditMode && (
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-gray-900 font-medium">
                                <Repeat size={20} className="text-blue-600" />
                                <span>重复课程</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsRecurring(!isRecurring)}
                                className={clsx(
                                    "w-12 h-7 rounded-full transition-colors relative",
                                    isRecurring ? "bg-blue-600" : "bg-gray-200"
                                )}
                            >
                                <div className={clsx(
                                    "w-5 h-5 bg-white rounded-full absolute top-1 transition-transform",
                                    isRecurring ? "left-6" : "left-1"
                                )} />
                            </button>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {isRecurring ? '开始日期' : '日期'}
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                            required
                        />
                    </div>

                    {isRecurring && (
                        <div className="animate-fade-in space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">重复时间</label>
                                <div className="flex gap-2 justify-between">
                                    {weekDays.map((day) => {
                                        const isSelected = selectedDays.includes(day.val);
                                        return (
                                            <button
                                                key={day.val}
                                                type="button"
                                                onClick={() => toggleDay(day.val)}
                                                className={clsx(
                                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                                                    isSelected ? "bg-blue-600 text-white shadow-md" : "bg-gray-50 text-gray-500"
                                                )}
                                            >
                                                {day.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">结束日期</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                                required
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">结束时间</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择学生 ({selectedStudents.length})</label>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100 max-h-96 overflow-y-auto">
                        {students.map((student) => {
                            const isSelected = selectedStudents.includes(student.id);
                            return (
                                <div
                                    key={student.id}
                                    onClick={() => toggleStudent(student.id)}
                                    className={clsx(
                                        "p-4 flex justify-between items-center cursor-pointer active:bg-gray-50 transition-colors",
                                        isSelected && "bg-blue-50"
                                    )}
                                >
                                    <div>
                                        <div className="font-medium text-gray-900">{student.name}</div>
                                        <div className="text-xs text-gray-500">剩余: {student.balance} 课时</div>
                                    </div>
                                    <div className={clsx(
                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                        isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"
                                    )}>
                                        {isSelected && <Check size={14} className="text-white" />}
                                    </div>
                                </div>
                            );
                        })}
                        {students.length === 0 && (
                            <div className="p-8 text-center text-gray-400">
                                还没有学生，请先去添加学生
                            </div>
                        )}
                    </div>
                </div>

                <div className="fixed bottom-[60px] left-0 right-0 p-4 bg-white border-t border-gray-200 z-40 safe-area-pb">
                    <button
                        type="submit"
                        disabled={selectedStudents.length === 0 || (isRecurring && selectedDays.length === 0)}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50 disabled:scale-100"
                    >
                        {isEditMode ? '保存修改' : '确认添加'}
                    </button>
                </div>
            </form>
        </div>
    );
}
