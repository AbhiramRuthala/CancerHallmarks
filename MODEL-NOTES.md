# OncoLab — A living experiment

Educational conceptual model, not a clinical prediction. No patient data, calibrated clinical time, dose or cell-count equivalence.

## Run
Open the included `OncoLab.html` in a modern browser; it contains everything and works offline. In the source folder, `dist/index.html` also runs directly when its three companion files are present. Optional server: `python3 -m http.server 8765 --directory dist`, then visit http://localhost:8765.

## Controls
- Run/stop, single-step, reset and speed are in the bottom dock.
- **Hallmarks** opens eight live switches without pausing or resetting the experiment. They synchronize with the detailed controls below. Escape, the close button or an outside click closes the picker. Scrolling into settings dismisses it.
- Scroll down for detailed hallmark effects, four treatment intensities, variation amplifier and population history.
- Presets replace controls. Reset restarts the current configuration.
- The right-hand field guide contains biology, stage context, lecture experiments and model assumptions.
- Playback zooms the tissue and hides introductory text; reduced-motion settings disable these transitions.
- Export CSV records whole model-time samples and the active configuration.

## Lecture experiments
1. Growth bottleneck: run to roughly t=50, then enable angiogenesis using the dock.
2. Invasion and immune escape: compare local dispersal with and without immune pressure.
3. Selection and resistance: use the matching preset and compare resistant percentage with absolute resistant population.

## Model and limits
Sixteen deterministic compartments represent combinations of resistance to the four therapies. Initial population is 120 model units (114 sensitive, 1.5 resistant to each individual therapy). Resistance lowers its matching therapy kill rate to 12%, with a small turnover cost. Mutation during division creates variation; treatment selects variants. Resource-limited division, vessel supply, immune killing, death and local dispersal respond to the hallmark switches. A single generic environment is used throughout; there are no organ presets. Its parameters retain the former reference environment, keeping hallmark and treatment comparisons consistent.

Eight paired simulations each leave one hallmark permanently disabled while keeping all other intervention timings identical. Readouts compare actual and counterfactual populations. Effects overlap, are history-dependent, and must not be added together. Percentages become absolute differences when comparison population falls below one unit. Invasion, vessel supply and resistant population have additional metrics.

Stage context never assigns stage. Nodes, distant metastases, clinical size/depth, histology are absent. Large populations, many hallmarks or resistance do not imply stage IV.

Cell positions, vessels and immune dots visualize the model; spatial collisions do not drive it. Local invasion is not metastasis. Fractional populations persist, so this model cannot declare cure. Clinical regimens, toxicity and pharmacokinetics are omitted. Biological references are linked in the guide; numerical coefficients are illustrative.

## Code and verification
- `dist/model.js`: simulation and comparison engine
- `dist/app.js`: interactions, animation and CSV
- `dist/style.css`: responsive interface
- `dist/index.html`: interface and educational content

Run `node test.cjs` and `node test-insights.cjs` for 25 model and comparison checks. Browser checks verified playback, the dock picker, simultaneous changes while time advances, synchronization with detailed controls, and Escape dismissal. A narrow browser layout was visually inspected and the picker compacted to preserve the central tissue view.
