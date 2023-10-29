export async function getEpisodes() {
  try {
    const response = await fetch("/api/episodes", {
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

export async function getEpisodeById(episodeId) {
    try {
      const response = await fetch(`/api/episodes/${episodeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const episode = await response.json();
        return episode;
      } else {
        throw new Error('Error fetching episode: ' + response.statusText);
      }
    } catch (error) {
      throw new Error('Error fetching episode: ' + error.message);
    }
  }

export async function addEpisode(newEpisode) {
  try {
    const response = await fetch("/api/episodes", {
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

export async function deleteEpisode(episodeId) {
  try {
    console.log(episodeId);
    const response = await fetch(`/api/episodes/${episodeId}`, {
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

export async function editEpisode(episodeId, updatedEpisode) {
  try {
    const response = await fetch(`/api/episodes/${episodeId}`, {
      method: "PUT", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEpisode),
    });

    if (response.ok) {
      return true; 
    } else {
      throw new Error("Error editing episode: " + response.statusText);
    }
  } catch (error) {
    throw new Error("Error editing episode: " + error.message);
  }
}

