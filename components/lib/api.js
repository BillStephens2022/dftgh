// fetch all episodes from /api/episodes

export async function getEpisodes() {
  try {
    console.log("attempting to get episodes!!!");
    const response = await fetch("/api/episodes/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Error fetching episodes: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error fetching episodes: " + error.message);
  }
}

// fetch a specific episodes from /api/episodes/[episodeId]
export async function getEpisodeById(episodeId) {
  try {
    const response = await fetch(`/api/episodes/${episodeId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const episode = await response.json();
      return episode;
    } else {
      throw new Error("Error fetching episode: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error fetching episode: " + error.message);
  }
}

// add a new episode at /api/episdes
export async function addEpisode(newEpisode) {
  try {
    const response = await fetch("/api/episodes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEpisode),
    });

    if (response.ok) {
      return true; // Episode added successfully
    } else {
      throw new Error("Error adding episode: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error adding episode: " + error.message);
  }
}

// delete a specific episode from /api/episodes/[episodeId]
export async function deleteEpisode(episodeId) {
  try {
    console.log(episodeId);
    const response = await fetch(`/api/episodes/${episodeId}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error("Error deleting episode: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error deleting episode: " + error.message);
  }
}

// edit a specific episode at /api/episodes/[episodeId]
export async function editEpisode(episodeId, updatedEpisode) {
  console.log("Episode Id & updated episode: ", episodeId, updatedEpisode);
  try {
    const response = await fetch(`/api/episodes/${episodeId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEpisode),
    });
    console.log("Response from server:", response);
    if (response.ok) {
      return true;
    } else {
      throw new Error("Error editing episode: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error editing episode: " + error.message);
  }
}

// add a comment to a specific episode at /api/episodes/[episodeId]/comments
export async function addComment(episodeId, newComment) {
  console.log("COMMENT REQUEST: ", episodeId, newComment);
  try {
    const response = await fetch(`/api/episodes/${episodeId}/comments/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    if (response.ok) {
      const addedComment = await response.json();
      return addedComment;
    } else {
      throw new Error("Error adding comment: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error adding comment: " + error.message);
  }
}

// get all comments for a specific episode at /api/episodes/[episodeId]/comments
export async function getCommentsById(episodeId) {
  try {
    const response = await fetch(`/api/episodes/${episodeId}/comments/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const comments = await response.json();
      return comments;
    } else {
      throw new Error("Error fetching comments: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error fetching comments: " + error.message);
  }
}

// delete a specific comment at /api/episodes/[episodeId]/comments/[commentId]
export async function deleteComment(episodeId, commentId) {
  try {
    console.log(commentId);
    const response = await fetch(
      `/api/episodes/${episodeId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return true;
    } else {
      throw new Error("Error deleting comment: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error deleting comment: " + error.message);
  }
}

// add a poll to a specific episode at /api/episodes/[episodeId]/polls
export async function addPoll(episodeId, newPoll) {
  console.log("NEW POLL REQUEST: ", episodeId, newPoll);
  try {
    // Map the options array to the correct format with text and votes properties
    const formattedOptions = newPoll.options.map((option) => ({
      text: option,
      votes: 0, // Set initial votes to 0
    }));
    const response = await fetch(`/api/episodes/${episodeId}/polls/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: newPoll.question,
        options: formattedOptions,
      }),
    });

    if (response.ok) {
      const addedPoll = await response.json();
      return addedPoll;
    } else {
      throw new Error("Error adding poll: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error adding poll: " + error.message);
  }
}

// get all polls for a specific episode at /api/episodes/[episodeId]/polls
export async function getPollsById(episodeId) {
  try {
    const response = await fetch(`/api/episodes/${episodeId}/polls/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const polls = await response.json();
      return polls;
    } else {
      throw new Error("Error fetching polls: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error fetching polls: " + error.message);
  }
}

// increment vote counts using the pollId and the optionIndex of the item voted for
export async function updateVoteCount(episodeId, pollId, optionIndex) {
  try {
    // Send the vote to the server
    const response = await fetch(
      `/api/episodes/${episodeId}/polls/${pollId}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ optionIndex }),
      }
    );

    if (response.ok) {
     
      const updatedPoll = await response.json();
      console.log("updated Poll Data: ", updatedPoll);
      return updatedPoll;
    } else {
      console.error("Error voting on poll:", response.statusText);
    }
  } catch (error) {
    console.error("Error voting on poll:", error);
  }
}

// delete a specific poll at /api/episodes/[episodeId]/polls/[pollId]
export async function deletePoll(episodeId, pollId) {
  try {
    console.log(pollId);
    const response = await fetch(
      `/api/episodes/${episodeId}/polls/${pollId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      return true;
    } else {
      throw new Error("Error deleting poll: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error deleting poll: " + error.message);
  }
}
