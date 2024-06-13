import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { API_OPTIONS,GEMINI_KEY } from "../../utils/constants/constants";
import lang from "../../utils/constants/languageConstants";
import { addGptMovieResult, clearMovieResults, setSearchBtnClicked } from "../../utils/slices/gptSlice";
import { GoogleGenerativeAI } from "@google/generative-ai";
const GPTSearchBar = () => {
  const langKey = useSelector((store) => store.config.lang);
  const searchText = useRef(null);
  const dispatch = useDispatch();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [error, setError] = useState(null);
  const genAI = new GoogleGenerativeAI(GEMINI_KEY);

  const handleGptSearchClick = async () => {
    setLoadingBtn(true);

    const searchTextValue = searchText.current.value.trim();

    if (!searchTextValue) {
      setError("Please enter a valid movie query");
      setLoadingBtn(false);
      return;
    }

    try {
      dispatch(clearMovieResults());
      dispatch(setSearchBtnClicked(true));

      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt =
        "Act as a movie recommendation system and suggest some movies for the query: " +
        searchTextValue +
        ". Only give me names of movies, comma separated like the example result given ahead. Example result: Gadar, Sholay, Godzilla, Pathaan, 3 Idiots.";
      
      const result = await model.generateContent(prompt);
      const gptResults = await result.response;
      const gptMovies = gptResults.candidates?.[0]?.content?.parts?.[0]?.text.split(",");

      setLoadingBtn(false);

      if (!gptMovies) {
        throw new Error("Failed to generate movie suggestions from GPT model.");
      }

      const promiseArray = gptMovies.map((movie) => searchMovieTMDB(movie));
      const tmdbResults = await Promise.all(promiseArray);

      dispatch(addGptMovieResult({ movieNames: gptMovies, movieResults: tmdbResults }));
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("Movie recommendations powered by Gemini are unavailable on request due to paid APIs");
      setLoadingBtn(false);
    }
  };

  // Search movie in TMDB
  const searchMovieTMDB = async (movie) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie)}&include_adult=false&page=1&sort_by=popularity.desc`,
        API_OPTIONS
      );
      const json = await response.json();
      return json.results;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="md:pt-[12%] pt-[40%] flex justify-center">
      <form
        className="w-full px-5 md:w-1/2 grid grid-cols-12"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={searchText}
          type="text"
          className="p-3 col-span-9 rounded-l-full outline-none text-center text-sm sm:text-base"
          placeholder={lang[langKey].GPTSearchPlaceholder}
        />
        <button
          className="col-span-3 py-2 px-4 bg-red-700 hover:bg-red-800 text-white rounded-r-full"
          onClick={handleGptSearchClick}
          disabled={loadingBtn}
        >
          {loadingBtn ? "Loading..." : lang[langKey].search}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default GPTSearchBar;
