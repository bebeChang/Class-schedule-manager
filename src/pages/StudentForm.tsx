import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronLeft } from 'lucide-react';

export function StudentForm() {
    const navigate = useNavigate();
    const addStudent = useStore((state) => state.addStudent);

    const [name, setName] = useState('');
    const [initialBalance, setInitialBalance] = useState(0);
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        addStudent({
            id: crypto.randomUUID(),
            name,
            balance: initialBalance,
            totalClassesTaken: 0,
            notes,
            joinedDate: new Date().toISOString(),
        });

        navigate('/students');
    };

    return (
        <div className="p-4 pt-6">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold">添加学生</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-shadow"
                        placeholder="输入学生姓名"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">初始课时</label>
                    <input
                        type="number"
                        value={initialBalance}
                        onChange={(e) => setInitialBalance(Number(e.target.value))}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-shadow"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 bg-white h-32 outline-none transition-shadow resize-none"
                        placeholder="可选备注..."
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-transform mt-8"
                >
                    保存
                </button>
            </form>
        </div>
    );
}
