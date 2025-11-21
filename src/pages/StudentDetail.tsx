import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ChevronLeft, History } from 'lucide-react';
import { useState } from 'react';

export function StudentDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const student = useStore((state) => state.students.find((s) => s.id === id));
    const addPayment = useStore((state) => state.addPayment);

    const [showTopUp, setShowTopUp] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState(0);
    const [topUpClasses, setTopUpClasses] = useState(10);

    if (!student) {
        return <div className="p-4">Student not found</div>;
    }

    const handleTopUp = (e: React.FormEvent) => {
        e.preventDefault();
        addPayment({
            id: crypto.randomUUID(),
            studentId: student.id,
            amount: topUpAmount,
            classesAdded: topUpClasses,
            date: new Date().toISOString(),
        });
        setShowTopUp(false);
    };

    return (
        <div className="p-4 pt-6 pb-24">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 p-2 -ml-2 rounded-full active:bg-gray-100">
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">{student.name}</h1>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 text-center">
                <p className="text-gray-500 mb-2">剩余课时</p>
                <div className="text-5xl font-bold text-blue-600 mb-4">{student.balance}</div>
                <button
                    onClick={() => setShowTopUp(true)}
                    className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-medium text-sm active:bg-blue-100 transition-colors"
                >
                    充值课时
                </button>
            </div>

            <div className="space-y-4">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <History size={20} />
                    最近记录
                </h2>
                <div className="text-gray-400 text-center py-8 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    暂无上课记录
                </div>
            </div>

            {showTopUp && (
                <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-[60] animate-fade-in">
                    <div className="bg-white w-full sm:w-96 p-6 rounded-t-2xl sm:rounded-2xl animate-slide-up shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">充值课时</h3>
                        <form onSubmit={handleTopUp} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">增加课时数</label>
                                <input
                                    type="number"
                                    value={topUpClasses}
                                    onChange={(e) => setTopUpClasses(Number(e.target.value))}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">金额 (元)</label>
                                <input
                                    type="number"
                                    value={topUpAmount}
                                    onChange={(e) => setTopUpAmount(Number(e.target.value))}
                                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowTopUp(false)}
                                    className="flex-1 py-3 rounded-xl bg-gray-100 font-medium active:bg-gray-200"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium active:bg-blue-700"
                                >
                                    确认充值
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
