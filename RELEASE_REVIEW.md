# Release Review: Album Clip Timeline Builder v1.1.0

## Package verification — 2026-10-14

- Archive: `album_clip_timeline_builder_v1_1_0_mit.zip`, with a single enclosing folder of the same name. Includes `index.html`, `edge-fixer.js`, `edge-integration.js`, `README.md`, both user guides, `CHANGELOG.md`, this review, and `LICENSE` (nine files).
- Built from an explicit file list, excluding test audio, test scripts, build tools, old archives, and local dependencies. Extracted files matched the working release sources byte for byte. All nine files are valid UTF-8 without BOM; local documentation links resolve.
- Tested the extracted application through `file://` in Windows Chrome 155.0.8059.79. Browser title, visible badge, and exported project version are `1.1.0`; project schema remains 2. Japanese timeline and English editor opened correctly, and an unchanged editor visit preserved the loaded timeline. No page or console errors were reported.
- Re-ran core WAV preservation/insertion/syntax checks, `tests/save_locations.cjs`, and timeline export regression checks against the extracted package. All passed. These cover saved-location handles, cancellations/failures, standard WAV sample bytes, silence boundaries, final tail, gap/timing calculations, SRT offsets, project restoration, overlap rejection, direct MP3 decoding and mixed-format output.
- Native Windows dialog navigation is not automated; save-location tests use mocked handles and verify the options passed to the browser. This package check examined generated export bytes; the earlier real browser-download check is recorded below.

## Integrated Edge Fixer — 2026-10-10

### Save location follow-up — 2026-10-14

`tests/save_locations.cjs` exercises the real click handlers with mocked native file handles/pickers: per-track source directory, new location after save, editor close/reopen, additions inside Edge Fixer, File-only fallback to the previous successful save, cancelled open/save, failed close, handle retention in both standard and decoded modes, stable picker ID, and active user gesture. Passed in Chrome with no page errors. Native OS dialog navigation remains a manual check; this test verifies the `startIn` handles actually supplied to the browser. The standalone Edge Fixer was not changed.

Version 1.1.0 packages the approved integration and save-location update. The package contains the application files, Japanese/English guides, changelog, review notes and MIT license. The original v1.0.2 ZIP and handover remain unchanged. Git tag `album-clip-timeline-builder-v1.0.2-baseline` identifies the pre-integration commit. Suno WAV Edge Fixer standalone was not modified; its index.html still matches the previously packaged v0.3.1 copy.

### Verified

- Node syntax and core checks: WAV PCM8/16/24/32, Float32/64 untouched byte preservation, mute boundaries, trim/append length, new-track insertion, stable IDs and duplicate names.
- Playwright with Windows Chrome 154.0.8037.98, local `file://` launch, muted audio, 1440×900 and 760×900 viewports. Browser plugin/skill was unavailable, so regular Playwright was used.
- Empty editor launch, addition/removal, no-op return preserving track objects and manual positions, net-zero list changes, manual order preservation, SRT placeholders and assignment, preview, saved badges and repeated visits.
- Save picker cancellation and write/close failure simulated; edits retained and failed streams aborted. Successful picker/file-handle simulation wrote real WAV files under `tests/tmp`, followed by byte checks. Native OS save-dialog selection itself was not automated.
- MP3 decoded and saved as PCM24 WAV; FLAC returned unedited and loaded by Timeline Builder; unsupported save API disables saving without disabling normal Timeline Builder.
- Original export rules: frame-based audible gap, byte-exact supported WAV segments, zeros outside sound bounds, retained last-track tail, overlap refusal, timesheet midpoint, 399/400ms rounding, SRT source-zero offset and CRLF, END, project schema 2 roundtrip, direct MP3 PCM16, mixed WAV PCM24.
- Real album WAV browser download passed outside the execution sandbox. The sandbox cancels downloads, so that check required an approved unrestricted test run. All generated media stayed under this app's `tests/tmp`.
- Japanese/English UI, nonblank page, version identity, screenshots and interaction states checked; no app console errors.

Commands: `node "Album Clip Timeline Builder/tests/edge_core.cjs"`, plus local Playwright checks in `tests/tmp/edge_ui.cjs` and `tests/tmp/timeline_regression.cjs`. No input media was overwritten by tests.

### Remaining manual checks

- Actual Windows save dialog: choose a destination, overwrite a test WAV, cancel, and return to the timeline.
- Edge, Firefox/Safari, real long albums, low-memory devices and phones were not exercised. Decode formats and sample rates depend on the browser.

---

# Historical release review: v1.0.2

This document summarizes the review performed before packaging Album Clip Timeline Builder v1.0.2.

## Scope

v1.0.2 is the public release build based on the corrected v1.0.1 build. It is a version update with no functional changes from that build. It provides a local browser-based workflow for arranging multiple WAV / MP3 clips on an album timeline, detecting audible regions, exporting an album WAV, merging SRT files, and producing timing helper files, including a publication-ready track list text file.

## Reviewed areas

### Application naming and versioning

- Updated browser title to `Album Clip Timeline Builder v1.0.2`.
- Updated visible application title to `Album Clip Timeline Builder` with version badge `v1.0.2`.
- Updated project export version to `1.0.2`.
- Confirmed default silence threshold remains `-49 dBFS`.
- Confirmed default standard audible gap remains `2.700` seconds.
- Confirmed no functional changes were introduced for v1.0.2.
- Removed release-facing development-stage wording.
- Updated the application subtitle to reflect WAV / MP3 input and the current output files.

### Input and processing modes

- Confirmed WAV / MP3 input selection.
- Confirmed standard WAV mode is used only when all input files are same-format WAV.
- Confirmed decode mode is used when MP3 is included or input formats are mixed.
- Confirmed decode mode chooses output format from decoded sample-rate/channel information and WAV input bit-depth information.

### Timeline behavior

- Confirmed audible start/end based layout remains the central workflow.
- Confirmed standard gap is applied between previous audible end and next audible start.
- Confirmed manual boundary editing is available from the detailed waveform panel.
- Confirmed final-track tail editing is available through the `END` segment.

### Export behavior

- Confirmed `album.wav` export.
- Confirmed `album_subtitles.srt` export.
- Confirmed `offset_image.txt` export.
- Confirmed `timesheet.txt` export with provisional title column.
- Confirmed `tracklist.txt` export using timesheet-derived MM:SS timings.
- Confirmed `project.json` export and import.
- Confirmed project required-file dialog for project-first workflow.

### Documentation

- Added `README.md`.
- Added detailed `USER_GUIDE.md`.
- Added `CHANGELOG.md`.
- Added this release review.
- Included MIT `LICENSE`.

## Technical checks

- Extracted embedded JavaScript from `index.html` and ran `node --check` successfully.
- Checked release-facing HTML for removed development-stage wording.
- Confirmed release package contains:
  - `index.html`
  - `README.md`
  - `USER_GUIDE.md`
  - `CHANGELOG.md`
  - `RELEASE_REVIEW.md`
  - `LICENSE`

## Known limitations

- Output audio is WAV only.
- MP3 decoding depends on the browser.
- Decode mode uses the browser-decoded sample rate as its source information.
- Decode mode resampling uses a simple linear interpolation approach.
- The app does not apply fades, gain processing, crossfades, or mastering.
- The app does not mix overlapping audible regions.
- 16-bit / 24-bit / 32-bit PCM output does not use dithering.
- Standard RIFF/WAV output cannot exceed 4GB.
- `project.json` does not embed audio or SRT file contents.
- Browsers do not allow this local HTML app to automatically reopen project-referenced local files.

## Release assessment

The package is suitable for the v1.0.2 public release and GitHub Pages publication under the MIT License.
