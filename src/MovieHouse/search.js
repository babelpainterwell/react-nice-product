import React, { useState, useEffect } from "react";
// import { API_KEY } from "./client";
import * as client from "./client";
import { Link, useParams, useNavigate } from "react-router-dom";
import MovieCard from "./MovieCard";

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
      <h1>Search</h1>
      <button
        onClick={() => navigate(`/search/${searchTerm}`)}
        className="btn btn-primary float-end"
      >
        Search
      </button>
      <input
        type="text"
        className="form-control w-75"
        placeholder="Type the key term of the movie you want to search"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
      />
      <h2 className="mt-5">Results</h2>
      {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}
      <div className="row">
        {results &&
          results.map((movie) => (
            <div key={movie.id} className="col-md-3 mb-3">
              <MovieCard movie={movie} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Search;
