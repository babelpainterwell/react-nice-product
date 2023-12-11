import React, { useState, useEffect } from "react";
import * as client from "./client";
import { Link, useParams, useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";
import { FaSearch } from "react-icons/fa";

function Search() {
  const { search } = useParams();
  const [searchTerm, setSearchTerm] = useState(search || "moon");
  const [results, setResults] = useState([]);

  const navigate = useNavigate();

  const fetchMovies = async (search) => {
    const results = await client.findMovies(search);
    setResults(results);
    setSearchTerm(search);
  };

  useEffect(() => {
    if (search) {
      fetchMovies(search);
    } else {
      fetchMovies(searchTerm);
    }
  }, [search]);

  return (
    <div className="container">
      {/* Header */}
      <div className="py-4">
        <h1 className="display-4 text-center">Movie Search</h1>
      </div>

      {/* Search input and button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Type the key term of the movie you want to search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button
          onClick={() => navigate(`/search/${searchTerm}`)}
          className="btn btn-info btn-lg ms-3 text-white d-flex align-items-center"
        >
          <FaSearch className="me-2" />
          Search
        </button>
      </div>

      {/* Results Section */}
      <h2 className="mb-3">Results</h2>
      <div className="row">
        {results.length > 0 ? (
          results.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-4">
              <MovieCard movie={movie} />
            </div>
          ))
        ) : (
          <p className="text-muted">
            No movies found. Please try a different search.
          </p>
        )}
      </div>
    </div>
  );
}

export default Search;
