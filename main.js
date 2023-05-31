const apiKey = "AIzaSyD1_Q3Zg-A43h7XKOEdYPf_O1HFYiuV-Jo";
let currentVideoId = null;
let player;

function loadRandomVideo() {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&videoEmbeddable=true&maxResults=1&fields=items(id(videoId))`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          const videoId = data.items[0].id.videoId;
          if (videoId !== currentVideoId) {
            currentVideoId = videoId;
            if (player) {
              player.loadVideoById(videoId);
            } else {
              displayVideo(videoId);
            }
          } else {
            // If the same video is returned, load another random video
            loadRandomVideo();
          }
        } else {
          console.error("No videos found.");
        }
      })
      .catch(error => console.error(error));
  }
  
  // rest of the code remains the same

function displayVideo(videoId) {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0
    },
    events: {
      onStateChange: event => {
        if (event.data === YT.PlayerState.ENDED) {
          loadRandomVideo();
        }
      }
    }
  });
}

function searchForVideos(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&type=video&videoEmbeddable=true&maxResults=50&q=${query}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const videos = data.items;
        if (!videos || videos.length === 0) {
          console.log("No videos found.");
          document.querySelector("#no-results").style.display = "block";
        } else {
          const videoList = document.querySelector("#search-results");
          videoList.innerHTML = ""; // Clear previous search results
          videos.forEach(video => {
            const videoCard = document.createElement("div");
            videoCard.classList.add("video-card");
            videoCard.innerHTML = `
              <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="_blank">
                <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}" />
                <h2>${video.snippet.title}</h2>
                <p>${video.snippet.description}</p>
              </a>
            `;
            videoList.appendChild(videoCard);
          });
        }
      })
      .catch(error => console.error(error));
  }
  
  

document.addEventListener("DOMContentLoaded", () => {
  // Load a random video on page load
  loadRandomVideo();

  // Handle form submission
  const form = document.querySelector("#search-form");
  const input = document.querySelector("#search-input");

  form.addEventListener("submit", event => {
    event.preventDefault();
    searchForVideos(input.value);
    input.value = "";
  });
});
