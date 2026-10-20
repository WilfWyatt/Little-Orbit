# Little Orbit 👽

A mobile-first virtual alien pet built with plain HTML, CSS and JavaScript. No build tools or external libraries required.

## Play locally
Open `index.html` in a browser. For full PWA/offline support, serve the folder over HTTPS or localhost (for example with GitHub Pages).

## Publish with GitHub Pages
1. Upload the contents of this folder to the root of your `Little-Orbit` repository (make sure `index.html` is at the repository root, not inside another `little-orbit` folder).
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select branch `main` and folder `/ (root)`, then save.
5. Wait for deployment and open the URL GitHub Pages displays.

## Features in this build (v0.3)
- Five care needs and six touch-friendly care actions.
- Personality traits affected by care choices.
- Baby, juvenile and three adult evolutionary forms.
- Real-time needs with capped, forgiving offline progression; hunger, energy, happiness and cleanliness now decline a little faster.
- Local save and JSON save export; import is available via the Export Save button's context menu.
- Tiny action reactions: bouncing, wiggling, snoozing and floating symbols.
- Persistent mobile care dock: the six care actions remain available at the bottom of the screen while browsing; tapping one brings the pet back into view so you can see the reaction.
- PWA manifest and versioned service-worker cache for offline play after first successful load.

## Notes
- Saves are stored in this browser on this device. Export a backup before clearing browser data or switching devices.
- Evolution currently occurs at 72 simulated hours. Personality traits determine which adult form is selected.
- This is the first playable foundation; sound, more animations, richer habitat interactions and balancing can be added in later versions.

## Updating an existing GitHub Pages install
Upload and overwrite the updated files while keeping the `assets` and `js` folders at the repository root. The service-worker cache has been bumped to v3 so the browser can pick up the new build. If the old version remains visible, close the installed app completely and reopen it; if needed, refresh the site once while online.
