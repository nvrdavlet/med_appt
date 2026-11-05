import { useSearchParams } from 'react-router-dom';
import FindDoctorSearch from '../FindDoctorSearch/FindDoctorSearch';
import DoctorCard from '../DoctorCard/DoctorCard';
import { doctors } from '../../data/doctors';

// Results route: reads ?speciality= set by FindDoctorSearch and lists matching doctors.
export default function BookingConsultation({ instant = false }) {
  const [searchParams] = useSearchParams();
  const speciality = searchParams.get('speciality') || '';

  const results = speciality
    ? doctors.filter((d) => d.speciality.toLowerCase().includes(speciality.toLowerCase()))
    : [];

  return (
    <>
      <FindDoctorSearch
        key={speciality}
        title={instant ? 'Find a doctor for an instant consultation' : 'Find a doctor at your own ease'}
      />

      {speciality && (
        <>
          <div className="doctor-count">
            <h2>{results.length} doctors are available for {speciality}</h2>
            <p>Book appointments with minimum wait-time & verified doctor details</p>
          </div>
          <div className="doctor-list">
            {results.map((d) => <DoctorCard key={d.id} doctor={d} instant={instant} />)}
          </div>
        </>
      )}
    </>
  );
}
