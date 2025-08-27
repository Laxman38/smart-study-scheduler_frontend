import SubjectProgress from "../components/SubjectProgress";
import WeeklyCharts from "../components/WeeklyCharts";

function Progress() {
    return (
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <WeeklyCharts />
            <SubjectProgress />
        </div>
    );
}

export default Progress;