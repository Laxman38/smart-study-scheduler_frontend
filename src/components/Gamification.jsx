function Gamification({ xp, badges }) {
  const level = Math.floor(xp / 100) + 1;
  const progressPercent = ((xp % 100) / 100) * 100;

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">
        🎮 Gamification
      </h2>
        <div>
          Level: {level}
        </div>
        <div className="w-full bg-gray-300 h-4 rounded-full mb-2">
          <div
          className="bg-blue-500 h-4 rounded-full"
          style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-sm text-gray-600 mb-2">XP: {xp}</div>
        <div className="text-md font-medium mt-2">🏅 Badges:</div>
        <ul className="flex gap-2 flex-wrap mt-1">
          {badges.length === 0 ? (
            <li>No badges yet.</li>
          ) : (
            badges.map((badge, index) => (
              <li key={index} className="bg-yellow-200 px-3 py-1 rounded-full text-sm">
                {badge}
              </li>
            ))
          )}
        </ul>
    </div>
  );
}

export default Gamification;
