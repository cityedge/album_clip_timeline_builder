# Album Clip Timeline Builder v1.1.0 User Guide

Arrange individual songs into an album-length WAV, with optional subtitle and timing exports. The integrated Edge Fixer lets you inspect and edit each song's beginning and ending before assembling the album.

Japanese guide: [USER_GUIDE.md](USER_GUIDE.md).

## Start the app

Extract the entire ZIP, then open `index.html` in desktop Chrome or Microsoft Edge. Keep `edge-fixer.js` and `edge-integration.js` in the same folder as the HTML. No installation, build step, server, or internet connection is required. Use the language selector to switch between Japanese and English.

Files are processed locally in the browser and are not uploaded. Saving individual files from Edge Fixer requires the browser's native save-dialog API. If that API is unavailable, ordinary Timeline Builder processing remains available, but the editor's save button is disabled.

## Quick start

1. Select the songs to include. Initial selection sorts them by filename. Selecting another set in Timeline Builder replaces the list; use Edge Fixer to add files to the existing list.
2. Optionally open **Check / edit head & tail**, edit individual songs, save them as WAV, and choose **Return with this list**.
3. Run **Load audio + auto layout**. The app detects audible regions and arranges songs using the standard audible gap.
4. Review the song order, detected boundaries, and transitions. Adjust them as necessary.
5. Export `album.wav`. Add SRT files if you also want combined subtitles.
6. Export timing files or save the project to resume later.

You can also open Edge Fixer with an empty list, add and edit songs there, then return to Timeline Builder. Edge Fixer is optional: MP3 and other supported audio can go directly through Timeline Builder without individual WAV conversion.

## Optional Edge Fixer

### Inspect and edit

Choose a song in the editor's list. Select a region in the head waveform, or click the tail waveform to select from that point to the end. Use the mouse wheel to zoom the time axis. Display gain changes waveform visibility only.

- **Check noise** amplifies quiet content for audition only. It uses a fixed boost setting with signal-dependent gain limits. It does not change saved audio. Start with a comfortable device listening level; the browser cannot control the physical output level of your headphones or speakers.
- Normal selection playback lets you hear the region without the noise-check boost.
- Silence and fade controls modify the selected region.
- Tail controls can remove audio from the selection start to the end, or append a specified duration of silence.
- **Undo** removes the most recent unsaved edit. Repeat to remove earlier edits; it does not undo a file already saved to disk.

Adding and removing songs changes the editor's list. Removal does not delete files from disk. Reordering is managed in Timeline Builder.

### Save each song

Choose **Save as WAV** and select the destination in the save dialog. Choosing an existing WAV allows an overwrite; choosing another name creates a separate file. An MP3 or other compressed source is converted to WAV, leaving the source file in place. Saved songs remain in the editor's list.

On supported browsers, selecting audio with the native file picker retains the location of each file. The save dialog requests that song's current folder as its starting location. After saving elsewhere, later saves of that song request the new location. Supported file drops can also retain location information. If a source has no location handle, the app uses the last successful save location, then the browser's remembered picker location. Browser or OS restrictions can override the requested starting location. No input-folder selection is needed.

If files were loaded by an older app version, reload the page and select them again to capture their locations. Cancelled or failed saves retain the unsaved edits and do not replace the source used by Timeline Builder.

| Input to Edge Fixer | Saved result |
|---|---|
| Supported WAV: PCM 8/16/24/32-bit or Float32/64, up to 8 channels | WAV with unchanged sample bytes outside edited regions; sample rate, bit depth, and channel count are preserved |
| Other audio the browser can decode | 24-bit PCM WAV at the browser-decoded sample rate |

RF64, compressed WAV, multiple data chunks, and WAV with differing stored/valid bit depths are rejected by the editor instead of silently converted. Browser decoding of other formats may change the sample rate. Conversion does not recover information lost during compression, and tags or cover art are not copied from non-WAV inputs. The app does not re-encode MP3.

### Return to Timeline Builder

**Return with this list** transfers saved WAV sources and list additions/removals back to Timeline Builder.

- Any successful save during this visit, or a net addition/removal, resets analysis, detected/manual boundaries, and arrangement. Settings and the relative order of existing songs are retained. Run **Load audio + auto layout** again when ready.
- Opening the editor and returning without saving or changing the final list preserves the timeline, including manual positions. Adding and then removing a new song also preserves it if there were no saves or other net changes.
- Newly added songs are processed in natural filename order. Each is inserted before the first existing song with a later filename, or appended if none exists. Existing songs are never reordered to make room.
- Songs saved with actual edits appear in green with an **Edited** badge. Adding an untouched song or converting it without edits does not add the badge. Badges last for the current list session; they are not stored in project JSON.
- Existing SRT assignments follow the same songs through editor list changes. Added songs receive empty SRT slots when subtitles are already in use. Select an empty row and assign its SRT before exporting combined subtitles. Removing a song removes its paired SRT from the list, not from disk.

If edits remain unsaved, the return dialog lets you open a song that needs saving, discard unsaved edits and return, or continue editing. The save choice opens the first unsaved song; save each required song, then return. Discarding does not undo earlier successful saves.

## Audio loading and output format

**Standard WAV mode** is used when all inputs are matching supported WAV files: PCM 16/24/32-bit or Float32. It copies audible sample regions without gain changes, fades, or resampling during album assembly.

**Decode mode** is used for browser-decodable inputs such as MP3, FLAC, M4A, AAC, and Ogg, or mixed formats. Actual support depends on the browser. Output uses the highest decoded sample rate and channel count in the list. Supported WAV inputs determine the maximum PCM bit depth; Float32 WAV input selects Float32 output. Browser-decoded inputs alone, such as an MP3-only list, use 16-bit PCM output. Resampling uses linear interpolation.

Edge Fixer's individual 24-bit conversion and Timeline Builder's direct decode mode are separate operations. Neither restores the quality of an original uncompressed recording. Browser decoding may also introduce different delay, padding, or sample-rate behavior, so use original WAVs when precise source timing matters.

## Detection and arrangement

Defaults are a **−49 dBFS** silence threshold, a **10 ms** detection block, and a **2.700-second** audible gap. Detection estimates where meaningful sound starts and ends; review quiet intros, long fades, and residual noise manually.

The gap is measured from the preceding song's audible end to the next song's audible start. It is not the gap between whole file boundaries. The app keeps a separate album position for each source file's original 00:00; this is also the reference for subtitle offsets.

In the song list and waveforms, you can change order, adjust sound start/end, move a song or following songs, and rearrange subsequent transitions with a chosen gap. The overview shows the album, while the detailed waveform shows the selected transition. Select **END** to inspect and adjust the last song's tail. Preview playback covers the displayed waveform range.

Changing the threshold or detection settings does not replace listening and boundary review. Running detection or automatic layout again can replace manual adjustments. Timeline assembly does not add automatic fades, loudness matching, crossfades, or mixing; use Edge Fixer for individual head/tail fades.

## Export files

| File | Purpose |
|---|---|
| `album.wav` | Assembled album audio |
| `album_subtitles.srt` | Subtitles shifted and combined using source 00:00 positions |
| `offset_image.txt` | Source offsets for video/image alignment workflows |
| `timesheet.txt` | Transition timing and provisional titles derived from filenames |
| `tracklist.txt` | MM:SS track list suitable for a video description |
| `album_project.json` | Project settings and arrangement for later restoration |

The interface refers to the project controls as `project.json`; the downloaded filename is `album_project.json`.

Album WAV export copies each song's audible interval and writes zeros elsewhere. The output retains at least the last source file's full ending position, with content after its sound end replaced by silence. Overlapping audible intervals prevent export because the app does not mix songs. Overlapping silent portions of source files are allowed.

Timing-sheet entries use the midpoint between the previous audible end and next audible start, with the first entry at zero. Track-list entries use these times, rounding subsecond values below 400 ms down and values from 400 ms up. Check provisional titles before publishing.

Album and text exports use browser downloads. Only individual WAV saving in Edge Fixer uses the native save dialog.

## Subtitles

Select SRT files and check their row correspondence with the songs. Each SRT is expected to use the original source file's 00:00 as its reference. Combined export shifts it by that source's album position, not by the detected sound start, and writes CRLF line endings.

For ordinary manual list reordering, check and adjust SRT order as well. The special Edge Fixer return operation preserves existing song/SRT associations automatically. Empty assignments must be filled before combined export.

## Save and resume a project

Export the project after adjusting the timeline. It records filenames, song order, sound boundaries, source positions, detection/gap settings, processing/output information, and subtitle correspondence. Version 1.1.0 continues to use project schema 2.

The JSON does not embed audio or SRT contents. It also does not retain unsaved Edge Fixer edits, edited badges, or native file-location handles. Keep your saved audio and subtitle files separately.

Load a project first to see the required-file list, then select those audio and subtitle files. Alternatively, load audio first and then the project. Matching filenames restore the project order; when filenames differ but the song count matches, the app asks whether to apply settings by the current order. The browser cannot automatically reopen local files from their recorded names.

## Limits and troubleshooting

- Keep all three application files together. A blank or unavailable editor after moving only the HTML usually means the companion JavaScript files are missing.
- If individual WAV saving is disabled, use desktop Chrome or Edge with native save-dialog support. The app does not fall back to downloading individual edited WAVs.
- If a save starts in an unexpected folder, reselect the sources through the app's file picker. Files without location handles can only use the last successful save or browser history.
- Large albums and decoded audio use substantial browser memory. Practical limits depend on the device. Standard RIFF/WAV cannot exceed its roughly 4 GB size limit.
- PCM output does not add dithering. The app is not a mastering tool or a multitrack mixer.
- Supported compressed formats and decoded sample rates depend on the browser. Native Windows save-dialog navigation and additional browser/platform combinations require testing on the target system.

## Hosting and license

For static hosting such as GitHub Pages, upload `index.html`, both companion JavaScript files, and the documentation/license together. Users' selected media still stays in their browser. Native file-picker features require a supported browser and security context.

Released under the MIT License. See [LICENSE](LICENSE).
