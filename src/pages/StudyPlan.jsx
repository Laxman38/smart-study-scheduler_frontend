import { useEffect, useState } from "react";
import StudyPlanEditor from "../components/StudyPlanEditor";
import { toast } from "react-toastify";

function StudyPlan() {
    const [studyTasks, setStudyTasks] = useState([]);

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        if(!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/all`, {
            headers: { Authorization: `Bearer ${token}` } 
        });

        const data = await res.json();
        setStudyTasks(data);
    };

    useEffect(() => {
        fetchTasks();
    });

    const handleTaskSave = async (task) => {
       try {
        const token = localStorage.getItem('token');
        if(!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/save`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(task)
        });

        if(!res.ok) throw new Error('Failed to save task');
        toast.success('Task saved successfully');
        fetchTasks();

       } catch (err) {
        console.error('Error saving task:', err);
        toast.error('Error saving task');
       }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <StudyPlanEditor onSave={handleTaskSave} />
        </div>
        
    );
    
}

export default StudyPlan;