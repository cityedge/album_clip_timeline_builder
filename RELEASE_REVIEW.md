# Release Review: Album Clip Timeline Builder v1.0.0

This document summarizes the review performed before packaging Album Clip Timeline Builder v1.0.0.

## Scope

v1.0.0 is the initial public release. It provides a local browser-based workflow for arranging multiple WAV / MP3 clips on an album timeline, detecting audible regions, exporting an album WAV, merging SRT files, and producing timing helper files.

## Reviewed areas

### Application naming and versioning

- Updated browser title to `Album Clip Timeline Builder v1.0.0`.
- Updated visible application title to `Album Clip Timeline Builder` with version badge `v1.0.0`.
- Updated project export version to `1.0.0`.
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

The package is suitable for the v1.0.0 public release and GitHub Pages publication under the MIT License.
