import { useEffect, useState } from "react"

function DashboardHeader ({ xp }) {
    const [username, setUsername] = useState(() => {
        try{
            const storedUser = JSON.parse(localStorage.getItem('user'));
            return storedUser?.username || '';
        } catch {
            return '';
        }
     });
    const [level, setLevel] = useState(1);
    const [progressPercent, setProgressPercent] = useState(0);

    useEffect(() => {
        const storedName = localStorage.getItem('user');
        if(storedName) {
            try {
                const storedUser = JSON.parse(storedName);
                setUsername(storedUser.username || '');
            } catch (err) {
                setUsername('');
            }
        }

        const calculatedLevel = Math.floor(xp / 100) + 1;
        const xpInCurrentLevel = xp % 100;
        const percent = Math.floor((xpInCurrentLevel / 100) * 100);
        
        setLevel(calculatedLevel);
        setProgressPercent(percent);
    }, [xp]);

    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

            <div>
                <h1 className="text-2xl font-bold">Hello, {username}! 👋</h1>
                <p className="text-sm text-blue-100">Welcome back to your study dashboard.</p>
            </div>

            <div className="flex flex-col w-full sm:w-1/2">
                <p className="text-sm mb-1">⭐ Level {level} - {xp} XP</p>
                <div className="w-full h-3 bg-blue-300 rounded-full overflow-hidden"> 
                    <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%`}}
                    ></div>
                </div>
            </div>
        </div>
    );
}

export default DashboardHeader;