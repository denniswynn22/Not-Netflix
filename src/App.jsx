import React, { useState, useEffect } from "react"
import './App.css'

export default function App() {

  const [movies, setMovies] = useState([])
  const [tvOrMovie, setTvOrMovie] = useState("movie")

  useEffect(() => {
    const fetcher = async () => {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        }
      }
      const apiKey = import.meta.env.VITE_MOVIE_API_KEY
      // console.log(apiKey);
      const response = await fetch(`https://api.themoviedb.org/3/discover/${tvOrMovie}?api_key=${apiKey}&language=en-US&include_video=true`, options);

      const data = await response.json();
      // console.log(data.results);
      setMovies(data.results);
    };

    fetcher();
  }, [tvOrMovie])

  function MovieCard({ movie }) {
    console.log(movie);
    return (
      <div className="movie-card">
        <img src={'https://image.tmdb.org/t/p/w500' + movie['poster_path']} alt={movie.title} className="movie-poster" />
      </div>
    )
  }

  return (
    <div className='App'>
      <div className='NavBar'>
        <h1>Not Netflix</h1>
        <div className='NavBarLinks'>
        <button onClick={() => setTvOrMovie('movie')}>Movies</button>
        <button onClick={() => setTvOrMovie('tv')}>TV Shows</button>
        </div>
      </div>
      
      <h2> New Releases</h2>
      <div className='movieContainer'>
        {
          movies.map((movie, index) => {
            return (
              <MovieCard movie={movie} key={index} />
            )
          }
          )
        }
      </div>
    </div>
  )
}



