import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-toastify";

const StudyPlanEditor = ({ onSave }) => {
    const [subject, setSubject] = useState('');
    const [priority, setPriority] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    

        if( !date || !time || !subject || !priority){
            toast.error("Subject, Date and Time are required!");
            return;
        }

        const task = {
            id: Date.now(),
            subject,
            priority,
            datetime: dayjs(`${date}T${time}`).toDate(),
            notes,
        }

        onSave(task);

        setSubject('');
        setPriority('Priority');
        setDate('');
        setTime('');
        setNotes('');

    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto mt-8 h-screen">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">📝 Create Study Plan</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Subject (e.g., Math)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />

                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full border bg-white rounded-md focus:ring-2 focus:ring-indigo-400 p-3"
                >
                    <option value="Priority">📌 Priority</option>
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                </select>

                <div className="flex gap-4">
                    <input
                        type="text"
                        value={date}
                        placeholder="Date"
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 border rounded-md p-3"
                    />

                    <input
                        type="text"
                        value={time}
                        placeholder="Time"
                        onChange={(e) => setTime(e.target.value)}
                        className="flex-1 border rounded-md p-3"
                    />
                </div>

                <textarea
                    placeholder="Notes (optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full h-24 border rounded-md p-3"
                />

               <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
               >
                Save Task
               </button>
            </form>
        </div>
    );
};

export default StudyPlanEditor;