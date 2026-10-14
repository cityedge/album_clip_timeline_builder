# Changelog

## v1.1.0 — 2026-10-14

- Packaged the integrated Timeline Builder and Edge Fixer as version 1.1.0.
- Updated Japanese documentation and added a complete English user guide.

### 2026-10-14: save dialog location

- Use native audio file pickers on supported browsers and retain each file handle through decoding, editing and list handoff.
- Start WAV saves in the current source file's directory. After saving elsewhere, subsequent saves of that track start in its new directory.
- Remember the last successful save location across editor visits for inputs without file handles; use a stable browser picker ID as an additional fallback.
- Preserve location handles from supported file drops. No input-directory selection or directory-wide access is required.

### Integrated editing and handoff

- Added optional head/tail editor, based on Suno WAV Edge Fixer v0.3.1, without modifying the standalone app.
- Added native WAV save dialogs, byte-preserving edits for supported WAV inputs, and browser-decoded 24bit WAV conversion for other audio inputs.
- Added list handoff, persistent edited badges during the current list session, natural insertion of new files, and arrangement invalidation only after saves or net list changes.
- Preserved existing SRT assignments on editor list changes and added assignment controls for empty SRT slots.
- Added unsaved-edit return choices and explicit save cancellation/failure handling.
- Expanded Timeline Builder input beyond MP3 to browser-decodable audio.
- Preserved frame-based timeline/export behavior and project schema 2. Standalone v1.0.2 ZIP remains the baseline.
- The local app now consists of index.html plus two companion JavaScript files. No external dependencies are required.

## v1.0.2

- Updated the public release version to v1.0.2.
- No functional changes from the corrected v1.0.1 build.
- Default settings remain: silence threshold `-49 dBFS`, standard audible gap `2.700` seconds.

## v1.0.1

- Updated the public release version to v1.0.1.
- Changed the default silence threshold from `-55 dBFS` to `-49 dBFS`.
- Changed the default standard audible gap from `3.000` seconds to `2.700` seconds.

## v1.0.0

### Added

- Initial public release.
- Local single-file HTML app structure.
- Dark UI theme.
- Japanese / English UI switching.
- Tooltip help in both Japanese and English.
- WAV / MP3 audio file selection.
- Standard WAV mode for same-format WAV files.
- Decode mode for MP3 input or mixed input formats.
- Automatic silence detection based on threshold and detection block size.
- Automatic timeline layout by audible gap.
- Track list with duration, sound start, sound end, source 00:00 position, and audible gap.
- Manual track ordering.
- Manual movement of selected track or selected-and-following tracks.
- Album overview waveform.
- Detailed gap waveform.
- Final-track tail view using the `END` segment.
- Boundary editing for sound start and sound end.
- Preview playback for the displayed waveform range.
- `album.wav` export.
- `album_subtitles.srt` export.
- `offset_image.txt` export.
- `timesheet.txt` export with provisional titles derived from audio file names.
- `tracklist.txt` export for YouTube descriptions and other publication text.
- `project.json` export.
- `project.json` import.
- Required-file list dialog when project is loaded before audio/SRT files.

### Notes

- Output audio is WAV only.
- MP3 input is decoded by the browser.
- The app does not apply fades, gain processing, crossfades, mastering, or mixing.
- Audible overlap is not exported.
- Project files do not embed audio or SRT file contents.
