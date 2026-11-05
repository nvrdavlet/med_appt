import { useState } from 'react';

// Review form: Name, Review text and a 1–5 star rating selector.
// After submission the form and the Submit button are disabled so the same
// doctor cannot be reviewed twice; ReviewForm also disables its "Click Here" button.
export default function GiveReviews({ doctor, existingReview = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: existingReview?.name || sessionStorage.getItem('name') || '',
    review: existingReview?.review || '',
    rating: existingReview?.rating || 0,
  });
  const [submitted, setSubmitted] = useState(Boolean(existingReview));
  const [showWarning, setShowWarning] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setShowWarning(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted) return;
    if (!formData.name.trim() || !formData.review.trim() || formData.rating === 0) {
      setShowWarning(true);
      return;
    }
    setSubmitted(true); // disable the form after a successful submit
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Give Your Feedback</h2>
      <p className="subtitle" style={{ textAlign: 'center', color: 'var(--muted)' }}>for {doctor.name}</p>

      {showWarning && <p className="error-text">Please fill out all fields and select a rating.</p>}
      {submitted && <p className="review-submitted">Thank you! Your review has been submitted.</p>}

      <fieldset disabled={submitted} style={{ border: 0, padding: 0, margin: 0 }}>
        <div className="form-group">
          <label htmlFor="review-name">Name</label>
          <input id="review-name" name="name" className="form-control" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="review-text">Review</label>
          <textarea id="review-text" name="review" rows="4" className="form-control" value={formData.review} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Rating</label>
          <div className="rating-selector">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button" key={n} aria-label={`${n} stars`}
                className={n <= formData.rating ? 'on' : ''}
                onClick={() => { setFormData({ ...formData, rating: n }); setShowWarning(false); }}
              >★</button>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitted}>
          {submitted ? 'Submitted' : 'Submit'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>{submitted ? 'Close' : 'Cancel'}</button>
      </div>
    </form>
  );
}
