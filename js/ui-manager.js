// Version 1.0.0 - May 30, 2025 - A-Frame VR button system

import { debugLog } from './debug.js';
import { loadVideo } from './video-manager.js';

debugLog("🧩 UI Manager loaded");

let activeEntities = [];

/**
 * Clears all current choice entities from the scene.
 */
export function clearButtons() {
  activeEntities.forEach(el => el.remove());
  activeEntities = [];
}

/**
 * Creates in-VR 3D buttons using A-Frame entities.
 * @param {Array} choices - Array of {label, color, nextId}
 * @param {Array} jsonData - The full lesson data for branching
 */
export function showChoiceButtons(choices, jsonData) {
  debugLog("🛠 Creating VR choice buttons:", choices);
  clearButtons();

  const scene = document.querySelector('a-scene');
  const buttonDistance = -3;
  const spacing = 1.2;
  const startY = (choices.length - 1) * spacing * 0.5;

  choices.forEach((choice, index) => {
    const group = document.createElement('a-entity');
    const button = document.createElement('a-plane');
    const text = document.createElement('a-text');

    // Button appearance
    button.setAttribute('width', '2.5');
    button.setAttribute('height', '0.7');
    button.setAttribute('color', choice.color || '#1e90ff');
    button.setAttribute('class', 'clickable');
    button.setAttribute('position', '0 0 0');
    button.setAttribute('geometry', 'primitive: plane;');
    button.setAttribute('material', `color: ${choice.color || '#1e90ff'}`);

    // Button text
    text.setAttribute('value', choice.label);
    text.setAttribute('align', 'center');
    text.setAttribute('color', '#FFFFFF');
    text.setAttribute('width', '2.2');
    text.setAttribute('position', '0 0 0.01');

    // Group placement in front of camera
    const yOffset = startY - index * spacing;
    group.setAttribute('position', `0 ${yOffset} ${buttonDistance}`);
    group.setAttribute('look-at', '[camera]');

    // Click interaction
    button.addEventListener('click', () => {
      debugLog("✅ VR Button clicked:", choice.label);
      clearButtons();
      const nextVideo = jsonData.find(v => v.id === choice.nextId);
      if (nextVideo) {
        loadVideo(nextVideo, jsonData);
      } else {
        debugLog("❌ No video found with ID:", choice.nextId);
      }
    });

    group.appendChild(button);
    group.appendChild(text);
    scene.appendChild(group);

    activeEntities.push(group);
  });
}
