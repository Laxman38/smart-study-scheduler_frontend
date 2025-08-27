import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function GoalCards({ onGoalComplete }) {
    const [goals, setGoals] = useState([]);
    const [goalText, setGoalText] = useState('');

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/goals`,{
                    headers: { Authorization: `Bearer ${token}` }
                });
                if(!res.ok) throw new Error('Failed to fetch goals');
                const data = await res.json();
                setGoals(data);
            } catch (err) {
                console.error(err);
                toast.error('⚠️ Could not load goals');
            }
        };
        fetchGoals();
    }, []);

    const addGoal = async () => {
        if (!goalText.trim()) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/goals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ text: goalText })
            });
            if(!res.ok) throw new Error('Failed to add goal');
            const newGoal = await res.json();
            setGoals([...goals, newGoal]);
            setGoalText('');
        } catch (err) {
            console.error(err);
            toast.error('❌ Could not add goal');
        }
    };

    const completeGoal = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/goals/${id}/complete`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });

            if(!res.ok) throw new Error('Failed to complete goal');

            const updatedGoals = goals.map(goal => 
                goal.id === id ? { ...goal, completed: true } : goal
            );
            setGoals(updatedGoals);

            if (onGoalComplete) onGoalComplete();
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Could not complete goal");
        }
    };

    const removeGoal = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/goals/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if(!res.ok) throw new Error('Failed to delete goal');
            const updatedGoals = goals.filter(goal => goal.id !== id);
            setGoals(updatedGoals);
        } catch (err) {
            console.error(err);
            toast.error("⚠️ Could not delete goal");
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow  mx-auto">
            <h2 className="text-xl font-semibold mb-4">🎯 Study Goals</h2>

            <div className="flex mb-4 gap-2">
                <input
                 type="text" 
                 value={goalText}
                 onChange={(e) => setGoalText(e.target.value)}
                 className="flex-grow p-2 border rounded"
                 placeholder="Add a new goal..."
                />

                <button
                 onClick={addGoal}
                 className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-3">
                {goals.length === 0 ? (
                    <p>No goals yet. Start by adding one!</p>
                ) : (
                    goals.map((goal) => (
                        <li
                         key={goal.id}
                         className={`flex justify-between items-center p-2 border rounded ${
                         goal.completed ? 'bg-green-100 line-through text-gray-500' : ''
                         }`}
                        >
                            <span>{goal.text}</span>
                            <div className="flex gap-2">
                                {!goal.completed && (
                                    <button
                                     onClick={() => completeGoal(goal.id)}
                                     className="text-green-600 hover:underline"
                                    >
                                        Mark Done
                                    </button>
                                )}
                                <button
                                 onClick={() => removeGoal(goal.id)}
                                 className="text-red-500 hover:underline"
                                >
                                    ✖
                                </button>
                            </div>
                        </li>
                    )
                )
                )}
            </ul>
        </div>
    );
}

export default GoalCards;