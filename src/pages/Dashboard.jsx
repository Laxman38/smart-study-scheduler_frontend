import { useEffect, useState } from "react";
import Gamification from "../components/Gamification";
import GoalCards from "../components/GoalCards";
import ProgressTracker from "../components/ProgressTracker";
import DashboardHeader from "../components/DashboardHeader";   
import TodayTasks from "../components/TodayTasks";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [xp, setXp] = useState(0);
    const [badges, setBadges] = useState([]);
    const [pomodoroCount, setPomodoroCount] = useState(0);
    const [goalRefreshKey, setGoalRefreshKey] = useState(0);
    const [studyTasks, setStudyTasks] = useState([]);
    const navigate = useNavigate();

    const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
        if(!token) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            if(!res.ok) {
                throw new Error(data.msg || 'Failed to fetch profile');
            }

            setXp(data.xp || 0);
            setBadges(data.badges || []);

        }   catch (err) {
                console.error('Error fetching user profile:', err);
                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            }
    };

    useEffect(() => {
        fetchUserProfile();
    }, [navigate]);

    useEffect(() => {
        const loadXP = () => {
            const storedXP = localStorage.getItem('xp');
            const storedBadges = localStorage.getItem('badges');
            if(storedXP) setXp(parseInt(storedXP));
            if(storedBadges) setBadges(JSON.parse(storedBadges));
        };

        loadXP();

        window.addEventListener('xpUpdated', loadXP);
        return () => {
            window.removeEventListener('xpUpdated', loadXP);
        };
        
    }, []);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('studyTasks')) || [];
        setStudyTasks(saved);
    }, []);

    const earnXP = async (amount) => {
        const newXP = xp + amount;
        setXp(newXP);

        toast.success(`🎉 You earned ${amount} XP! `);

        const newBadges = [...badges];

        if(newXP >= 500 && !newBadges.includes('💪 Dedicated Learner')){
            newBadges.push('💪 Dedicated Learner');
            toast.success('🏅 New Badge: Dedicated Learner');
        }

        if(newXP >= 1000 && !newBadges.includes('🏆 Study Master')){
            newBadges.push('🏆 Study Master');
            toast.success('🏅 New Badge: Study Master');
        }

        setBadges(newBadges);

        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/api/user/update-xp`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`    
                },
                body: JSON.stringify({ xp: newXP, badges: newBadges })
            });
        } catch (err) {
            console.log('Failed to update the XP in backend', err)
        }
    }; 

    const handleGoalComplete = async () => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${import.meta.env.VITE_API_URL}/api/progress/goal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            setGoalRefreshKey((prev) => prev + 1);
            earnXP(30);
        } catch (err) {
            console.error("Goal update failed:", err);
        }
    };

    return (
        <div className="p-4 space-y-8 md:p-6 lg:p-10 bg-gray-50 min-h-screen">
            <DashboardHeader xp = {xp} />

            <section className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <GoalCards onGoalComplete={handleGoalComplete} />
                </div>   
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6"> 
                <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <TodayTasks />
                </div>

                <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <ProgressTracker
                        pomodoroCount = {pomodoroCount}
                        refreshKey = {goalRefreshKey}
                        onStreakXP = {(xp) => earnXP(xp)}
                    /> 
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
                    <Gamification xp={xp} badges={badges} />
                </div>
            </section>  
        </div>
    );
}

export default Dashboard;

