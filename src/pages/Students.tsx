import { useStore } from '../store/useStore';
import { Plus, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Students() {
    const students = useStore((state) => state.students);
    const [search, setSearch] = useState('');

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 pt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">学生列表</h1>
                <Link
                    to="/students/new"
                    className="bg-blue-600 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                >
                    <Plus size={24} />
                </Link>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="搜索学生..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                />
            </div>

            <div className="space-y-3">
                {filteredStudents.map((student) => (
                    <Link
                        key={student.id}
                        to={`/students/${student.id}`}
                        className="block bg-white p-4 rounded-xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    剩余课时: <span className={student.balance < 3 ? 'text-red-500 font-bold' : 'text-green-600 font-bold'}>{student.balance}</span>
                                </p>
                            </div>
                            <ChevronRight className="text-gray-300" size={20} />
                        </div>
                    </Link>
                ))}

                {filteredStudents.length === 0 && (
                    <div className="text-center text-gray-400 py-10">
                        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search size={32} className="text-gray-300" />
                        </div>
                        <p>{search ? '没有找到匹配的学生' : '还没有添加学生'}</p>
                        {!search && (
                            <p className="text-sm mt-2">点击右上角的 + 号添加学生</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
