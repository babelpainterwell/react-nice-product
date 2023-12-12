import React, { useState, useEffect } from "react";
import * as movieClient from "./client"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { MdFileUpload } from "react-icons/md";

function CreateMovieForm() {
  const { currentUser } = useSelector((state) => state.userReducer);
  const [formData, setFormData] = useState({
    user: currentUser._id || "",
    original_title: "",
    overview: "",
    original_language: "",
    poster_path: "",
    adult: false,
    release_date: "", // Added a new field for release date
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      poster_path: null, // Overriding poster_path to always be null
    };
    try {
      const response = await movieClient.createMovie(submitData);
      console.log("Movie created:", response);
      navigate("/movies"); // Navigate back to the movies list
    } catch (error) {
      console.error("Error creating movie:", error);
      // Handle error, maybe show a user-friendly message
    }
  };

  useEffect(() => {
    if (!currentUser) {
      alert("Please sign in to create a movie.");
      navigate("/signin");
    } else if (currentUser.role !== "DIRECTOR") {
      alert("You must be a director to create a movie.");
      navigate("/profile");
    }
  }, [currentUser, navigate]); // Depend on currentUser and navigate

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <div className="mb-4">
        <label htmlFor="original_title" className="form-label">
          Original Title
        </label>
        <input
          type="text"
          className="form-control"
          id="original_title"
          name="original_title"
          value={formData.original_title}
          onChange={handleChange}
          placeholder="Mission: Impossible - Dead Reckoning Part One"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="overview" className="form-label">
          Overview
        </label>
        <textarea
          className="form-control"
          rows={5}
          id="overview"
          name="overview"
          value={formData.overview}
          onChange={handleChange}
          placeholder="Ethan and his team take on their most impossible mission yet when they have to eradicate an international rogue organization as highly skilled as they are and committed to destroying the IMF."
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="original_language" className="form-label">
          Original Language
        </label>
        <select
          className="form-control"
          id="original_language"
          name="original_language"
          value={formData.original_language}
          onChange={handleChange}
          required
        >
          <option value="">Select a Language</option>
          <option value="en">English (en)</option>
          <option value="es">Spanish (es)</option>
          <option value="fr">French (fr)</option>
          <option value="de">German (de)</option>
          <option value="ja">Japanese (ja)</option>
          <option value="zh">Chinese (zh)</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="poster_path" className="form-label">
          Poster Path (URL)
        </label>
        <input
          type="text"
          className="form-control"
          id="poster_path"
          name="poster_path"
          value={formData.poster_path}
          onChange={handleChange}
          placeholder="default to be null in our setting..."
          disabled
        />
      </div>
      <div className="mb-4">
        <label htmlFor="release_date" className="form-label">
          Release Date
        </label>
        <input
          type="date"
          className="form-control"
          id="release_date"
          name="release_date"
          value={formData.release_date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="adult"
          name="adult"
          checked={formData.adult}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="adult">
          Adult Content
        </label>
      </div>
      <button
        type="submit"
        className="btn btn-info text-white mt-5"
        style={{ float: "right" }}
      >
        <MdFileUpload className="me-2" />
        Submit
      </button>
    </form>
  );
}

export default CreateMovieForm;
