import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './components/Landing_Page/LandingPage';
import SignUp from './components/Sign_Up/Sign_Up';
import Login from './components/Login/Login';
import BookingConsultation from './components/BookingConsultation/BookingConsultation';
import InstantConsultation from './components/InstantConsultation/InstantConsultation';
import ReviewForm from './components/ReviewForm/ReviewForm';
import ProfileCard from './components/ProfileCard/ProfileCard';
import Notification from './components/Notification/Notification';
import ReportsLayout from './components/ReportsLayout/ReportsLayout';

export default function App() {
  return (
    <>
      <Navbar />
      {/* Notification wraps the pages so an appointment banner shows everywhere */}
      <Notification>
        <main className="page">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booking-consultation" element={<BookingConsultation />} />
            <Route path="/instant-consultation" element={<InstantConsultation />} />
            <Route path="/reviews" element={<ReviewForm />} />
            <Route path="/profile" element={<ProfileCard />} />
            <Route path="/reports" element={<ReportsLayout />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </main>
      </Notification>
      <footer className="footer">© {new Date().getFullYear()} StayHealthy. Your health, our responsibility.</footer>
    </>
  );
}
