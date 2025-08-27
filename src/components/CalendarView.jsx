import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';
import { useEffect } from 'react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = ({ tasks }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
      const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        if(!token) return;

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();  

        const mappedEvents = data.map((task) => ({
            title: `${ task.subject } (${ task.priority })`,
            start: new Date(task.datetime),
            end: new Date(new Date(task.datetime).getTime() + 60 * 60 * 1000),
        }));

        setEvents(mappedEvents);
      };

      fetchTasks();

    }, [tasks]);

  return (
    <div className="p-4 bg-white rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">📅 Calendar</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}

        eventPropGetter={(event) => {
            const color =
                event.title.includes('High') ? '#f87171' :
                event.title.includes('Medium') ? '#facc15' : '#4ade80';
                return { style: { backgroundColor: color }};
        }}
      />
    </div>
  );
};

export default CalendarView;
