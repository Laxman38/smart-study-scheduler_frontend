import {Link, NavLink} from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart,
  CalendarDays,
  Timer,
  Settings as SettingsIcon
} from "lucide-react"; 

const Sidebar = () => {
    const links = [
        {name: "Dashboard", path:"/", icon: <LayoutDashboard size={20} />},
        {name: "Study Plan", path:"/Study-plan", icon: <BookOpen size={20} />},
        {name: "Progress", path:"/progress", icon: <BarChart size={20} />},
        {name: "Calendar", path:"/calendar", icon: <CalendarDays size={20} />},
        {name: "Pomodoro", path:"/pomodoro", icon: <Timer size={20} />},
        {name: "Settings", path:"/settings", icon: <SettingsIcon size={20} />}
    ];

    return (
        <div className="w-64 h-100 bg-blue-900 p-5 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Smart Study Scheduler</h2>
            <nav className="flex flex-col gap-4">
                {links.map(link =>(
                    <NavLink
                    key = {link.name}
                    to={link.path}
                    className= {({ isActive}) => 
                    `flex items-center gap-3 px-3 py-2 rounded-md ${
                        isActive ? "bg-blue-500 text-white" : "text-white hover:bg-blue-700"}`
                    }
                    >
                        {link.icon}
                        <span> {link.name} </span>
                    </NavLink>
                    
                    
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;