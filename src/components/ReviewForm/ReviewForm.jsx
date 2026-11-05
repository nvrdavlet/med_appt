import { useState } from 'react';
import GiveReviews from '../GiveReviews/GiveReviews';
import { doctors } from '../../data/doctors';
import { getReviews, saveReview } from '../../utils/reviews';
import './ReviewForm.css';

export default function ReviewForm() {
  const [reviews, setReviews] = useState(getReviews());
  const [activeDoctor, setActiveDoctor] = useState(null);

  const handleSubmit = (review) => {
    saveReview(activeDoctor.id, review);
    setReviews(getReviews()); // the doctor's "Click Here" button becomes disabled
  };

  return (
    <div className="reviews">
      <h1>Reviews</h1>
      <div className="table-wrap">
        <table className="reviews-table">
          <thead>
            <tr>
              <th>Serial Number</th>
              <th>Doctor Name</th>
              <th>Doctor Speciality</th>
              <th>Provide feedback</th>
              <th>Review Given</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((d, i) => {
              const review = reviews[d.id];
              return (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td>{d.name}</td>
                  <td>{d.speciality}</td>
                  <td>
                    {/* Disabled once a review has been submitted for this doctor */}
                    <button className="btn btn-primary" disabled={Boolean(review)} onClick={() => setActiveDoctor(d)}>
                      Click Here
                    </button>
                  </td>
                  <td>
                    {review ? (
                      <span>
                        <span className="review-stars">{'★'.repeat(review.rating)}</span> {review.review}
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {activeDoctor && (
        <div className="modal-backdrop" onClick={() => setActiveDoctor(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <GiveReviews doctor={activeDoctor} onSubmit={handleSubmit} onCancel={() => setActiveDoctor(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
