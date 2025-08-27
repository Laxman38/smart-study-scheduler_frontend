import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Pomodoro from './pages/Pomodoro';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import StudyPlan from './pages/Studyplan';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="signup" element={<Signup/>} />
          <Route path="login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
            }
          >

            <Route index element={<Dashboard />} />
            <Route path="study-plan" element={<StudyPlan />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="pomodoro" element={<Pomodoro />} />
            <Route path="progress" element={<Progress />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position='top-center'/>
    </div>
  );
}

export default App;

