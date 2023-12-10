import React from "react";
import { Link } from "react-router-dom";

function PublishedMovieCard({ movie }) {
  const placeholderImage = "../../placeholder.png";

  return (
    <Link
      to={`/publishedmoviedetails/${movie._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card" style={{ width: "18rem" }}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2/${movie.poster_path}`
              : placeholderImage
          }
          className="card-img-top"
          alt={movie.original_title}
          style={{ height: "400px", objectFit: "cover" }}
        />
        <div
          className="card-body"
          style={{ height: "230px", overflow: "hidden" }}
        >
          <h5 className="card-title">{movie.original_title}</h5>
          <p
            className="card-text"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {movie.overview}
          </p>
          <p className="card-text">
            <small className="text-muted">
              Release Date: {movie.release_date}
            </small>
          </p>
        </div>
      </div>
    </Link>
  );
}

export default PublishedMovieCard;
