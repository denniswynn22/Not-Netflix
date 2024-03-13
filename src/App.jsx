import React, { useState, useEffect } from "react";
import './App.css';
import ReactPlayer from 'react-player'

// Define the main component
export default function App() {
  // Fetch API key from environment variables
  const apiKey = import.meta.env.VITE_MOVIE_API_KEY;

  // State variables to hold data
  const [movies, setMovies] = useState([]);
  const [tvOrMovie, setTvOrMovie] = useState("movie");
  const [sciMovies, setSciMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [trailerUrl, setTrailerUrl] = useState('');

  // useEffect to fetch data from API
  useEffect(() => {
    // Options for API requests
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    };

    // Function to search for movies based on query
    const searchMovies = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/search/${tvOrMovie}?api_key=${apiKey}&language=en-US&query=${searchQuery}&include_video=true`, options);
      const data = await response.json();
      setMovies(data.results);
    };

    // Function to fetch movies based on selected category
    const fetchMovies = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/discover/${tvOrMovie}?api_key=${apiKey}&language=en-US&include_video=true`, options);
      const data = await response.json();
      setMovies(data.results);
    };

    // Function to fetch sci-fi movies
    const fetchSciMovies = async () => {
      const genreCode = (tvOrMovie === 'tv') ? 10765 : 878;
      const response = await fetch(`https://api.themoviedb.org/3/discover/${tvOrMovie}?api_key=${apiKey}&language=en-US&include_video=true&with_genres=${genreCode}`, options);
      const data = await response.json();
      setSciMovies(data.results);
    };

    // Function to fetch comedy movies
    const fetchComedyMovies = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/discover/${tvOrMovie}?api_key=${apiKey}&language=en-US&include_video=true&with_genres=35`, options);
      const data = await response.json();
      setComedyMovies(data.results);
    };

    // Conditionally call functions based on search or default fetch
    if (searchQuery) {
      searchMovies();
    } else {
      fetchSciMovies();
      fetchComedyMovies();
      fetchMovies();
    }
  }, [searchQuery, tvOrMovie]);

  // Function to play trailer of a movie
  const playTrailer = (movieId) => {
    fetchTrailerUrl(movieId);
  };

  // Function to fetch trailer URL of a movie
  const fetchTrailerUrl = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/${tvOrMovie}/${movieId}?api_key=${apiKey}&append_to_response=videos`);
    const data = await response.json();
    const trailerKey = data?.videos?.results[0]?.key;
    if (trailerKey) {
      setTrailerUrl(trailerKey);
    }
  };

  // Determine if it's TV show or movie for title
  const titleSegment = (tvOrMovie === 'tv') ? "TV Show" : "Movie";

  // Render the component
  return (
    <div className='App'>
      <div className='NavBar'>
        <h1>Not Netflix</h1>
        <div className='searchBar'>
          {/* Input for searching */}
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <div className='NavBarLinks'>
          {/* Buttons to switch between movies and TV shows */}
          <button onClick={() => setTvOrMovie('movie')}>Movies</button>
          <button onClick={() => setTvOrMovie('tv')}>TV Shows</button>
        </div>
      </div>

      {/* Display search results */}
      {searchQuery && (
        <>
          <h2>Search Results</h2>
          <div className='movieContainer'>
            {movies.map((movie, index) => (
              <div className="movie-card" key={index}>
                <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} className="movie-poster" />
                <button onClick={() => playTrailer(movie.id)}>Play Trailer</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Display default content */}
      {!searchQuery && (
        <>
          <h2> New Releases</h2>
          <div className='movieContainer'>
            {movies.map((movie, index) => (
              <div className="movie-card" key={index}>
                <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} className="movie-poster" />
                <button onClick={() => playTrailer(movie.id)}>Play Trailer</button>
              </div>
            ))}
          </div>

          <h2>Sci-Fi {titleSegment}s</h2>
          <div className='movieContainer'>
            {sciMovies.map((movie, index) => (
              <div className="movie-card" key={index}>
                <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} className="movie-poster" />
                <button onClick={() => playTrailer(movie.id)}>Play Trailer</button>
              </div>
            ))}
          </div>

          <h2>Comedy {titleSegment}s</h2>
          <div className='movieContainer'>
            {comedyMovies.map((movie, index) => (
              <div className="movie-card" key={index}>
                <img src={'https://image.tmdb.org/t/p/w500' + movie.poster_path} alt={movie.title} className="movie-poster" />
                <button onClick={() => playTrailer(movie.id)}>Play Trailer</button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Display trailer */}
      {trailerUrl && (
        <div className="trailer-container">
          <ReactPlayer url={`https://www.youtube.com/watch?v=${trailerUrl}`} />
        </div>
      )}
    </div>
  );
}
