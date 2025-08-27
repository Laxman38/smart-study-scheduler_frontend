import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const getToday = () => dayjs().tz('Asia/Kolkata').format('YYYY-MM-DD');

function ProgressTracker({ pomodoroCount, refreshKey, onStreakXP }) {
    const[progress, setProgress] = useState({});
    const[streak, setStreak] = useState(0);
    const today = getToday();

    useEffect(() => {
        const getDailyProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                if(!token) return;

                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/${today}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });

                if(!res.ok) throw new Error('Failed to fetch profile');
                const data = await res.json();

                const saved = JSON.parse(localStorage.getItem('progress')) || {};
                saved[today] = {
                    goals: data.goals || 0,
                    pomodoro: data.pomodoro || 0,
                };

                localStorage.setItem('progress', JSON.stringify(saved));
                setProgress(saved);
                setStreak(data.streak || 0);   

            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        getDailyProgress();
        
    }, [refreshKey, pomodoroCount]);

    const todayStats = progress[today] || { pomodoro: 0, goals: 0 };

    return(
        <div className="bg-white p-4 rounded-lg shadow mt-6">
            <h2 className="text-xl font-semibold mb-3">📅 Daily Progress</h2>
            <p>Pomodoro Sessions: <strong>{todayStats.pomodoro}</strong></p>
            <p>Goals Completed: <strong>{todayStats.goals}</strong></p>
            <p>Streak🔥: <strong>{streak} {streak === 1 ? 'day' : 'days'}</strong></p>
        </div>
    );
}

export default ProgressTracker;