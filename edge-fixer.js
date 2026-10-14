/* Integrated Edge Fixer, derived from Suno WAV Edge Fixer 0.3.1 (MIT).
 * The standalone app is intentionally independent. Loaded only by Timeline Builder.
 * A same-origin srcdoc frame keeps styles isolated and permits native save dialogs.
 */
window.EdgeFixer = {
  html: `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Edge Fixer · Album Clip Timeline Builder</title>
<style>
  :root {
    color-scheme: dark;
    --bg: #0d1014;
    --panel: #151a21;
    --panel2: #10151b;
    --border: #2a333f;
    --text: #edf2f7;
    --muted: #9aa8b7;
    --accent: #7dd3fc;
    --accent2: #38bdf8;
    --danger: #fda4af;
    --ok: #86efac;
    --selection: rgba(125, 211, 252, 0.18);
    --selection-border: rgba(125, 211, 252, 0.85);
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Yu Gothic UI", "Meiryo", sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow: hidden;
  }
  button, input { font: inherit; }
  button {
    color: var(--text);
    background: #202833;
    border: 1px solid #364252;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
  }
  button:hover:not(:disabled) { background: #283341; }
  button:disabled { opacity: .42; cursor: default; }
  button.primary { background: #0f5f80; border-color: #1787b3; }
  button.primary:hover:not(:disabled) { background: #126d91; }
  button.playing, button.playing:hover:not(:disabled) {
    color: #0b1820;
    background: #86efac;
    border-color: #bbf7d0;
    font-weight: 700;
  }
  button.danger { color: #ffe4e6; }
  button.small { padding: 5px 9px; font-size: 12px; }
  .append-control { display: inline-flex; align-items: center; gap: 7px; color: var(--muted); font-size: 12px; }
  .append-control input {
    width: 72px;
    padding: 6px;
    color: var(--text);
    background: var(--panel2);
    border: 1px solid #3b4857;
    border-radius: 6px;
    font-variant-numeric: tabular-nums;
  }

  #app {
    height: 100%;
    display: grid;
    grid-template-columns: 265px minmax(0, 1fr);
  }
  .sidebar {
    min-width: 0;
    border-right: 1px solid var(--border);
    background: #0f1318;
    display: flex;
    flex-direction: column;
  }
  .sidebar-head {
    padding: 14px;
    border-bottom: 1px solid var(--border);
  }
  .brand {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: .02em;
    margin-bottom: 10px;
  }
  .version {
    margin-left: 6px;
    color: var(--muted);
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0;
    white-space: nowrap;
  }
  .add-row { display: flex; gap: 8px; }
  .add-row button { flex: 1; }
  .remove-row { margin-top: 8px; }
  .remove-row button { width: 100%; }
  .track-list {
    flex: 1;
    overflow: auto;
    padding: 8px;
  }
  .track-item {
    width: 100%;
    text-align: left;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 8px;
    padding: 9px 10px;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .track-item:hover { background: #171d24; }
  .track-item.active {
    background: #17242d;
    border-color: #2b6d88;
  }
  .empty-list {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.6;
    padding: 14px 8px;
  }
  .sidebar-foot {
    padding: 10px 12px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-size: 12px;
  }

  .main {
    min-width: 0;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .topbar {
    min-height: 55px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    background: #10151b;
  }
  .filename {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 650;
  }
  .meta {
    color: var(--muted);
    font-size: 12px;
    white-space: nowrap;
  }
  .workspace {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: 12px;
    display: grid;
    grid-template-rows: minmax(300px, 1fr) minmax(300px, 1fr);
    gap: 12px;
  }
  .panel {
    min-height: 0;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: var(--panel);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .panel-head {
    padding: 9px 11px;
    border-bottom: 1px solid var(--border);
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }
  .panel-title {
    font-weight: 700;
    margin-right: 4px;
  }
  .spacer { flex: 1; }
  .gain-wrap {
    display: flex;
    gap: 7px;
    align-items: center;
    color: var(--muted);
    font-size: 12px;
  }
  .gain-wrap input { width: 150px; }
  .gain-value {
    width: 48px;
    text-align: right;
    color: var(--text);
    font-variant-numeric: tabular-nums;
  }
  .wave-wrap {
    position: relative;
    flex: 1;
    min-height: 180px;
    background: var(--panel2);
  }
  canvas.wave {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    cursor: crosshair;
    touch-action: none;
  }
  .panel-foot {
    min-height: 44px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    flex-wrap: wrap;
  }
  .selection-info {
    margin-left: auto;
    color: var(--muted);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .hint {
    color: var(--muted);
    font-size: 11px;
  }
  .overlay-drop {
    position: fixed;
    inset: 12px;
    z-index: 50;
    display: none;
    align-items: center;
    justify-content: center;
    border: 2px dashed #4d8aa3;
    border-radius: 14px;
    background: rgba(6, 11, 15, .88);
    color: #d9f2ff;
    font-size: 20px;
    font-weight: 700;
    pointer-events: none;
  }
  .overlay-drop.show { display: flex; }
  .status {
    position: fixed;
    left: 50%;
    bottom: 18px;
    transform: translateX(-50%);
    background: #111922;
    border: 1px solid #38485a;
    border-radius: 9px;
    padding: 9px 12px;
    font-size: 13px;
    box-shadow: 0 8px 30px rgba(0,0,0,.35);
    display: none;
    z-index: 100;
    max-width: min(760px, calc(100vw - 40px));
  }
  .status.show { display: block; }
  .status.error { border-color: #8b3d47; color: #ffd5da; }

  @media (max-width: 850px) {
    #app { grid-template-columns: 210px minmax(0, 1fr); }
    .gain-wrap input { width: 110px; }
  }
  @media (max-width: 600px) {
    #app { grid-template-columns: minmax(0, 1fr); grid-template-rows: 180px minmax(0, 1fr); }
    .sidebar { min-height: 0; border-right: 0; border-bottom: 1px solid var(--border); }
    .sidebar-head { padding: 6px 10px; }
    .brand { font-size: 14px; margin-bottom: 4px; }
    .add-row, .remove-row { display: inline-block; margin: 0; }
    .sidebar-head button { padding: 5px 7px; font-size: 12px; }
    .track-list { min-height: 0; padding: 2px 8px; }
    .sidebar-foot { padding: 4px 10px; }
    .main { min-height: 0; }
    .topbar { flex-wrap: wrap; }
    .filename { flex-basis: 100%; }
    .meta { white-space: normal; flex-basis: 100%; }
    .workspace { padding: 6px; grid-template-rows: minmax(410px, 1fr) minmax(460px, 1fr); }
  }
.save-support { color: #fcd34d; padding: 4px 12px; font-size: 12px; }
 .save-support:empty { display:none; }
 #returnBtn { width:100%; margin:10px 0; white-space:normal; }
 .track-item.edited { border-left: 4px solid #86efac; color:#bbf7d0; }
 dialog { color:var(--text); background:var(--panel); border:1px solid var(--border); border-radius:12px; max-width: min(560px,90vw); }
 dialog::backdrop { background:#000b; } .dialog-actions { display:flex; flex-wrap:wrap; gap:8px; }
 #unsavedNames { white-space:pre-line; max-height:30vh; overflow:auto; }
 .topbar { flex-wrap:wrap; } .meta { white-space:normal; }
 .brand { flex-wrap:wrap; } .brand .version { white-space:normal; }
 @media(max-width:760px) { #app { grid-template-columns:180px minmax(0,1fr); } .panel-head {flex-wrap:wrap;} .hint {display:none;} }
 </style>
</head>
<body>
<div id="app">
  <aside class="sidebar">
    <div class="sidebar-head">
      <div class="brand">Edge Fixer<span class="version">Album Clip Timeline Builder</span></div>
      <button id="returnBtn" class="primary" data-i18n="returnToTimeline">リストを引き継いで戻る</button><div class="add-row">
        <button id="addFilesBtn" data-i18n="addFiles">WAVを追加</button>
        <input id="fileInput" type="file" accept="audio/*,.wav,.mp3,.m4a,.aac,.ogg,.opus,.flac,.aif,.aiff" multiple hidden />
      </div>
      <div class="remove-row">
        <button id="removeWavBtn" class="danger" data-i18n="removeWav" data-i18n-title="removeWavHint" disabled>WAVをリストから削除</button>
      </div>
    </div>
    <div id="trackList" class="track-list"></div>
    <div class="sidebar-foot">
      <span id="trackCount">0 files</span>
      <button id="langBtn" class="small">EN</button>
    </div>
  </aside>

  <main class="main">
    <div class="topbar">
      <div id="filename" class="filename" data-i18n="noFile">WAVを追加してください</div>
      <div id="meta" class="meta"></div>
      <button id="undoBtn" data-i18n="undo" disabled>元に戻す</button>
      <button id="saveBtn" class="primary" data-i18n="saveRemove" disabled>保存してリストから削除</button>
    </div>

    <div id="saveSupport" class="save-support" role="status"></div><div class="workspace">
      <section class="panel">
        <div class="panel-head">
          <div class="panel-title" data-i18n="head">先頭</div>
          <div class="hint" data-i18n="wheelHint">ホイールで時間軸を拡大・縮小</div>
          <div class="spacer"></div>
          <label class="gain-wrap">
            <span data-i18n="displayGain">表示ゲイン</span>
            <input id="headGain" type="range" min="0" max="60" step="1" value="40" />
            <span id="headGainValue" class="gain-value">+40 dB</span>
          </label>
        </div>
        <div class="wave-wrap"><canvas id="headCanvas" class="wave"></canvas></div>
        <div class="panel-foot">
          <button id="headNoiseBtn" data-i18n="noisePreview" data-i18n-title="noisePreviewHint" aria-pressed="false" disabled>ノイズ確認</button>
          <button id="headPlayBtn" data-i18n="playSelection" disabled>選択範囲を再生</button>
          <button id="headMuteBtn" class="danger" data-i18n="silenceSelection" disabled>選択範囲を無音</button>
          <button id="headFadeBtn" data-i18n="fadeInSelection" disabled>選択範囲をフェードイン</button>
          <div id="headSelectionInfo" class="selection-info"></div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-head">
          <div class="panel-title" data-i18n="tail">末尾</div>
          <div class="hint" data-i18n="tailWaveHint">クリックで末尾まで選択／ホイールで拡大・縮小</div>
          <div class="spacer"></div>
          <label class="gain-wrap">
            <span data-i18n="displayGain">表示ゲイン</span>
            <input id="tailGain" type="range" min="0" max="60" step="1" value="20" />
            <span id="tailGainValue" class="gain-value">+20 dB</span>
          </label>
        </div>
        <div class="wave-wrap"><canvas id="tailCanvas" class="wave"></canvas></div>
        <div class="panel-foot">
          <button id="tailNoiseBtn" data-i18n="noisePreview" data-i18n-title="noisePreviewHint" aria-pressed="false" disabled>ノイズ確認</button>
          <button id="tailPlayBtn" data-i18n="playSelection" disabled>選択範囲を再生</button>
          <button id="tailMuteBtn" class="danger" data-i18n="silenceSelection" disabled>選択範囲を無音</button>
          <button id="tailFadeBtn" data-i18n="fadeOutSelection" disabled>選択範囲をフェードアウト</button>
          <button id="tailTrimBtn" class="danger" data-i18n="trimAfterSelection" data-i18n-title="trimHint" disabled>選択開始位置から末尾を削除</button>
          <label class="append-control">
            <span data-i18n="silenceToAdd">追加する無音</span>
            <input id="appendSilenceMs" type="number" min="0" max="30000" step="10" value="200" />
            <span>ms</span>
          </label>
          <button id="tailAppendBtn" data-i18n="appendSilence" disabled>末尾に無音を追加</button>
          <div id="tailSelectionInfo" class="selection-info"></div>
        </div>
      </section>
    </div>
  </main>
</div>
<div id="dropOverlay" class="overlay-drop" data-i18n="dropHere">WAVファイルをドロップ</div>
<dialog id="returnDialog"><p data-i18n="unsavedPrompt"></p><p id="unsavedNames"></p><p data-i18n="saveReturnHint"></p><div class="dialog-actions"><button id="saveReturnBtn" class="primary" data-i18n="saveReturn"></button><button id="discardReturnBtn" data-i18n="discardReturn"></button><button id="cancelReturnBtn" data-i18n="continueEditing"></button></div></dialog>
<div id="status" class="status"></div>

</body></html>`,
  init: function(bridge) {
  'use strict';

  const $ = (id) => document.getElementById(id);

  const I18N = {
    ja: {
      noisePreview: 'ノイズ確認', noisePlaying: '■ ノイズ確認中（停止）',
      noisePreviewHint: '選択範囲の小さな音を試聴用に増幅して再生します。保存するWAVには反映しません。',
      previewSilent: '選択範囲は無音です', previewInvalid: '音声に不正な数値があるため試聴できません。',
      addFiles: 'WAVを追加', removeWav: 'WAVをリストから削除',
      removeWavHint: '選択中のWAVを保存・ダウンロードせずにリストから削除します。',
      removed: 'リストから削除しました',
      noFile: 'WAVを追加してください', undo: '元に戻す',
      saveRemove: '保存してリストから削除', head: '先頭', tail: '末尾',
      wheelHint: 'ホイールで時間軸を拡大・縮小',
      tailWaveHint: 'クリックで末尾まで選択／ホイールで拡大・縮小', displayGain: '表示ゲイン',
      playSelection: '選択範囲を再生', playingSelection: '■ 再生中（停止）',
      silenceSelection: '選択範囲を無音',
      fadeInSelection: '選択範囲をフェードイン',
      fadeOutSelection: '選択範囲をフェードアウト',
      trimAfterSelection: '選択開始位置から末尾を削除',
      trimHint: '末尾波形をクリック、またはドラッグして位置を指定すると、その位置以降を削除します。',
      silenceToAdd: '追加する無音', appendSilence: '末尾に無音を追加',
      badAppendValue: '追加時間は1～30000 msで指定してください。',
      badTrimValue: '削除位置は曲の先頭より後を指定してください。',
      dropHere: 'WAVファイルをドロップ',
      empty: 'ここにWAVファイルを複数ドロップできます。\n保存した曲は自動的にリストから消えます。',
      files: '曲', loading: '読み込み中…', unsupported: '未対応のWAV形式です。',
      badWav: 'WAVファイルを解析できませんでした。', saved: '保存しました',
      noSelection: '先に波形上で範囲を選択してください。',
      nothingUndo: '元に戻せる編集がありません。',
      added: 'WAVを追加しました', onlyWav: 'WAVファイルだけを追加できます。',
      select: '選択', dur: '長さ'
    },
    en: {
      noisePreview: 'Check noise', noisePlaying: '■ Checking noise (stop)',
      noisePreviewHint: 'Amplify quiet sounds in the selection for playback only. The exported WAV is unchanged.',
      previewSilent: 'The selection is silent', previewInvalid: 'Cannot preview audio containing invalid sample values.',
      addFiles: 'Add WAVs', removeWav: 'Remove WAV from list',
      removeWavHint: 'Remove the selected WAV from the list without saving or downloading it.',
      removed: 'Removed from list',
      noFile: 'Add WAV files', undo: 'Undo',
      saveRemove: 'Save & remove from list', head: 'Head', tail: 'Tail',
      wheelHint: 'Mouse wheel: horizontal zoom',
      tailWaveHint: 'Click: select to end / Wheel: zoom', displayGain: 'Display gain',
      playSelection: 'Play selection', playingSelection: '■ Playing (stop)',
      silenceSelection: 'Silence selection',
      fadeInSelection: 'Fade in selection',
      fadeOutSelection: 'Fade out selection',
      trimAfterSelection: 'Trim from selection start',
      trimHint: 'Click or drag in the tail waveform to choose the point to trim from.',
      silenceToAdd: 'Silence to add', appendSilence: 'Append silence',
      badAppendValue: 'Enter 1–30000 ms of silence.',
      badTrimValue: 'Choose a trim position after the start of the track.',
      dropHere: 'Drop WAV files here',
      empty: 'Drop multiple WAV files here.\nSaved tracks disappear from the list automatically.',
      files: 'files', loading: 'Loading…', unsupported: 'Unsupported WAV format.',
      badWav: 'Could not parse the WAV file.', saved: 'Saved',
      noSelection: 'Select a range on the waveform first.',
      nothingUndo: 'Nothing to undo.',
      added: 'WAV files added', onlyWav: 'Only WAV files can be added.',
      select: 'Selection', dur: 'Length'
    }
  };

  Object.assign(I18N.ja, {
    addFiles:'音源を追加', removeWav:'リストから削除', removeWavHint:'曲リストから外します。ディスク上のファイルは削除しません。',
    noFile:'音源を追加してください', saveRemove:'WAVで保存', empty:'音源を追加して先頭・末尾を確認できます。\n保存した曲はリストに残ります。',
    dropHere:'音源ファイルをドロップ', added:'曲を追加しました', onlyWav:'音源ファイルを選択してください。',
    returnToTimeline:'リストを引き継いで戻る', unsavedPrompt:'未保存の編集があります。',
    saveReturn:'保存する曲を開く', saveReturnHint:'保存する曲を順に開き、WAVで保存してください。すべて保存後に戻れます。',
    discardReturn:'未保存分を破棄して戻る', continueEditing:'編集を続ける', modified:'修正済み', dirty:'未保存',
    noSaveSupport:'この環境では保存ダイアログを使用できません。デスクトップ版Chrome / Edgeで開いてください。',
    saveCancelled:'保存をキャンセルしました。編集は残っています。', saveFailed:'保存できませんでした。編集は残っています。',
    decodeFailed:'ブラウザで読み込めない音源です。', wavOnly:'WAV形式のファイル名（.wav）で保存してください。',
    removeDirty:'未保存の編集を破棄し、この曲をリストから削除しますか？', converted:'WAV変換済み',
    returnHint:'修正保存・追加・削除がある場合、Timeline Builderの自動配置をリセットします。',
    unsupported:'このWAV形式の無劣化編集には対応していません。'
  });
  Object.assign(I18N.en, {
    addFiles:'Add audio', removeWav:'Remove from list', removeWavHint:'Remove this track from the list. The disk file is kept.',
    noFile:'Add audio files', saveRemove:'Save as WAV', empty:'Add audio to check its head and tail.\nSaved tracks stay in the list.',
    dropHere:'Drop audio files here', added:'tracks added', onlyWav:'Select audio files.',
    returnToTimeline:'Return with this list', unsavedPrompt:'There are unsaved edits.',
    saveReturn:'Open a track to save', saveReturnHint:'Save each edited track using Save as WAV, then return.',
    discardReturn:'Discard unsaved edits and return', continueEditing:'Keep editing', modified:'Edited', dirty:'Unsaved',
    noSaveSupport:'Save dialogs are unavailable here. Open in desktop Chrome / Edge.',
    saveCancelled:'Save cancelled. Your edits are retained.', saveFailed:'Save failed. Your edits are retained.',
    decodeFailed:'This browser could not decode the audio.', wavOnly:'Save with a WAV filename (.wav).',
    removeDirty:'Discard unsaved edits and remove this track from the list?', converted:'Converted to WAV',
    returnHint:'Saving edits, adding or removing tracks resets the Timeline Builder arrangement.',
    unsupported:'Lossless editing of this WAV format is not supported.'
  });
  let lang = bridge.lang;
  const canSave = typeof window.showSaveFilePicker === 'function';
  let savedThisVisit = false;
  const hasUnsaved = () => tracks.some(track => track.ops.length > 0);
  let tracks = bridge.entries.map(entry => ({ ...entry, ops: [] }));
  let currentIndex = -1;
  let current = null;
  let currentLoadToken = 0;
  let audioCtx = null;
  let activeSource = null;
  let playingKind = null;
  let playingMode = null;
  let playbackToken = 0;
  let isSaving = false;
  let statusTimer = 0;

  const views = {
    head: { canvas: $('headCanvas'), gain: 40, windowSec: 1.0, minWindow: 0.05, maxWindow: 10.0, selection: null },
    tail: { canvas: $('tailCanvas'), gain: 20, windowSec: 5.0, minWindow: 0.50, maxWindow: 20.0, selection: null }
  };

  const NOISE_PREVIEW_LIMITS = { rmsDb: -18, peakDb: -12 };

  // Analyze the entire selection before playback. Use the loudest sliding
  // 50 ms RMS window (per channel), so silence cannot dilute the estimate.
  // A single fixed gain preserves dynamics and stereo balance; no compressor,
  // EQ, or fade that could conceal the transient being inspected.
  function prepareNoisePreview(channels, start, end, sampleRate) {
    const count = end - start;
    const mono = channels.length > 2;
    const output = Array.from({ length: mono ? 1 : channels.length }, () => new Float32Array(count));
    for (let i = 0; i < count; i++) {
      for (let ch = 0; ch < channels.length; ch++) {
        const value = channels[ch][start + i];
        if (!Number.isFinite(value)) throw new Error(t('previewInvalid'));
        if (mono) output[0][i] += value / channels.length;
        else output[ch][i] = value;
      }
    }
    let peak = 0, maxMeanSquare = 0;
    const windowFrames = Math.max(1, Math.min(count, Math.round(sampleRate * 0.05)));
    for (const ch of output) {
      let sum = 0;
      for (let i = 0; i < count; i++) {
        peak = Math.max(peak, Math.abs(ch[i]));
        sum += ch[i] * ch[i];
        if (i >= windowFrames) sum -= ch[i - windowFrames] * ch[i - windowFrames];
        if (i >= windowFrames - 1) maxMeanSquare = Math.max(maxMeanSquare, sum / windowFrames);
      }
    }
    if (!Number.isFinite(peak) || !Number.isFinite(maxMeanSquare)) throw new Error(t('previewInvalid'));
    if (peak === 0) return { channels: output, silent: true, mono };
    const setting = NOISE_PREVIEW_LIMITS;
    const rms = Math.sqrt(maxMeanSquare);
    // Cap amplification at +60 dB; allow attenuation for accidentally selected music.
    // Margin prevents Float32 rounding from exceeding the sample-peak ceiling.
    const gain = Math.min(1000, 10 ** (setting.peakDb / 20) / peak,
      rms > 0 ? 10 ** (setting.rmsDb / 20) / rms : 1000) * (1 - 1e-6);
    let outputPeak = 0;
    for (const ch of output) {
      for (let i = 0; i < count; i++) {
        ch[i] *= gain;
        outputPeak = Math.max(outputPeak, Math.abs(ch[i]));
      }
    }
    return { channels: output, gainDb: 20 * Math.log10(gain), peakDb: 20 * Math.log10(outputPeak), mono, silent: false };
  }

  function t(key) { return I18N[lang][key] ?? key; }

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = t(el.dataset.i18nTitle);
    });
    $('langBtn').textContent = lang === 'ja' ? 'EN' : '日本語';
    renderTrackList();
    updateTopbar();
    updateSelectionUI('head');
    updateSelectionUI('tail');
    updatePlaybackUI();
  }

  function showStatus(message, isError = false) {
    const el = $('status');
    el.textContent = message;
    el.classList.toggle('error', isError);
    el.classList.add('show');
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  function formatTime(sec) {
    if (!Number.isFinite(sec)) return '0:00.000';
    sec = Math.max(0, sec);
    const m = Math.floor(sec / 60);
    const s = sec - m * 60;
    return `${m}:${s.toFixed(3).padStart(6, '0')}`;
  }

  function formatShort(sec) {
    if (sec < 1) return `${Math.round(sec * 1000)} ms`;
    return `${sec.toFixed(sec < 10 ? 3 : 2)} s`;
  }

  function bytesToAscii(view, offset, len) {
    let s = '';
    for (let i = 0; i < len; i++) s += String.fromCharCode(view.getUint8(offset + i));
    return s;
  }

  function parseWav(arrayBuffer) {
    const view = new DataView(arrayBuffer);
    if (view.byteLength < 44 || bytesToAscii(view, 0, 4) !== 'RIFF' || bytesToAscii(view, 8, 4) !== 'WAVE') {
      throw new Error(t('badWav'));
    }
    const riffSize = view.getUint32(4, true);
    if (riffSize < 36 || riffSize + 8 > view.byteLength) throw new Error(t('badWav'));

    let offset = 12;
    let fmt = null;
    let data = null;

    while (offset + 8 <= riffSize + 8) {
      const id = bytesToAscii(view, offset, 4);
      const size = view.getUint32(offset + 4, true);
      const body = offset + 8;
      if (body + size > riffSize + 8) throw new Error(t('badWav'));

      if (id === 'fmt ') {
        if (size < 16) throw new Error(t('badWav'));
        const formatTag = view.getUint16(body, true);
        const channels = view.getUint16(body + 2, true);
        const sampleRate = view.getUint32(body + 4, true);
        const byteRate = view.getUint32(body + 8, true);
        const blockAlign = view.getUint16(body + 12, true);
        const bitsPerSample = view.getUint16(body + 14, true);
        let effectiveFormat = formatTag;
        if (formatTag === 0xFFFE && size >= 40) {
          if (view.getUint16(body + 18, true) !== bitsPerSample) throw new Error(t('unsupported'));
          effectiveFormat = view.getUint16(body + 24, true); // first 16 bits of SubFormat GUID
        }
        fmt = { formatTag, effectiveFormat, channels, sampleRate, byteRate, blockAlign, bitsPerSample, offset: body, size };
      } else if (id === 'data') {
        if (data) throw new Error(t('unsupported'));
        data = { offset: body, size, sizeOffset: offset + 4 };
      }

      offset = body + size + (size & 1);
    }

    if (!fmt || !data) throw new Error(t('badWav'));
    if (![1, 3].includes(fmt.effectiveFormat)) throw new Error(t('unsupported'));
    if (fmt.channels < 1 || fmt.channels > 8 || fmt.sampleRate < 8000 || fmt.sampleRate > 384000) throw new Error(t('unsupported'));
    if (fmt.effectiveFormat === 1 && ![8, 16, 24, 32].includes(fmt.bitsPerSample)) throw new Error(t('unsupported'));
    if (fmt.effectiveFormat === 3 && ![32, 64].includes(fmt.bitsPerSample)) throw new Error(t('unsupported'));

    const bytesPerSample = fmt.bitsPerSample / 8;
    // A byte-exact PCM editor must know where every channel's sample begins.
    if (fmt.blockAlign !== bytesPerSample * fmt.channels || data.size % fmt.blockAlign !== 0) {
      throw new Error(t('unsupported'));
    }
    const frameCount = data.size / fmt.blockAlign;
    const duration = frameCount / fmt.sampleRate;

    return {
      ...fmt, riffSize, dataOffset: data.offset, dataSize: data.size,
      dataSizeOffset: data.sizeOffset, bytesPerSample, frameCount, duration
    };
  }

  function readNormalized(view, offset, info) {
    if (info.effectiveFormat === 3) {
      return info.bitsPerSample === 32 ? view.getFloat32(offset, true) : view.getFloat64(offset, true);
    }
    switch (info.bitsPerSample) {
      case 8: return (view.getUint8(offset) - 128) / 128;
      case 16: return view.getInt16(offset, true) / 32768;
      case 24: {
        let v = view.getUint8(offset) | (view.getUint8(offset + 1) << 8) | (view.getUint8(offset + 2) << 16);
        if (v & 0x800000) v |= 0xFF000000;
        return v / 8388608;
      }
      case 32: return view.getInt32(offset, true) / 2147483648;
      default: return 0;
    }
  }

  function writeNormalized(view, offset, info, sample) {
    sample = Number.isFinite(sample) ? sample : 0;
    if (info.effectiveFormat === 3) {
      if (info.bitsPerSample === 32) view.setFloat32(offset, sample, true);
      else view.setFloat64(offset, sample, true);
      return;
    }
    sample = Math.max(-1, Math.min(1, sample));
    switch (info.bitsPerSample) {
      case 8: {
        const v = Math.max(0, Math.min(255, Math.round(sample * 128 + 128)));
        view.setUint8(offset, v);
        break;
      }
      case 16: {
        const v = sample <= -1 ? -32768 : Math.min(32767, Math.round(sample * 32767));
        view.setInt16(offset, v, true);
        break;
      }
      case 24: {
        let v = sample <= -1 ? -8388608 : Math.min(8388607, Math.round(sample * 8388607));
        if (v < 0) v += 0x1000000;
        view.setUint8(offset, v & 0xff);
        view.setUint8(offset + 1, (v >> 8) & 0xff);
        view.setUint8(offset + 2, (v >> 16) & 0xff);
        break;
      }
      case 32: {
        const v = sample <= -1 ? -2147483648 : Math.min(2147483647, Math.round(sample * 2147483647));
        view.setInt32(offset, v, true);
        break;
      }
    }
  }

  function decodeToFloatChannels(arrayBuffer, info) {
    const view = new DataView(arrayBuffer);
    const channels = Array.from({ length: info.channels }, () => new Float32Array(info.frameCount));
    const bps = info.bytesPerSample;
    for (let frame = 0; frame < info.frameCount; frame++) {
      const frameOffset = info.dataOffset + frame * info.blockAlign;
      for (let ch = 0; ch < info.channels; ch++) {
        channels[ch][frame] = readNormalized(view, frameOffset + ch * bps, info);
      }
    }
    return channels;
  }

  function cloneChannels(channels) {
    return channels.map(ch => ch.slice());
  }

  function applyOperationToChannels(channels, op) {
    const frameCount = channels[0].length;
    if (op.type === 'append') {
      return channels.map(ch => {
        const result = new Float32Array(frameCount + op.frames);
        result.set(ch);
        return result;
      });
    }
    if (op.type === 'trim') {
      const cut = Math.max(1, Math.min(frameCount, op.startFrame));
      return channels.map(ch => ch.slice(0, cut));
    }

    const start = Math.max(0, Math.min(frameCount, op.startFrame));
    const end = Math.max(start, Math.min(frameCount, op.endFrame));
    const count = Math.max(1, end - start);
    if (op.type === 'silence') {
      for (const ch of channels) ch.fill(0, start, end);
    } else if (op.type === 'fadeIn' || op.type === 'fadeOut' || op.type === 'fade') {
      for (const ch of channels) {
        for (let i = start; i < end; i++) {
          const pos = count === 1 ? 0 : (i - start) / (count - 1);
          const gain = op.type === 'fadeIn' ? pos : 1 - pos;
          ch[i] *= gain;
        }
        if (end > start && op.type !== 'fadeIn') ch[end - 1] = 0;
        if (end > start && op.type === 'fadeIn') ch[start] = 0;
      }
    }
    return channels;
  }

  function workingInfo(baseInfo, channels) {
    const frameCount = channels[0].length;
    return {
      ...baseInfo, frameCount, duration: frameCount / baseInfo.sampleRate,
      dataSize: frameCount * baseInfo.blockAlign
    };
  }

  function rebuildWorking() {
    if (!current) return;
    let channels = cloneChannels(current.sourceChannels);
    for (const op of current.track.ops) channels = applyOperationToChannels(channels, op);
    current.workingChannels = channels;
    current.info = workingInfo(current.baseInfo, channels);
    views.head.selection = null;
    views.tail.selection = null;
    stopPlayback();
    updateTopbar();
    drawAll();
    updateControls();
  }

  function applyOperationToRawBuffer(arrayBuffer, info, op) {
    const view = new DataView(arrayBuffer);
    const start = Math.max(0, Math.min(info.frameCount, op.startFrame));
    const end = Math.max(start, Math.min(info.frameCount, op.endFrame));
    const count = Math.max(1, end - start);
    const bps = info.bytesPerSample;

    for (let frame = start; frame < end; frame++) {
      const frameOffset = info.dataOffset + frame * info.blockAlign;
      const pos = count === 1 ? 0 : (frame - start) / (count - 1);
      const gain = op.type === 'fadeIn' ? pos : 1 - pos;
      for (let ch = 0; ch < info.channels; ch++) {
        const sampleOffset = frameOffset + ch * bps;
        if (op.type === 'silence') {
          writeNormalized(view, sampleOffset, info, 0);
        } else {
          const s = readNormalized(view, sampleOffset, info);
          const forceZero = op.type === 'fadeIn' ? frame === start : frame === end - 1;
          writeNormalized(view, sampleOffset, info, forceZero ? 0 : s * gain);
        }
      }
    }
  }

  function updateFactChunkLength(arrayBuffer, info) {
    // WAVE_FORMAT_IEEE_FLOAT frequently has a fact chunk; its sample length
    // must agree with the resized data chunk, even when fact follows data.
    const v = new DataView(arrayBuffer);
    let pos = 12;
    const riffEnd = v.getUint32(4, true) + 8;
    while (pos + 8 <= riffEnd) {
      const size = v.getUint32(pos + 4, true);
      if (bytesToAscii(v, pos, 4) === 'fact' && size >= 4) {
        v.setUint32(pos + 8, info.frameCount, true);
      }
      pos += 8 + size + (size & 1);
    }
  }

  function resizeRawWav(arrayBuffer, info, targetFrames) {
    if (targetFrames === info.frameCount) return { buffer: arrayBuffer, info };
    if (targetFrames < 1) throw new Error(t('badTrimValue'));
    const newDataSize = targetFrames * info.blockAlign;
    const padBefore = info.dataSize & 1;
    const padAfter = newDataSize & 1;
    const delta = newDataSize + padAfter - info.dataSize - padBefore;
    const riffSize = info.riffSize + delta;
    if (riffSize < 36 || riffSize > 0xFFFFFFFF || arrayBuffer.byteLength + delta > 0xFFFFFFFF) {
      throw new Error(t('unsupported'));
    }

    const original = new Uint8Array(arrayBuffer);
    const changed = new Uint8Array(arrayBuffer.byteLength + delta);
    const dataStart = info.dataOffset;
    const keptBytes = Math.min(info.dataSize, newDataSize);
    changed.set(original.subarray(0, dataStart + keptBytes), 0);
    if (newDataSize > info.dataSize && info.effectiveFormat === 1 && info.bitsPerSample === 8) {
      // 8-bit unsigned PCM encodes digital silence as 0x80, not 0x00.
      changed.fill(128, dataStart + info.dataSize, dataStart + newDataSize);
    }
    const oldSuffix = dataStart + info.dataSize + padBefore;
    const newSuffix = dataStart + newDataSize + padAfter;
    changed.set(original.subarray(oldSuffix), newSuffix);

    const v = new DataView(changed.buffer);
    v.setUint32(4, riffSize, true);
    v.setUint32(info.dataSizeOffset, newDataSize, true);
    const newInfo = parseWav(changed.buffer);
    updateFactChunkLength(changed.buffer, newInfo);
    return { buffer: changed.buffer, info: newInfo };
  }

  function exportEditedWav(sourceBuffer, operations) {
    let buffer = sourceBuffer;
    let info = parseWav(buffer);
    for (const op of operations) {
      if (op.type === 'append') {
        ({ buffer, info } = resizeRawWav(buffer, info, info.frameCount + op.frames));
      } else if (op.type === 'trim') {
        ({ buffer, info } = resizeRawWav(buffer, info, op.startFrame));
      } else {
        applyOperationToRawBuffer(buffer, info, op);
      }
    }
    return buffer;
  }

  function updateTopbar() {
    if (!current) {
      $('filename').textContent = t('noFile');
      $('meta').textContent = '';
      return;
    }
    const { info, track } = current;
    $('filename').textContent = track.file.name;
    const formatName = info.effectiveFormat === 3 ? `Float ${info.bitsPerSample}` : `${info.bitsPerSample}-bit PCM`;
    $('meta').textContent = `${(info.sampleRate / 1000).toFixed(info.sampleRate % 1000 ? 1 : 0)} kHz · ${info.channels}ch · ${formatName} · ${formatTime(info.duration)}`;
  }

  function renderTrackList() {
    const list = $('trackList');
    list.innerHTML = '';
    if (!tracks.length) {
      const e = document.createElement('div');
      e.className = 'empty-list';
      e.style.whiteSpace = 'pre-line';
      e.textContent = t('empty');
      list.appendChild(e);
    } else {
      tracks.forEach((track, index) => {
        const b = document.createElement('button');
        b.className = 'track-item' + (index === currentIndex ? ' active' : '') + (track.edgeModified ? ' edited' : '');
        b.disabled = isSaving;
        b.textContent = track.file.name + (track.ops.length ? ' · ' + t('dirty') : track.edgeModified ? ' · ' + t('modified') : '');
        b.title = track.file.name;
        b.addEventListener('click', () => selectTrack(index));
        list.appendChild(b);
      });
    }
    $('trackCount').textContent = `${tracks.length} ${t('files')}`;
  }

  async function selectTrack(index) {
    if (isSaving || index < 0 || index >= tracks.length) return;
    const token = ++currentLoadToken;
    currentIndex = index;
    current = null;
    views.head.selection = null;
    views.tail.selection = null;
    renderTrackList();
    $('filename').textContent = tracks[index].file.name;
    $('meta').textContent = t('loading');
    updateControls();
    drawAll();
    stopPlayback();

    try {
      const buffer = await tracks[index].file.arrayBuffer();
      if (token !== currentLoadToken) return;
      let sourceBuffer = buffer;
      const header = new DataView(buffer);
      const wav = buffer.byteLength >= 12 && ['RIFF','RF64','RIFX'].includes(bytesToAscii(header,0,4)) && bytesToAscii(header,8,4) === 'WAVE';
      if (!wav && !/\.wav$/i.test(tracks[index].file.name)) {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        try {
          const decoded = await context.decodeAudioData(buffer.slice(0));
          sourceBuffer = encodePcm24(decoded);
        } catch (error) { throw new Error(t('decodeFailed') + ' ' + error.message); }
        finally { await context.close(); }
      }
      if (token !== currentLoadToken) return;
      const baseInfo = parseWav(sourceBuffer);
      const sourceChannels = decodeToFloatChannels(sourceBuffer, baseInfo);
      if (token !== currentLoadToken) return;
      let workingChannels = cloneChannels(sourceChannels);
      for (const op of tracks[index].ops) workingChannels = applyOperationToChannels(workingChannels, op);
      const info = workingInfo(baseInfo, workingChannels);
      current = { track: tracks[index], sourceBuffer, baseInfo, info, sourceChannels, workingChannels };
      views.head.windowSec = Math.min(1, Math.max(views.head.minWindow, info.duration));
      views.tail.windowSec = Math.min(5, Math.max(views.tail.minWindow, info.duration));
      updateTopbar();
      drawAll();
      updateControls();
    } catch (err) {
      if (token !== currentLoadToken) return;
      showStatus(err?.message || t('badWav'), true);
      current = null;
      updateTopbar();
      updateControls();
      drawAll();
    }
  }

  function addFiles(fileList, handles = new Map()) {
    const files = Array.from(fileList || []);
    if (isSaving) return;
    const wavs = files;
    if (!wavs.length) {
      showStatus(t('onlyWav'), true);
      return;
    }
    for (const file of wavs) {
      tracks.push({ id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, file, sourceHandle:handles.get(file) || null, ops: [] });
    }
    renderTrackList();
    showStatus(`${wavs.length} ${t('added')}`);
    if (currentIndex < 0) selectTrack(0);
  }

  function getViewRange(kind) {
    if (!current) return { start: 0, end: 1 };
    const v = views[kind];
    const dur = current.info.duration;
    const width = Math.min(v.windowSec, dur || v.windowSec);
    if (kind === 'head') return { start: 0, end: Math.max(0.001, width) };
    return { start: Math.max(0, dur - width), end: dur };
  }

  function setupCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width: rect.width, height: rect.height };
  }

  function plotGeometry(width, height) {
    // Reserve a fixed gutter for the dBFS axis, rather than drawing labels over samples.
    const left = Math.min(76, Math.max(51, width * 0.16));
    const right = Math.max(left + 1, width - 9);
    return { left, right, width: right - left, mid: height / 2, halfHeight: height * 0.45 };
  }

  function drawDbAxis(ctx, plot, displayGainDb) {
    const { left, right, mid, halfHeight } = plot;
    const ratios = [1, 0.5, 0.25, 0.125, 0.0625];

    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = '11px ui-monospace, SFMono-Regular, Consolas, monospace';

    // These are *amplitude* grid lines. Their dBFS labels correspond to the
    // original samples, independent of the display-only gain amplification.
    for (const sign of [-1, 1]) {
      let previousLabelY = null;
      for (const ratio of ratios) {
        const y = mid + sign * ratio * halfHeight;
        ctx.strokeStyle = ratio === 1 ? '#435161' : '#283541';
        ctx.setLineDash(ratio === 1 ? [] : [3, 5]);
        ctx.beginPath();
        ctx.moveTo(left, Math.round(y) + 0.5);
        ctx.lineTo(right, Math.round(y) + 0.5);
        ctx.stroke();

        // Avoid overlapping the labels close to the zero-amplitude centerline.
        if (previousLabelY !== null && Math.abs(y - previousLabelY) < 15) continue;
        if (Math.abs(y - mid) < 13) continue;
        const dbfs = -displayGainDb + 20 * Math.log10(ratio);
        ctx.fillStyle = '#c0cedb';
        ctx.textAlign = 'right';
        ctx.fillText(String(Math.round(dbfs)), left - 10, y + 3.5);
        previousLabelY = y;
      }
    }

    ctx.setLineDash([]);
    ctx.strokeStyle = '#566778';
    ctx.beginPath();
    ctx.moveTo(left + 0.5, mid - halfHeight);
    ctx.lineTo(left + 0.5, mid + halfHeight);
    ctx.stroke();
    ctx.strokeStyle = '#435161';
    ctx.beginPath();
    ctx.moveTo(left, Math.round(mid) + 0.5);
    ctx.lineTo(right, Math.round(mid) + 0.5);
    ctx.stroke();
    ctx.fillStyle = '#aebdca';
    ctx.textAlign = 'right';
    ctx.fillText('−∞', left - 10, mid + 3.5);

    ctx.translate(15, mid);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#9db0c0';
    ctx.fillText('dBFS', 0, 0);
    ctx.restore();
  }

  function drawTimeLabel(ctx, label, x, align) {
    ctx.font = '600 12px ui-monospace, SFMono-Regular, Consolas, monospace';
    ctx.textAlign = align;
    const textWidth = ctx.measureText(label).width;
    const boxX = align === 'left' ? x - 5 : x - textWidth - 5;
    ctx.fillStyle = 'rgba(11, 16, 22, .9)';
    ctx.fillRect(boxX, 3, textWidth + 10, 18);
    ctx.fillStyle = '#ff6771';
    ctx.fillText(label, x, 16);
  }

  function drawWave(kind) {
    const v = views[kind];
    const { ctx, width, height } = setupCanvas(v.canvas);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#10151b';
    ctx.fillRect(0, 0, width, height);

    if (!current || width < 2 || height < 2) {
      ctx.strokeStyle = '#29333e';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, height / 2 + .5); ctx.lineTo(width, height / 2 + .5); ctx.stroke();
      ctx.fillStyle = '#697889';
      ctx.font = '13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(t('noFile'), width / 2, height / 2);
      return;
    }

    const { start, end } = getViewRange(kind);
    const info = current.info;
    const channels = current.workingChannels;
    const gain = Math.pow(10, v.gain / 20);
    const plot = plotGeometry(width, height);
    const mid = plot.mid;
    drawDbAxis(ctx, plot, v.gain);
    const startFrame = Math.max(0, Math.floor(start * info.sampleRate));
    const endFrame = Math.min(info.frameCount, Math.ceil(end * info.sampleRate));
    const totalFrames = Math.max(1, endFrame - startFrame);

    ctx.strokeStyle = '#6aaac4';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x < Math.ceil(plot.width); x++) {
      let f0 = Math.min(endFrame - 1, startFrame + Math.floor((x / plot.width) * totalFrames));
      let f1 = startFrame + Math.floor(((x + 1) / plot.width) * totalFrames);
      if (f1 <= f0) f1 = f0 + 1;
      f1 = Math.min(f1, endFrame);
      let min = 1, max = -1;
      for (let frame = f0; frame < f1; frame++) {
        for (let ch = 0; ch < channels.length; ch++) {
          const s = channels[ch][frame] * gain;
          if (s < min) min = s;
          if (s > max) max = s;
        }
      }
      min = Math.max(-1, Math.min(1, min));
      max = Math.max(-1, Math.min(1, max));
      const y1 = mid - max * plot.halfHeight;
      const y2 = mid - min * plot.halfHeight;
      ctx.moveTo(plot.left + x + .5, y1);
      ctx.lineTo(plot.left + x + .5, y2);
    }
    ctx.stroke();

    if (v.selection) {
      const a = Math.max(start, Math.min(end, Math.min(v.selection.start, v.selection.end)));
      const b = Math.max(start, Math.min(end, Math.max(v.selection.start, v.selection.end)));
      if (b > a) {
        const x1 = plot.left + ((a - start) / (end - start)) * plot.width;
        const x2 = plot.left + ((b - start) / (end - start)) * plot.width;
        ctx.fillStyle = 'rgba(125, 211, 252, .17)';
        ctx.fillRect(x1, 0, x2 - x1, height);
        ctx.strokeStyle = 'rgba(125, 211, 252, .9)';
        ctx.beginPath(); ctx.moveTo(x1 + .5, 0); ctx.lineTo(x1 + .5, height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x2 + .5, 0); ctx.lineTo(x2 + .5, height); ctx.stroke();
      }
    }

    // Contrasting red timeline labels with opaque backplates remain readable
    // even when a large waveform occupies the full plot height.
    drawTimeLabel(ctx, formatTime(start), plot.left + 8, 'left');
    drawTimeLabel(ctx, formatTime(end), plot.right - 8, 'right');
  }

  function drawAll() {
    drawWave('head');
    drawWave('tail');
  }

  function selectionToFrames(kind) {
    if (!current) return null;
    const sel = views[kind].selection;
    if (!sel) return null;
    const a = Math.max(0, Math.min(current.info.duration, Math.min(sel.start, sel.end)));
    const b = Math.max(0, Math.min(current.info.duration, Math.max(sel.start, sel.end)));
    let startFrame = Math.max(0, Math.min(current.info.frameCount, Math.floor(a * current.info.sampleRate)));
    let endFrame = Math.max(startFrame, Math.min(current.info.frameCount, Math.ceil(b * current.info.sampleRate)));
    if (endFrame - startFrame < 1) return null;
    return { startFrame, endFrame, startSec: startFrame / current.info.sampleRate, endSec: endFrame / current.info.sampleRate };
  }

  function updateSelectionUI(kind) {
    const range = selectionToFrames(kind);
    const el = kind === 'head' ? $('headSelectionInfo') : $('tailSelectionInfo');
    if (!range) {
      el.textContent = '';
      return;
    }
    el.textContent = `${t('select')}: ${formatTime(range.startSec)} – ${formatTime(range.endSec)} · ${formatShort(range.endSec - range.startSec)}`;
  }

  function updateControls() {
    const hasCurrent = !!current;
    const hs = !!selectionToFrames('head');
    const ts = !!selectionToFrames('tail');
    for (const kind of ['head', 'tail']) {
      const range = selectionToFrames(kind);
      $(kind + 'NoiseBtn').disabled = !range || isSaving;
    }
    $('removeWavBtn').disabled = isSaving || currentIndex < 0 || !tracks[currentIndex];
    $('headPlayBtn').disabled = !hs || isSaving;
    $('headMuteBtn').disabled = !hs || isSaving;
    $('headFadeBtn').disabled = !hs || isSaving;
    $('tailPlayBtn').disabled = !ts || isSaving;
    $('tailMuteBtn').disabled = !ts || isSaving;
    $('tailFadeBtn').disabled = !ts || isSaving;
    $('tailTrimBtn').disabled = !ts || isSaving || selectionToFrames('tail').startFrame < 1;
    $('tailAppendBtn').disabled = !hasCurrent || isSaving;
    $('saveBtn').disabled = !hasCurrent || isSaving || !canSave;
    $('returnBtn').disabled = isSaving;
    $('addFilesBtn').disabled = isSaving;
    $('fileInput').disabled = isSaving;
    $('saveSupport').textContent = canSave ? '' : t('noSaveSupport');
    $('returnBtn').title = t('returnHint');
    $('undoBtn').disabled = !hasCurrent || isSaving || current.track.ops.length === 0;
    updateSelectionUI('head');
    updateSelectionUI('tail');
  }

  function canvasTimeFromEvent(kind, ev) {
    const canvas = views[kind].canvas;
    const rect = canvas.getBoundingClientRect();
    const plot = plotGeometry(rect.width, rect.height);
    const x = Math.max(0, Math.min(plot.width, ev.clientX - rect.left - plot.left));
    const { start, end } = getViewRange(kind);
    let time = start + (x / Math.max(1, plot.width)) * (end - start);
    const edgePx = 8;
    if (x <= edgePx) time = start;
    if (x >= plot.width - edgePx) time = end;
    return time;
  }

  function bindWaveInteractions(kind) {
    const canvas = views[kind].canvas;
    let dragging = false;
    let anchor = 0;

    canvas.addEventListener('pointerdown', ev => {
      if (!current || isSaving) return;
      stopPlayback();
      dragging = true;
      anchor = canvasTimeFromEvent(kind, ev);
      views[kind].selection = { start: anchor, end: anchor };
      canvas.setPointerCapture(ev.pointerId);
      drawWave(kind);
      updateControls();
    });

    canvas.addEventListener('pointermove', ev => {
      if (!dragging || !current) return;
      views[kind].selection.end = canvasTimeFromEvent(kind, ev);
      drawWave(kind);
      updateControls();
    });

    const finish = ev => {
      if (!dragging) return;
      dragging = false;
      try { canvas.releasePointerCapture(ev.pointerId); } catch (_) {}
      const sel = views[kind].selection;
      if (sel && Math.abs(sel.end - sel.start) < 0.0005) {
        // A single click on Tail chooses a precise cut / fade-to-end point.
        views[kind].selection = kind === 'tail'
          ? { start: anchor, end: current.info.duration }
          : null;
      }
      drawWave(kind);
      updateControls();
    };
    canvas.addEventListener('pointerup', finish);
    canvas.addEventListener('pointercancel', finish);

    canvas.addEventListener('wheel', ev => {
      if (!current) return;
      ev.preventDefault();
      stopPlayback();
      const v = views[kind];
      const factor = ev.deltaY < 0 ? 0.8 : 1.25;
      v.windowSec = Math.max(v.minWindow, Math.min(v.maxWindow, v.windowSec * factor, current.info.duration || v.maxWindow));
      v.selection = null;
      drawWave(kind);
      updateControls();
    }, { passive: false });
  }

  function doEdit(kind, type) {
    if (!current || isSaving) return;
    const r = selectionToFrames(kind);
    if (!r) {
      showStatus(t('noSelection'), true);
      return;
    }
    commitOperation({ type, startFrame: r.startFrame, endFrame: r.endFrame });
  }

  function commitOperation(op) {
    if (!current) return;
    current.track.ops.push(op);
    renderTrackList();
    current.workingChannels = applyOperationToChannels(current.workingChannels, op);
    current.info = workingInfo(current.baseInfo, current.workingChannels);
    views.head.selection = null;
    views.tail.selection = null;
    stopPlayback();
    updateTopbar();
    drawAll();
    updateControls();
  }

  function trimTail() {
    if (!current || isSaving) return;
    const r = selectionToFrames('tail');
    if (!r) return showStatus(t('noSelection'), true);
    if (r.startFrame < 1) return showStatus(t('badTrimValue'), true);
    commitOperation({ type: 'trim', startFrame: r.startFrame });
  }

  function appendTailSilence() {
    if (!current || isSaving) return;
    const ms = Number($('appendSilenceMs').value);
    if (!Number.isFinite(ms) || ms < 1 || ms > 30000) {
      return showStatus(t('badAppendValue'), true);
    }
    const frames = Math.max(1, Math.round(ms * current.info.sampleRate / 1000));
    commitOperation({ type: 'append', frames });
  }

  function undo() {
    if (isSaving) return;
    if (!current || current.track.ops.length === 0) {
      showStatus(t('nothingUndo'));
      return;
    }
    current.track.ops.pop();
    renderTrackList();
    rebuildWorking();
  }

  function updatePlaybackUI() {
    for (const kind of ['head', 'tail']) {
      for (const mode of ['normal', 'noise']) {
        const el = $(kind + (mode === 'noise' ? 'NoiseBtn' : 'PlayBtn'));
        const active = activeSource !== null && playingKind === kind && playingMode === mode;
        el.classList.toggle('playing', active);
        el.setAttribute('aria-pressed', String(active));
        el.textContent = mode === 'noise' ? t(active ? 'noisePlaying' : 'noisePreview') : t(active ? 'playingSelection' : 'playSelection');
      }
    }
  }

  function stopPlayback() {
    playbackToken++;
    if (activeSource) {
      try { activeSource.stop(); } catch (_) {}
      activeSource = null;
    }
    playingKind = null;
    playingMode = null;
    updatePlaybackUI();
  }

  async function playSelection(kind, mode = 'normal') {
    if (!current || isSaving) return;
    const r = selectionToFrames(kind);
    if (!r) return;
    const alreadyPlaying = activeSource && playingKind === kind && playingMode === mode;
    stopPlayback();
    if (alreadyPlaying) return;
    const token = playbackToken;
    const track = current;
    try {
      audioCtx ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') await audioCtx.resume();
      if (token !== playbackToken || current !== track) return;
      const len = r.endFrame - r.startFrame;
      let channels = current.workingChannels.map(ch => ch.subarray(r.startFrame, r.endFrame));
      if (mode === 'noise') {
        const preview = prepareNoisePreview(current.workingChannels, r.startFrame, r.endFrame,
          current.info.sampleRate);
        if (preview.silent) return showStatus(t('previewSilent'));
        channels = preview.channels;
      }
      const buffer = audioCtx.createBuffer(channels.length, len, current.info.sampleRate);
      for (let ch = 0; ch < channels.length; ch++) {
        buffer.copyToChannel(channels[ch], ch, 0);
      }
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      src.connect(audioCtx.destination);
      src.onended = () => {
        if (activeSource === src) {
          activeSource = null;
          playingKind = null;
          playingMode = null;
          updatePlaybackUI();
        }
      };
      activeSource = src;
      playingKind = kind;
      playingMode = mode;
      src.start();
      updatePlaybackUI();
    } catch (err) {
      stopPlayback();
      showStatus(err?.message || t('unsupported'), true);
    }
  }

  function discardSelectedTrack() {
    if (currentIndex < 0 || currentIndex >= tracks.length) return;
    const removedIndex = currentIndex;
    stopPlayback();
    // Invalidate a possibly in-flight file.arrayBuffer() before picking the next track.
    currentLoadToken++;
    tracks.splice(removedIndex, 1);
    current = null;
    currentIndex = -1;
    views.head.selection = null;
    views.tail.selection = null;
    if (tracks.length) {
      selectTrack(Math.min(removedIndex, tracks.length - 1));
    } else {
      renderTrackList();
      updateTopbar();
      updateControls();
      drawAll();
    }
  }

  function removeWavFromList() {
    if (isSaving || currentIndex < 0 || !tracks[currentIndex]) return;
    if (tracks[currentIndex].ops.length && !confirm(t('removeDirty'))) return;
    const name = tracks[currentIndex].file.name;
    discardSelectedTrack();
    showStatus(`${t('removed')}: ${name}`);
  }

  // No encoder round-trip for WAV: untouched sample bytes and chunks are preserved.
  function encodePcm24(audio) {
    const channels = audio.numberOfChannels, size = audio.length * channels * 3;
    if (channels < 1 || channels > 8 || size + 37 > 0xffffffff) throw new Error(t('unsupported'));
    const buffer = new ArrayBuffer(44 + size + (size & 1)), view = new DataView(buffer);
    const four = (offset, value) => [...value].forEach((c,i) => view.setUint8(offset+i,c.charCodeAt(0)));
    four(0,'RIFF'); view.setUint32(4,buffer.byteLength-8,true); four(8,'WAVE'); four(12,'fmt ');
    view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,channels,true);
    view.setUint32(24,audio.sampleRate,true); view.setUint32(28,audio.sampleRate*channels*3,true);
    view.setUint16(32,channels*3,true); view.setUint16(34,24,true); four(36,'data'); view.setUint32(40,size,true);
    for(let c=0;c<channels;c++) {
      const pcm=audio.getChannelData(c);
      for(let i=0;i<audio.length;i++) {
        if(!Number.isFinite(pcm[i])) throw new Error(t('previewInvalid'));
        const n=Math.max(-8388608,Math.min(8388607,Math.round(pcm[i]*8388608))), offset=44+(i*channels+c)*3;
        view.setUint8(offset,n & 255); view.setUint8(offset+1,(n>>8)&255); view.setUint8(offset+2,(n>>16)&255);
      }
    }
    return buffer;
  }

  async function saveAndRemove() {
    if (!current || currentIndex < 0 || isSaving || !canSave) return;
    stopPlayback();
    const selected = current, track = current.track;
    isSaving = true;
    updateControls(); renderTrackList();
    let writable;
    try {
      // Invoke the picker before any await, while the click activation is alive.
      const handle = await bridge.pickSaveFile(track);
      if (!/\.wav$/i.test(handle.name)) throw new Error(t('wavOnly'));
      const result = exportEditedWav(selected.sourceBuffer.slice(0), track.ops);
      const blob = new Blob([result], {type:'audio/wav'});
      writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      writable = null;
      track.sourceHandle = handle;
      bridge.rememberSavedHandle(handle);
      // close() is the commit point. Keep the same bytes if refreshing the handle fails.
      let savedFile;
      try { savedFile = await handle.getFile(); }
      catch (_) { savedFile = new File([blob], handle.name, {type:'audio/wav', lastModified:Date.now()}); }
      const wasEdited = track.ops.length > 0;
      track.file = savedFile;
      track.edgeModified = track.edgeModified || wasEdited;
      track.savedThisVisit = true;
      savedThisVisit = true;
      track.ops = [];
      selected.sourceBuffer = result;
      selected.baseInfo = parseWav(result);
      selected.sourceChannels = decodeToFloatChannels(result, selected.baseInfo);
      rebuildWorking();
      showStatus(t('saved') + ': ' + savedFile.name);
    } catch (error) {
      if (writable) { try { await writable.abort(); } catch (_) {} }
      showStatus(error.name === 'AbortError' ? t('saveCancelled') : t('saveFailed') + ' ' + error.message, error.name !== 'AbortError');
    } finally { isSaving = false; updateControls(); renderTrackList(); }
  }

  function returnToTimeline(discard = false) {
    if (isSaving) return;
    stopPlayback();
    if (hasUnsaved() && !discard) {
      $('unsavedNames').textContent = tracks.filter(x=>x.ops.length).map(x=>x.file.name).join('\n');
      $('saveReturnBtn').disabled = !canSave;
      $('returnDialog').showModal();
      return;
    }
    currentLoadToken++;
    if (audioCtx) audioCtx.close().catch(()=>{});
    bridge.finish(tracks.map(({id,file,sourceHandle,edgeModified,savedThisVisit})=>({id,file,sourceHandle,edgeModified:!!edgeModified,savedThisVisit:!!savedThisVisit})), savedThisVisit, lang);
  }
  $('returnBtn').addEventListener('click', () => returnToTimeline());
  $('discardReturnBtn').addEventListener('click', () => { $('returnDialog').close(); returnToTimeline(true); });
  $('cancelReturnBtn').addEventListener('click', () => $('returnDialog').close());
  $('saveReturnBtn').addEventListener('click', () => {
    $('returnDialog').close();
    selectTrack(tracks.findIndex(x=>x.ops.length));
    $('saveBtn').focus();
  });
  bridge.hasPending = () => isSaving || hasUnsaved() || savedThisVisit || tracks.length !== bridge.entries.length || tracks.some(x=>!bridge.entries.some(y=>y.id===x.id));

  $('addFilesBtn').addEventListener('click', async () => {
    if (isSaving) return;
    if (!bridge.pickAudioEntries) { $('fileInput').click(); return; }
    isSaving = true;
    updateControls(); renderTrackList();
    try {
      const entries = await bridge.pickAudioEntries();
      isSaving = false;
      addFiles(entries.map(x=>x.file), new Map(entries.map(x=>[x.file,x.sourceHandle])));
    } catch (error) {
      if (error.name !== 'AbortError') showStatus(error.message, true);
    } finally { isSaving = false; updateControls(); renderTrackList(); }
  });
  $('removeWavBtn').addEventListener('click', removeWavFromList);
  $('fileInput').addEventListener('change', ev => {
    addFiles(ev.target.files);
    ev.target.value = '';
  });
  $('langBtn').addEventListener('click', () => {
    lang = lang === 'ja' ? 'en' : 'ja';
    applyLanguage();
  });

  $('headGain').addEventListener('input', ev => {
    views.head.gain = Number(ev.target.value);
    $('headGainValue').textContent = `+${views.head.gain} dB`;
    drawWave('head');
  });
  $('tailGain').addEventListener('input', ev => {
    views.tail.gain = Number(ev.target.value);
    $('tailGainValue').textContent = `+${views.tail.gain} dB`;
    drawWave('tail');
  });

  $('headMuteBtn').addEventListener('click', () => doEdit('head', 'silence'));
  $('headFadeBtn').addEventListener('click', () => doEdit('head', 'fadeIn'));
  $('tailMuteBtn').addEventListener('click', () => doEdit('tail', 'silence'));
  $('tailFadeBtn').addEventListener('click', () => doEdit('tail', 'fadeOut'));
  $('tailTrimBtn').addEventListener('click', trimTail);
  $('tailAppendBtn').addEventListener('click', appendTailSilence);
  $('headPlayBtn').addEventListener('click', () => playSelection('head'));
  $('tailPlayBtn').addEventListener('click', () => playSelection('tail'));
  for (const kind of ['head', 'tail']) {
    $(kind + 'NoiseBtn').addEventListener('click', () => playSelection(kind, 'noise'));
  }
  $('undoBtn').addEventListener('click', undo);
  $('saveBtn').addEventListener('click', saveAndRemove);

  bindWaveInteractions('head');
  bindWaveInteractions('tail');

  // M = silence, F = fade in/out, Ctrl/Cmd+Z = undo, Enter = save.
  let lastTouched = 'head';
  for (const kind of ['head', 'tail']) {
    views[kind].canvas.addEventListener('pointerdown', () => { lastTouched = kind; });
  }
  window.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') { ev.preventDefault(); stopPlayback(); return; }
    if (ev.key === ' ' && activeSource) { ev.preventDefault(); stopPlayback(); return; }
    if (ev.ctrlKey || ev.metaKey) {
      if (ev.key.toLowerCase() === 'z') { ev.preventDefault(); undo(); }
      return;
    }
    // Don't hijack Enter/Space when a focused button is being operated.
    if (ev.target instanceof HTMLElement && ev.target.closest('button, input, select, textarea')) return;
    if (ev.key.toLowerCase() === 'm') { ev.preventDefault(); doEdit(lastTouched, 'silence'); }
    else if (ev.key.toLowerCase() === 'f') { ev.preventDefault(); doEdit(lastTouched, lastTouched === 'head' ? 'fadeIn' : 'fadeOut'); }
    else if (ev.key === 'Enter' && current) { ev.preventDefault(); saveAndRemove(); }
    else if (ev.key === ' ') { ev.preventDefault(); playSelection(lastTouched); }
  });

  let dragDepth = 0;
  window.addEventListener('dragenter', ev => {
    ev.preventDefault();
    dragDepth++;
    $('dropOverlay').classList.add('show');
  });
  window.addEventListener('dragover', ev => ev.preventDefault());
  window.addEventListener('dragleave', ev => {
    ev.preventDefault();
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0) $('dropOverlay').classList.remove('show');
  });
  window.addEventListener('drop', async ev => {
    ev.preventDefault();
    dragDepth = 0;
    $('dropOverlay').classList.remove('show');
    if (isSaving) return;
    // Capture both File and handle promises while the drop event is still active.
    const files = Array.from(ev.dataTransfer.files);
    const items = Array.from(ev.dataTransfer.items || []).filter(x=>x.kind === 'file');
    const pending = items.map(item => {
      const file = item.getAsFile();
      let handle;
      try { handle = item.getAsFileSystemHandle?.(); } catch (_) {}
      return Promise.resolve(handle).catch(()=>null).then(sourceHandle=>({file,sourceHandle}));
    });
    isSaving = true; updateControls(); renderTrackList();
    try {
      const entries = await Promise.all(pending);
      isSaving = false;
      if (entries.some(x=>x.file)) {
        const valid = entries.filter(x=>x.file);
        addFiles(valid.map(x=>x.file), new Map(valid.map(x=>[x.file,x.sourceHandle?.kind === 'file' ? x.sourceHandle : null])));
      } else addFiles(files);
    } finally { isSaving = false; updateControls(); renderTrackList(); }
  });

  const ro = new ResizeObserver(() => drawAll());
  ro.observe($('headCanvas').parentElement);
  ro.observe($('tailCanvas').parentElement);

  applyLanguage();
  renderTrackList();
  updateControls();
  drawAll();
  if (tracks.length) selectTrack(0);

  }
};
