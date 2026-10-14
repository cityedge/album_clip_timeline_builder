# Album Clip Timeline Builder v1.1.0

## v1.1.0 / Integrated Edge Fixer

ZIP全体を展開し、`index.html` をChromeまたはEdgeで開くとTimeline Builderが起動します。「先頭・末尾の確認・編集」から任意のEdge Fixerを開けます。曲が空でも開いて、そこで音源を追加できます。

- Edge Fixerは先頭・末尾の波形、ノイズ確認、無音化、フェード、末尾削除、無音追加を備えています。
- 保存ダイアログは元音源のフォルダを開始位置に指定します。別名保存後は新しい保存先を使い、場所情報のない入力では直前の保存先を使います。
- 「WAVで保存」は保存ダイアログを使用します。保存してもリストから消えません。削除ボタンはリストだけを変更します。
- 対応WAVの未編集部分は音声バイトと形式を保持します。他形式はブラウザでデコードして24bit PCM WAVで保存します。MP3の再圧縮は行いません。
- 「リストを引き継いで戻る」で、保存したWAVとリストの追加・削除を反映します。修正保存した曲は緑色と「修正済み」で表示します。
- 今回の保存または戻る時点のリスト差分がある場合は自動配置前へ戻ります。自動配置は再実行しません。変更がなければ手動配置も保持します。
- 既存曲の順序を維持し、追加曲だけを自然順で挿入します。既存曲とSRTの対応を保持し、追加曲のSRTは未割当枠にします。
- Edge Fixerは任意です。従来どおりMP3等を直接Timeline Builderで読み込んで結合できます。

Open `index.html`, then optionally choose **Check / edit head & tail**. The editor can also start with an empty list. Save individual WAV files with native save dialogs, then choose **Return with this list**. Saved edits are marked in green. Saving or changing the list resets arrangement; a visit without changes preserves it. New tracks are inserted without reordering existing tracks, and SRT assignments remain with existing tracks. Unsaved edits require a choice before returning.

Extract the entire ZIP first. Keep `index.html`, `edge-fixer.js`, and `edge-integration.js` together. No server, build step, external codec library, or network connection is needed. This integration does not change the standalone Suno WAV Edge Fixer.

Album Clip Timeline Builder は、複数の音声クリップをアルバム形式のタイムラインへ並べ、実音開始・実音終了を基準に曲間を整えたうえで、アルバムWAV、結合SRT、タイムシート、YouTube説明欄向け曲リスト、オフセット表を出力するローカルHTMLアプリです。

This is a local browser-based timeline builder for arranging audio clips into an album-style audio file. It detects audible start/end points, lays out tracks with controlled audible gaps, and exports album audio plus subtitle and timing helper files.

## Main features

- Local HTML app (with two companion JavaScript files)
- WAV and browser-decodable audio input, including MP3
- Optional integrated Edge Fixer with individual WAV saving
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
- Project save / load: `album_project.json` (shown as `project.json` in the UI)
- Required-file list dialog when loading a project before media files
- Japanese / English UI switch
- Tooltip help in both Japanese and English
- Dark UI theme

## Recommended environment

Recommended:

- Windows 11
- Google Chrome or Microsoft Edge

The app uses File API, Web Audio API, Canvas, Blob download, and local file selection. Compressed audio support depends on the browser. Edge Fixer saving requires `showSaveFilePicker` (desktop Chrome / Edge); without it, the normal Timeline Builder remains available. Native dialog interaction requires a user click.

## Files in this repository

- `index.html` — application body
- `edge-fixer.js` — integrated audio editor, derived from Suno WAV Edge Fixer v0.3.1
- `edge-integration.js` — list reconciliation and editor lifecycle
- `README.md` — project overview
- `USER_GUIDE.md` — Japanese user guide
- `USER_GUIDE_EN.md` — English user guide
- `CHANGELOG.md` — version history
- `RELEASE_REVIEW.md` — release review notes
- `LICENSE` — MIT License

## Basic workflow

1. Open `index.html` in a browser.
2. Select audio files, or open the Edge Fixer first and add files there.
3. Optionally edit/save individual WAVs and return, then run `Load audio + auto layout`.
4. Review the track order, audible start/end points, and gaps.
5. Adjust boundaries or timing if needed.
6. Export `album.wav`.
7. Optionally export `album_subtitles.srt`, `timesheet.txt`, `tracklist.txt`, `project.json`, and `offset_image.txt`.

## Privacy

The selected audio and subtitle files are processed locally in the browser. This app does not upload audio files, subtitle files, or project files to a server.

## License

MIT License. See `LICENSE`.


## Default settings

- Silence threshold: `-49 dBFS`
- Default audible gap: `2.700` seconds
