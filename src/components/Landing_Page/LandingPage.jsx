import { Link } from 'react-router-dom';
import './LandingPage.css';

const services = [
  { title: 'Instant Consultation', text: 'Talk to an available doctor online right now.', to: '/instant-consultation' },
  { title: 'Book an Appointment', text: 'Find a specialist and pick a time that suits you.', to: '/booking-consultation' },
  { title: 'Doctor Reviews', text: 'Share feedback about the doctors you have visited.', to: '/reviews' },
];

export default function LandingPage() {
  return (
    <>
      <section className="hero">
        <p className="hero-eyebrow">Your health, our responsibility</p>
        <h1>Find the right doctor and book a visit in minutes</h1>
        <p className="hero-text">
          StayHealthy connects you with trusted doctors for in-person appointments and instant online consultations.
        </p>
        <div className="hero-actions">
          <Link to="/booking-consultation" className="btn btn-primary">Get Started</Link>
          <Link to="/instant-consultation" className="btn btn-outline">Instant Consultation</Link>
        </div>
      </section>

      <section className="services">
        {services.map((s) => (
          <Link key={s.title} to={s.to} className="service-card">
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <span>Open →</span>
          </Link>
        ))}
      </section>
    </>
  );
}
