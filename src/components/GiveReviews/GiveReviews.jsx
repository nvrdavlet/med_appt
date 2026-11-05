import { useState } from 'react';

export default function GiveReviews({ doctor, onSubmit, onCancel }) {
  const [name, setName] = useState(sessionStorage.getItem('name') || '');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [warning, setWarning] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !review.trim() || rating === 0) {
      setWarning('Please fill out all fields and select a rating.');
      return;
    }
    onSubmit({ name, review, rating });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Give Your Feedback</h2>
      <p className="subtitle" style={{ textAlign: 'center', color: 'var(--muted)' }}>for {doctor.name}</p>

      {warning && <p className="error-text">{warning}</p>}

      <div className="form-group">
        <label htmlFor="review-name">Name</label>
        <input id="review-name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="review-text">Review</label>
        <textarea id="review-text" rows="4" className="form-control" value={review} onChange={(e) => setReview(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Rating</label>
        <div className="rating-selector">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} className={n <= rating ? 'on' : ''} aria-label={`${n} stars`} onClick={() => setRating(n)}>★</button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">Submit</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
