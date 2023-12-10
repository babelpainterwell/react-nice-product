import React from "react";
import moment from "moment";
function ReviewList({ reviews }) {
  return (
    <div>
      <h3 className="mb-3 mt-2">Reviews</h3>
      {reviews.length > 0 ? (
        <ul className="list-group list-group-flush">
          {reviews.map((review) => (
            <li key={review._id} className="list-group-item">
              <blockquote className="blockquote">
                <p className="mb-1">{review.content}</p>
                <footer className="blockquote-footer mt-1">
                  Reviewed by:
                  <a
                    href={`/#/profile/${review.user._id}`}
                    className="text-decoration-none"
                  >
                    <span className="badge bg-secondary ms-1">
                      {review.user.username}
                    </span>
                  </a>
                  <small className="text-muted ms-2">
                    {moment(review.createdAt).format("MMMM Do, YYYY")}
                  </small>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No reviews available for this movie.</p>
      )}
    </div>
  );
}

export default ReviewList;
