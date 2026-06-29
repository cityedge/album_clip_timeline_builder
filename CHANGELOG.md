# Changelog

## v1.0.1

- Updated the public release version to v1.0.1.
- Changed the default silence threshold from -55 dBFS to -49 dBFS.
- Changed the default standard audible gap from 3.000 seconds to 2.700 seconds.

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
