import React, { useState, useEffect } from 'react'
import axios from '../../axios';
import './row.css';
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/"
const Row = ( { title, fetchUrl, isLargeRow }) => {

  const [movies, setMovies] = useState([]);
  const [trailerURL, setTrailerURL] = useState("");

  // Runs based on specfic conditions
  useEffect(() => {
    // When row loads on screen, make a request
    // if [], run once when row loads, and don't run again
    async function fetchData(){
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    }
  };

  const handleClick = (movie) =>{
    if(trailerURL){
      setTrailerURL("");
    }else{
      movieTrailer(movie?.name || "")
      .then((url) => {
        console.log(url)
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerURL(urlParams.get("v"));
      })
      .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className='row_posters'>        
        {movies.map(movie => (
          <img 
          key={movie.id}
          onClick={() => handleClick(movie)}
          className={`row_poster ${isLargeRow && "row_poster_large"}`}
          src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} alt={movie.name} />
        ))}
      </div>
      {trailerURL && <YouTube videoId={trailerURL} opts={opts}/>}
    </div>
  );
}

export default Row