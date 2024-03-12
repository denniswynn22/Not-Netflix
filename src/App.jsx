import React, { useState, useEffect } from "react";
import './App.css';
import ReactPlayer from 'react-player'

export default function App() {
  const apiKey = import.meta.env.VITE_MOVIE_API_KEY;
  const [movies, setMovies] = useState([]);
  const [tvOrMovie, setTvOrMovie] = useState("movie");
  const [sciMovies, setSciMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [trailerUrl, setTrailerUrl] = useState('');

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      }
    };

    const searchMovies = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/search/${tvOrMovie}?api_key=${apiKey}&language=en-US&query=${searchQuery}&include_video=true`, options);
      const data = await response.json();
      setMovies(data.results);
    };

    const fetchMovies = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/discover/${tvOrMovie}?api_key=${apiKey}&language=en-US&include_video=true`, options);
      const data = await response.json();
      setMovies(data.results);
    };

    const fetchSciMovies = async () => {
      const genreCode = (tvOrMovie === 'tv') ? 10765 : 878;
      const response = await fetch(`https://api.themoviedb.org/3/discover/${tvOrMovie}?api_key=${apiKey}&language=en-US&include_video=true&with_genres=${genreCode}`, options);
      const data = await response.json();
      setSciMovies(data.results);
    };

    const fetchComedyMovies = async () => {
      const response = await fetch(`https://api.themoviedb.org/3/discover/${tvOrMovie}?api_key=${apiKey}&language=en-US&include_video=true&with_genres=35`, options);
      const data = await response.json();
      setComedyMovies(data.results);
    };

    if (searchQuery) {
      searchMovies();
    } else {
      fetchSciMovies();
      fetchComedyMovies();
      fetchMovies();
    }
  }, [searchQuery, tvOrMovie]);

  const playTrailer = (movieId) => {
    fetchTrailerUrl(movieId);
  };

  const fetchTrailerUrl = async (movieId) => {
    const response = await fetch(`https://api.themoviedb.org/3/${tvOrMovie}/${movieId}?api_key=${apiKey}&append_to_response=videos`);
    const data = await response.json();
    const trailerKey = data?.videos?.results[0]?.key;
    if (trailerKey) {
      setTrailerUrl(trailerKey);
    }
  };

  const titleSegment = (tvOrMovie === 'tv') ? "TV Show" : "Movie";

  return (
    <div className='App'>
      <div className='NavBar'>
        <h1>Not Netflix</h1>
        <div className='searchBar'>
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {/* <button onClick={() => setSearchQuery("")}>Clear</button> */}
        </div>
        <div className='NavBarLinks'>
          <button onClick={() => setTvOrMovie('movie')}>Movies</button>
          <button onClick={() => setTvOrMovie('tv')}>TV Shows</button>
        </div>
      </div>

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

      {trailerUrl && (
        <div className="trailer-container">
          <ReactPlayer url={`https://www.youtube.com/watch?v=${trailerUrl}`} />
        </div>
      )}
    </div>
  );
}
