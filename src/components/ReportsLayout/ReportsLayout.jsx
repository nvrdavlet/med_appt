import { doctors } from '../../data/doctors';
import '../ReviewForm/ReviewForm.css';

const REPORT_URL = './patient_report.pdf';

// Your Reports: view or download the patient report (PDF) for each doctor.
export default function ReportsLayout() {
  return (
    <div className="reviews">
      <h1>Reports</h1>
      <div className="table-wrap">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Doctor Name</th>
              <th>Doctor Speciality</th>
              <th>View Report</th>
              <th>Download Report</th>
            </tr>
          </thead>
          <tbody>
            {doctors.slice(4, 6).map((d, i) => (
              <tr key={d.id}>
                <td>{i + 1}</td>
                <td>{d.name}</td>
                <td>{d.speciality}</td>
                <td><a className="btn btn-primary" href={REPORT_URL} target="_blank" rel="noreferrer">View Report</a></td>
                <td><a className="btn btn-outline" href={REPORT_URL} download="patient_report.pdf">Download Report</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
