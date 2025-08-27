import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Line, LineChart } from "recharts";
import dayjs from "dayjs";

function WeeklyCharts() {
    const [chartdata, setChartData] = useState([]);

    useEffect(() => {
        const fetchWeekly = async () => {
            const token = localStorage.getItem('token');
            if(!token) return;

            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/weekly`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if(!res.ok) throw new Error('Failed to fetch weekly progress');
                const data = await res.json();

                if(!Array.isArray(data)){
                    console.error('Weekly progress is not an array');
                    return;
                }

                const formatted = data.map(entry => ({
                    name: dayjs(entry.date).format('ddd'),
                    Pomodoro: entry.pomodoro,
                    Goals: entry.goals
                }));

                setChartData(formatted);

            } catch (err) {
                console.error('Error fetching weekly progress', err);
            }
        };

        fetchWeekly();
    }, []);

    return (
        <div className="bg-white p-4 rounded-lg shadow ">
            <h2 className="text-xl font-semibold mb-6">📊 Weekly Progress</h2>

            <div className="h-64 mb-8">
                <h3 className="text-lg font-medium mb-2">⏱ Pomodoro Sessions</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartdata}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="Pomodoro" fill="#60a5fa" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="h-64">
                <h3 className="text-lg font-medium mb-2">🎯 Goals Completed</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartdata}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Line type="monotone" dataKey="Goals" stroke="#34d399" strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default WeeklyCharts;