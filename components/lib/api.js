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