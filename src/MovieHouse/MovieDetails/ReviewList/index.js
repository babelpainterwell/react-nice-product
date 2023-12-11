import React from "react";
import moment from "moment";
import { FaComment, FaShareAlt, FaSave } from "react-icons/fa"; // Importing required icons

function ReviewList({ reviews }) {
  return (
    <div>
      <h3 className="mb-4 mt-3 text-bold text-info">
        Reviews ({reviews.length})
      </h3>
      <hr />
      {reviews.length > 0 ? (
        <ul className="list-group list-group-flush">
          {reviews.map((review) => (
            <li key={review._id} className="list-group-item border-bottom">
              {/* Reviewer details at the top */}
              <div className="mb-2">
                <a
                  href={`/#/profile/${review.user._id}`}
                  className="text-bold text_underline text-info"
                >
                  <strong>{review.user.username}</strong>
                </a>
                <span
                  className="text-muted ms-2"
                  style={{ fontSize: "0.85em" }}
                >
                  {moment(review.createdAt).format("MMMM Do, YYYY")}
                </span>
              </div>

              {/* Review content */}
              <p className="text-bold" style={{ fontSize: "1.1em" }}>
                {review.content}
              </p>

              {/* Icons at the bottom */}
              <div className="d-flex justify-content-end">
                <FaComment
                  className="me-3 text-info"
                  style={{ cursor: "pointer" }}
                />
                <FaShareAlt
                  className="me-3 text-info"
                  style={{ cursor: "pointer" }}
                />
                <FaSave className="text-info" style={{ cursor: "pointer" }} />
              </div>
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
