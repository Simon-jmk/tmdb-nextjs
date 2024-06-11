import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";

const MovieCard = ({ movie, isFavorited, onButtonClick }) => {
  const votePercentage = Math.round(movie.vote_average * 10);
  let pathColor;
  if (votePercentage < 40) {
    pathColor = "#d1225c";
  } else if (votePercentage < 70) {
    pathColor = "#d2d531";
  } else {
    pathColor = "#21cd78";
  }

  let trailColor;
  if (votePercentage < 40) {
    trailColor = "#571435";
  } else if (votePercentage < 70) {
    trailColor = "#363612";
  } else {
    trailColor = "#204529";
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative flex flex-col group">
      <div className="relative h-0" style={{ paddingBottom: "150%" }}>
        <img
          src={`https://image.tmdb.org/t/p/w440_and_h660_face${movie.poster_path}`}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          onClick={() => onButtonClick(movie.id)}
          className="absolute top-3 right-3 text-white hover:text-red-500 text-4xl cursor-pointer opacity-0 group-hover:opacity-80 transition-opacity"
          style={{ filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.6))" }} // Add shadow here
        >
          <FontAwesomeIcon icon={isFavorited ? faHeartBroken : faHeart} />
        </div>
      </div>
      <div className="absolute top-2 left-2 w-14 h-14 bg-[#081c22] border-4 border-[#081c22] rounded-full flex items-center justify-center">
        <CircularProgressbar
          value={votePercentage}
          text={`${votePercentage}°`}
          styles={buildStyles({
            textSize: "24px",
            textColor: "#fff",
            pathColor: pathColor,
            trailColor: trailColor,
          })}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow justify-between">
        <div>
          <h2 className="font-bold mb-2 overflow-ellipsis whitespace-nowrap overflow-hidden">
            {movie.title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
