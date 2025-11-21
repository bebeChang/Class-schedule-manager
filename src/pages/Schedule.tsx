import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    isToday
} from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Plus, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

export function Schedule() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewDate, setViewDate] = useState(new Date()); // For controlling the displayed month

    const sessions = useStore((state) => state.sessions);
    const students = useStore((state) => state.students);

    // Calendar Logic
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(viewDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const todaysSessions = sessions.filter(s =>
        isSameDay(new Date(s.date), selectedDate)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Check if a day has any sessions (for the indicator dot)
    const hasSession = (date: Date) => {
        return sessions.some(s => isSameDay(new Date(s.date), date));
    };

    const getStudentNames = (ids: string[]) => {
        return ids.map(id => students.find(s => s.id === id)?.name).filter(Boolean).join(', ');
    };

    const nextMonth = () => setViewDate(addMonths(viewDate, 1));
    const prevMonth = () => setViewDate(subMonths(viewDate, 1));
    const jumpToToday = () => {
        const now = new Date();
        setSelectedDate(now);
        setViewDate(now);
    };

    const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

    return (
        <div className="p-4 pt-6 pb-24">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {format(viewDate, 'yyyy年 M月', { locale: zhCN })}
                    </h1>
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200">
                            <ChevronLeft size={24} className="text-gray-600" />
                        </button>
                        <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200">
                            <ChevronRight size={24} className="text-gray-600" />
                        </button>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={jumpToToday}
                        className="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full active:bg-blue-100"
                    >
                        今天
                    </button>
                    <Link
                        to="/schedule/new"
                        className="bg-blue-600 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                    >
                        <Plus size={24} />
                    </Link>
                </div>
            </div>

            {/* Monthly Calendar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-xs text-gray-400 font-medium py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-2">
                    {calendarDays.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        const isCurrentMonth = isSameMonth(date, viewDate);
                        const isTodayDate = isToday(date);
                        const hasClass = hasSession(date);

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => {
                                    setSelectedDate(date);
                                    if (!isCurrentMonth) {
                                        setViewDate(date);
                                    }
                                }}
                                className="relative flex flex-col items-center justify-center h-10 w-full"
                            >
                                <div className={clsx(
                                    "w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all",
                                    isSelected ? "bg-blue-600 text-white shadow-md" : (isCurrentMonth ? "text-gray-900" : "text-gray-300"),
                                    !isSelected && isTodayDate && "text-blue-600 font-bold bg-blue-50"
                                )}>
                                    {format(date, 'd')}
                                </div>
                                {/* Indicator Dot */}
                                {hasClass && (
                                    <div className={clsx(
                                        "absolute bottom-0 w-1 h-1 rounded-full",
                                        isSelected ? "bg-white" : "bg-blue-500"
                                    )} />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Day Header */}
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                    {format(selectedDate, 'M月d日 EEEE', { locale: zhCN })}
                </h2>
                <span className="text-sm text-gray-500">
                    {todaysSessions.length} 节课
                </span>
            </div>

            {/* Session List */}
            <div className="space-y-3">
                {todaysSessions.map((session) => (
                    <Link
                        key={session.id}
                        to={`/schedule/edit/${session.id}`}
                        className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 active:scale-[0.99] transition-transform"
                    >
                        <div className="flex flex-col items-center justify-center min-w-[60px] border-r border-gray-100 pr-4">
                            <span className="text-lg font-bold text-gray-900">{session.startTime}</span>
                            <span className="text-xs text-gray-400">{session.endTime}</span>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">书法课</h3>
                            <div className="flex items-center text-sm text-gray-500 gap-1">
                                <Clock size={14} />
                                <span>{session.studentIds.length} 人报名</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                                {getStudentNames(session.studentIds)}
                            </p>
                        </div>
                    </Link>
                ))}

                {todaysSessions.length === 0 && (
                    <div className="text-center text-gray-400 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                            <Clock size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm">今天没有安排课程</p>
                    </div>
                )}
            </div>
        </div>
    );
}
