import { useStore } from '../store/useStore';
import { format, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Users, Calendar, Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
    const students = useStore((state) => state.students);
    const sessions = useStore((state) => state.sessions);

    const today = new Date();
    const todaysSessions = sessions.filter(s =>
        isSameDay(new Date(s.date), today)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <div className="p-4 pt-6 pb-24">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">你好，老师</h1>
                <p className="text-gray-500">{format(today, 'yyyy年M月d日 EEEE', { locale: zhCN })}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200">
                    <div className="flex items-center gap-2 mb-2 opacity-80">
                        <Users size={18} />
                        <span className="text-sm font-medium">学生总数</span>
                    </div>
                    <div className="text-3xl font-bold">{students.length}</div>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2 text-gray-500">
                        <Calendar size={18} />
                        <span className="text-sm font-medium">今日课程</span>
                    </div>
                    <div className="text-3xl font-bold text-gray-900">{todaysSessions.length}</div>
                </div>
            </div>

            {/* Today's Schedule Preview */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-lg text-gray-900">今日课程</h2>
                    <Link to="/schedule" className="text-sm text-blue-600 font-medium flex items-center">
                        全部 <ChevronRight size={16} />
                    </Link>
                </div>

                <div className="space-y-3">
                    {todaysSessions.slice(0, 3).map((session) => (
                        <div key={session.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="font-bold text-gray-900 w-12">{session.startTime}</div>
                            <div className="flex-1">
                                <div className="text-sm text-gray-500">{session.studentIds.length} 人上课</div>
                            </div>
                        </div>
                    ))}

                    {todaysSessions.length === 0 && (
                        <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-400 text-sm">
                            今天没有安排课程
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="font-bold text-lg text-gray-900 mb-4">快速操作</h2>
                <div className="grid grid-cols-2 gap-4">
                    <Link
                        to="/students/new"
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <Plus size={24} />
                        </div>
                        <span className="font-medium text-gray-900">添加学生</span>
                    </Link>
                    <Link
                        to="/schedule/new"
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                        <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
                            <Calendar size={24} />
                        </div>
                        <span className="font-medium text-gray-900">安排课程</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
