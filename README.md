# Album Clip Timeline Builder v1.0.1

Album Clip Timeline Builder は、複数の音声クリップ（WAV / MP3）をアルバム形式のタイムラインへ並べ、実音開始・実音終了を基準に曲間を整えたうえで、アルバムWAV、結合SRT、タイムシート、YouTube説明欄向け曲リスト、オフセット表を出力するローカルHTMLアプリです。

This is a local browser-based timeline builder for arranging multiple WAV / MP3 clips into an album-style audio file. It detects audible start/end points, lays out tracks with controlled audible gaps, and exports album audio plus subtitle and timing helper files.

## Main features

- Local single-file HTML app
- WAV / MP3 input
- WAV output: `album.wav`
- Standard WAV mode for same-format WAV files
- Decode mode for MP3 input or mixed input formats
- Silence / audible-region detection
- Timeline layout by audible gap
- Manual boundary editing for sound start and sound end
- Album overview waveform and detailed gap waveform
- Preview playback for the displayed waveform range
- SRT merge: export `album_subtitles.srt`
- Offset export: `offset_image.txt`
- Timesheet export: `timesheet.txt`
- YouTube-style tracklist export: `tracklist.txt`
- Project save / load: `project.json`
- Required-file list dialog when loading a project before media files
- Japanese / English UI switch
- Tooltip help in both Japanese and English
- Dark UI theme

## Recommended environment

Recommended:

- Windows 11
- Google Chrome or Microsoft Edge

The app uses browser APIs such as File API, Web Audio API, Canvas, Blob download, and local file selection. MP3 decoding depends on the browser's audio decoding implementation.

## Files in this repository

- `index.html` — application body
- `README.md` — project overview
- `USER_GUIDE.md` — detailed user guide
- `CHANGELOG.md` — version history
- `RELEASE_REVIEW.md` — release review notes
- `LICENSE` — MIT License

## Basic workflow

1. Open `index.html` in a browser.
2. Select WAV / MP3 files.
3. Run `Load audio + auto layout`.
4. Review the track order, audible start/end points, and gaps.
5. Adjust boundaries or timing if needed.
6. Export `album.wav`.
7. Optionally export `album_subtitles.srt`, `timesheet.txt`, `tracklist.txt`, `project.json`, and `offset_image.txt`.

## Privacy

The selected audio and subtitle files are processed locally in the browser. This app does not upload audio files, subtitle files, or project files to a server.

## License

MIT License. See `LICENSE`.


## Default settings in v1.0.1

- Silence threshold: `-49 dBFS`
- Default audible gap: `2.700` seconds
