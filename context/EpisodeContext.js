import React, { createContext, useContext, useReducer } from "react";

// Create the context
const EpisodeContext = createContext();

// Define the initial state for episodes
const initialState = {
  episodes: [],
};

// Define the reducer function
const episodeReducer = (state, action) => {
  switch (action.type) {
    case "SET_EPISODES":
      return { ...state, episodes: action.payload };
    case "ADD_EPISODE":
      return { ...state, episodes: [...state.episodes, action.payload] };
    default:
      return state;
  }
};

// Create the EpisodeProvider component
export const EpisodeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(episodeReducer, initialState);

  return (
    <EpisodeContext.Provider value={{ state, dispatch }}>
      {children}
    </EpisodeContext.Provider>
  );
};

// Custom hook to use the episode context
export const useEpisodeContext = () => {
  const context = useContext(EpisodeContext);
  if (!context) {
    throw new Error("useEpisodeContext must be used within an EpisodeProvider");
  }
  return context;
};