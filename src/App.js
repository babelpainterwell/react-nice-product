// import logo from './logo.svg';
// import './App.css';
import { HashRouter } from "react-router-dom";
import { Routes, Route } from "react-router";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "./MovieHouse/NavBar";
import Home from "./MovieHouse/Home";
import Profile from "./MovieHouse/Profile";
import MovieDetails from "./MovieHouse/MovieDetails";
import SignIn from "./MovieHouse/users/signin";
import SignUp from "./MovieHouse/users/signup";
import { Provider } from "react-redux";
import store from "./MovieHouse/store";
import CurrentUser from "./MovieHouse/users/currentUser";
import UserList from "./MovieHouse/users/usersList";
import Account from "./MovieHouse/users/account";
import * as client from "./MovieHouse/users/client";
import { useEffect, useState } from "react";
import Search from "./MovieHouse/search";
import UserDetails from "./MovieHouse/users/details";
import Movies from "./MovieHouse/users/movies";
import CreateMovieForm from "./MovieHouse/movies/createMovieForm";
import PublishedMovieDetails from "./MovieHouse/movies/details";
// import "dotenv/config.js";

function App() {
  return (
    <Provider store={store}>
      {" "}
      {/* Wrapping the entire application with the Provider */}
      <CurrentUser>
        {" "}
        {/* Wrapping the application with the CurrentUser context */}
        <HashRouter>
          <div>
            <NavBar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/details/:movieId" element={<MovieDetails />} />
              <Route path="/users" element={<UserList />} />
              <Route path="/account" element={<Account />} />
              <Route path="/search" element={<Search />} />
              <Route path="/search/:search" element={<Search />} />
              <Route path="/profile/:id" element={<UserDetails />} />
              <Route path="/profile" element={<UserDetails />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movies/:id" element={<Movies />} />
              <Route path="/create-movie" element={<CreateMovieForm />} />
              <Route
                path="/publishedmoviedetails/:movieId"
                element={<PublishedMovieDetails />}
              />
            </Routes>
          </div>
        </HashRouter>
      </CurrentUser>
    </Provider>
  );
}

export default App;
