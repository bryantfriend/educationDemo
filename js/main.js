// Version 1.0.0 - May 30, 2025 - Main app controller

import { debugLog } from './debug.js';
import { loadVideo } from './video-manager.js';

debugLog("🔄 Main.js loaded");

// Handle intentional user click on the overlay
const overlay = document.getElementById('start-overlay');

overlay.addEventListener('click', () => {
  debugLog("🖱 Overlay clicked. Starting app...");
  document.body.classList.add('clicked');

  // Delay to satisfy autoplay policy
  setTimeout(() => {
    fetch('./data/lesson-data.json')
      .then(response => response.json())
      .then(json => {
        debugLog("📦 Loaded lesson data:", json);
        const intro = json.find(v => v.id === 'intro_video');
        if (intro) {
          loadVideo(intro, json);
        } else {
          debugLog("⚠️ No intro video found in JSON");
        }
      })
      .catch(err => {
        debugLog("❌ Error loading lesson data:", err);
      });
  }, 200); // Slight delay for browser to register click
}, { once: true });
