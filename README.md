# OncoLab

Interactive cancer hallmarks simulator for education. Conceptual model, not a clinical prediction.

## Publish with GitHub Pages
1. Unzip this archive.
2. Upload the files inside `OncoLab-GitHub-Pages` to the root of your GitHub repository. `index.html` must be at the repository root, not inside another folder.
3. In the repository, open Settings → Pages.
4. Under Build and deployment, select Deploy from a branch.
5. Select `main` and `/ (root)`, then Save.
6. Open the site URL displayed by GitHub once deployment completes.

No build command, dependencies, API keys, or backend are required. All asset paths are relative, so project Pages URLs work.

## Run locally
Open `index.html` in a modern browser, or run:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Files
- `index.html`: main screen, hallmark controls, treatment controls and educational content
- `style.css`: responsive layout and theme
- `app.js`: animation, interactions, live comparisons and CSV export
- `model.js`: deterministic educational simulation
- `test.cjs`: core model checks
- `test-insights.cjs`: comparison and stage-context checks
- `MODEL-NOTES.md`: assumptions and model documentation
- `.nojekyll`: serve as a plain static site

## Tests
With Node.js installed:

```sh
node test.cjs
node test-insights.cjs
```

25 model and comparison checks. No npm install required.

## Current interface
Hallmark switches and live effects sit on the left of the central simulation. Playback controls are at the bottom. Scroll below for treatments and population history. The tissue selector and right-hand information bar have been removed.

The model is illustrative, not calibrated to patients. Time, population units and treatment intensity have no clinical equivalence.
