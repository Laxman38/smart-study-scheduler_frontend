import { useEffect, useState } from "react";

const priorityColors = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-yellow-100 text-yellow-700',
    Low: 'bg-green-100 text-green-700'
};

const SubjectPriority= () => {
    const [subjects, setSubjects] = useState([]);
    const [priority, setPriority] = useState('Medium');
    const [newSubject, setNewSubject] = useState('');

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('subjects')) || [];
        setSubjects(stored);
    }, []);

    useEffect(() => {
        localStorage.setItem('subjects', JSON.stringify(subjects));
    }, [subjects]);

    const addSubject = () => {
        if(!newSubject.trim()) return;
        const newEntry = { id: Date.now(), name: newSubject.trim(), priority};
        setSubjects([...subjects, newEntry]);
        setNewSubject('')
        setPriority('Medium');
    };

    const removeSubject = (id) => {
        setSubjects(subjects.filter((sub) => sub.id !== id));
    };

    return (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">📌 Subject Priortization</h2>

            <div className="flex gap-2 mb-4">
                <input
                 type="text"
                 name="Enter Subject"
                 value={newSubject}
                 onChange={(e) => setNewSubject(e.target.value)}
                 className="flex-1 border rounded-md p-2"
                />

                <select
                 value={priority}
                 onChange={(e) =>setPriority(e.target.value)}
                 className="border rounded-md p-2"
                >
                    <option value="High">🔴 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                </select>

                <button
                 onClick={addSubject}
                 className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                >
                    Add
                </button>
            </div>

            <ul className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {subjects.map((subject) => (
                    <li 
                        key={subject.id} 
                        className={`flex justify-between items-center p-3 rounded-lg shadow ${priorityColors[subject.priority]}`}
                    >
                    
                    <span>{subject.name}</span>
                        
                    <span className="text-sm font-medium">
                        {subject.priority}
                    </span>
                        <button
                         onClick={() => removeSubject(subject.id)}
                         className="text-red-500 hover:text-red-700"
                        >
                            ✖
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SubjectPriority;
