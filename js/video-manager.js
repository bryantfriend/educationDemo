// Version 1.0.2 - June 1, 2025 - Handles video logic and persistent branching

import { debugLog } from './debug.js';
let lessonData = [];
fetch('../data/lesson-data.json')
  .then(response => response.json())
  .then(json => {
    lessonData = json;
    // You can call a function here like loadInitialVideo(lessonData)
  })
  .catch(err => console.error("❌ Failed to load lesson data", err));


debugLog("🎥 Video Manager loaded");

let currentVideoEl;

/**
 * Displays persistent choice buttons until the user selects one.
 * @param {Array} choices - Array of choice objects (label + color + nextId)
 */
function showChoiceButtons(choices) {
  const container = document.createElement('div');
  container.id = 'choice-container';

  choices.forEach(choice => {
    const button = document.createElement('button');
    button.classList.add('choice-button');
    button.innerText = choice.label;
    button.style.backgroundColor = choice.color || '#1e90ff';

    button.addEventListener('click', () => {
      debugLog("✅ Choice selected:", choice.label);

      // Remove buttons
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }

      // Load next video by nextId
      const nextVideo = lessonData.find(v => v.id === choice.nextId);
      if (nextVideo) {
        loadVideo(nextVideo);
      } else {
        debugLog("❌ nextId not found in JSON:", choice.nextId);
      }
    });

    container.appendChild(button);
  });

  document.body.appendChild(container);
}

/**
 * Loads a video from a lesson node and applies it to the videosphere.
 * @param {Object} videoData - A single node from lesson-data.json
 */
export function loadVideo(videoData) {
  debugLog("▶️ Loading video:", videoData.id);

  const videoId = `video-${videoData.id}`;
  const existingVideo = document.querySelector(`#${videoId}`);
  const sceneEl = document.querySelector('a-scene');
  const sphereEl = document.querySelector('#video-sphere');

  function setAndPlayVideo(videoEl) {
    videoEl.muted = false;
    videoEl.volume = 1.0;
    videoEl.setAttribute('playsinline', 'true');
    videoEl.setAttribute('webkit-playsinline', 'true');

    sphereEl.setAttribute('src', `#${videoId}`);
    debugLog("🎬 Setting videosphere source:", videoId);

    videoEl.play()
      .then(() => debugLog("🎬 Video started playing:", videoId))
      .catch(err => debugLog("⚠️ Video play error:", err));
  }

  if (!existingVideo) {
    const videoEl = document.createElement('video');
    videoEl.setAttribute('id', videoId);
    videoEl.setAttribute('crossorigin', 'anonymous');
    videoEl.setAttribute('preload', 'auto');
    videoEl.setAttribute('src', videoData.videoURL);
    videoEl.setAttribute('loop', false);
    videoEl.setAttribute('type', 'video/mp4');

    videoEl.addEventListener('loadeddata', () => {
      debugLog("🎬 Video data loaded for:", videoId);
      setAndPlayVideo(videoEl);
    });

    videoEl.addEventListener('ended', () => {
      debugLog("⏹ Video ended:", videoData.id);

      if (videoData.choices && videoData.choices.length > 0) {
        showChoiceButtons(videoData.choices);
      }
    });

    sceneEl.appendChild(videoEl);
    currentVideoEl = videoEl;
  } else {
    currentVideoEl = existingVideo;

    if (currentVideoEl.readyState >= 3) {
      debugLog("🎬 Re-using preloaded video:", videoId);
      setAndPlayVideo(currentVideoEl);
    } else {
      currentVideoEl.addEventListener('loadeddata', () => {
        debugLog("🎬 Re-using existing video, now ready:", videoId);
        setAndPlayVideo(currentVideoEl);
      });
    }
  }
}
