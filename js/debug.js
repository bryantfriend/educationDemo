// Version 1.0.0 - May 30, 2025 - Debug module for logging

// Toggle this to turn all debugging on or off
export const DEBUG = true;

/**
 * Logs messages to the console only if DEBUG is true.
 * @param  {...any} args - Anything you want to log
 */
export function debugLog(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}
