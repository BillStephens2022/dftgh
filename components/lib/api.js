// fetch all episodes from /api/episodes

export async function getEpisodes() {
  try {
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
      console.log("Printing episode details: ", episode);
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
    const response = await fetch(`/api/episodes/${episodeId}/comments/${commentId}`, {
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
