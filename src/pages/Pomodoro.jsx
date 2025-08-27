import PomodoroTimer from "../components/PomodoroTimer";

function Pomodoro() {
    const handleEarnXP = (amount) => {
        const storedXP = parseInt(localStorage.getItem("xp") || "0");
        const newXP = storedXP + amount;

        localStorage.setItem("xp", newXP.toString());

        const badges = JSON.parse(localStorage.getItem("badges") || "[]");
        if (newXP >= 500 && !badges.includes("💪 Dedicated Learner")) {
            badges.push("💪 Dedicated Learner");
        }
        if (newXP >= 1000 && !badges.includes("🏆 Study Master")) {
            badges.push("🏆 Study Master");
        }

        localStorage.setItem("badges", JSON.stringify(badges));

        window.dispatchEvent(new Event("xpUpdated"));
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <PomodoroTimer onEarnXP={handleEarnXP} />
        </div>
    );
}

export default Pomodoro;
