import { useEffect, useState } from 'react';

const storageKey = (doctorId) => `reviewData_${doctorId}`;

function loadReviewData(doctorId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(doctorId)));
  } catch {
    return null;
  }
}

// Review form: Name, Review text and a 1–5 star rating selector.
// reviewData holds the submitted review. It is saved to localStorage, and while
// it exists the form and the Submit button are disabled (post-submission disabling).
export default function GiveReviews({ doctor, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: sessionStorage.getItem('name') || '',
    review: '',
    rating: 0,
  });
  const [reviewData, setReviewData] = useState(() => loadReviewData(doctor.id));
  const [showWarning, setShowWarning] = useState(false);

  // Save reviewData whenever it changes so the disabled state survives a reload
  useEffect(() => {
    if (reviewData) localStorage.setItem(storageKey(doctor.id), JSON.stringify(reviewData));
  }, [doctor.id, reviewData]);

  const isSubmitted = Boolean(reviewData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowWarning(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitted) return;
    if (!formData.name.trim() || !formData.review.trim() || formData.rating === 0) {
      setShowWarning(true);
      return;
    }
    setReviewData(formData); // saved + form becomes disabled
    if (onSubmit) onSubmit(formData);
  };

  const shown = reviewData || formData;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Give Your Feedback</h2>
      <p className="subtitle" style={{ textAlign: 'center', color: 'var(--muted)' }}>for {doctor.name}</p>

      {showWarning && <p className="error-text">Please fill out all fields and select a rating.</p>}
      {isSubmitted && <p className="review-submitted">Thank you! Your review has been submitted.</p>}

      <fieldset disabled={isSubmitted} style={{ border: 0, padding: 0, margin: 0 }}>
        <div className="form-group">
          <label htmlFor="review-name">Name</label>
          <input id="review-name" name="name" className="form-control" value={shown.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="review-text">Review</label>
          <textarea id="review-text" name="review" rows="4" className="form-control" value={shown.review} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Rating</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button" key={n} aria-label={`${n} stars`}
                className={n <= shown.rating ? 'on' : ''}
                onClick={() => { setFormData({ ...formData, rating: n }); setShowWarning(false); }}
              >★</button>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isSubmitted}>
          {isSubmitted ? 'Submitted' : 'Submit'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>{isSubmitted ? 'Close' : 'Cancel'}</button>
      </div>
    </form>
  );
}
