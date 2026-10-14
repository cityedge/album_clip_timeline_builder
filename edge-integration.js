/* Optional Edge Fixer integration. Timeline placement/export remains in index.html. */
'use strict';

function newTrackId() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
}

function freshTrack(file, id = newTrackId(), edgeModified = false, sourceHandle = null) {
  return { id, file, fileName: file.name, edgeModified, sourceHandle, loaded: false,
    arrayBuffer: null, bytes: null, fmt: null, dataOffset: 0, dataSize: 0,
    totalFrames: 0, durationSec: 0, detected: false, peakEnvelope: null,
    soundStartFrame: 0, soundEndFrame: 0, albumZeroFrame: 0 };
}

// Kept in the Timeline window so closing/reopening the editor does not forget it.
let lastEdgeSaveHandle = null;

async function pickAudioEntries() {
  const handles = await window.showOpenFilePicker({
    id:'album-audio-open', multiple:true,
    types:[{description:'Audio', accept:{
      'audio/wav':['.wav'], 'audio/mpeg':['.mp3'], 'audio/mp4':['.m4a'],
      'audio/aac':['.aac'], 'audio/ogg':['.ogg','.opus'], 'audio/flac':['.flac'],
      'audio/aiff':['.aif','.aiff'], 'audio/webm':['.webm']
    }}]
  });
  return Promise.all(handles.map(async sourceHandle => ({file:await sourceHandle.getFile(),sourceHandle})));
}

function edgeSaveOptions(track) {
  const options = {
    id:'album-edge-wav-save',
    suggestedName:track.file.name.replace(/\.[^.]+$/, '') + '.wav',
    types:[{description:'WAV audio',accept:{'audio/wav':['.wav']}}], excludeAcceptAllOption:true
  };
  // A file handle suggests its containing directory; no directory permission is needed.
  const startIn = track.sourceHandle || lastEdgeSaveHandle;
  if (startIn) options.startIn = startIn;
  return options;
}

// Existing relative order always wins. Only new entries are sorted and inserted.
function mergeEdgeEntries(existing, returned) {
  const entries = new Map(returned.map(x => [x.id, x]));
  const oldIds = new Set(existing.map(x => x.id));
  const result = existing.filter(x => entries.has(x.id)).map(x => entries.get(x.id));
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const added = returned.filter(x => !oldIds.has(x.id)).sort((a,b) => collator.compare(a.file.name,b.file.name));
  for (const entry of added) {
    const pos = result.findIndex(x => collator.compare(x.file.name, entry.file.name) > 0);
    result.splice(pos < 0 ? result.length : pos, 0, entry);
  }
  return result;
}

function emptySrtSlot() {
  return { file: null, fileName: '', size: 0, loaded: false, text: null };
}

function openEdgeEditor() {
  if (isBusy || window.edgeSession) return;
  if (!window.EdgeFixer) { setStatus(t('edgeUnavailable'), 'err'); return; }
  stopPreview();
  const existing = tracks.slice();
  existing.forEach(track => { track.id ||= newTrackId(); });
  const originalSrt = srtItems.slice();
  const selectedId = tracks[selectedIndex]?.id;
  const frame = document.createElement('iframe');
  frame.id = 'edgeEditorFrame';
  frame.title = 'Edge Fixer';
  frame.setAttribute('aria-label', t('openEdge'));
  const previousOverflow = document.body.style.overflow;
  const hidden = [...document.body.children].filter(el => !['SCRIPT','STYLE'].includes(el.tagName));
  const previousInert = hidden.map(el => el.inert);
  hidden.forEach(el => { el.inert = true; });
  document.body.style.overflow = 'hidden';
  window.edgeSession = {
    lang,
    entries: existing.map(({id,file,edgeModified,sourceHandle}) => ({id,file,sourceHandle,edgeModified:!!edgeModified})),
    pickAudioEntries: typeof window.showOpenFilePicker === 'function' ? pickAudioEntries : null,
    pickSaveFile: track => window.showSaveFilePicker(edgeSaveOptions(track)),
    rememberSavedHandle: handle => { lastEdgeSaveHandle = handle; },
    hasPending: () => false,
    finish(returned, savedThisVisit, editorLang) {
      const merged = mergeEdgeEntries(existing, returned);
      const changedList = existing.length !== merged.length || existing.some((x,i) => x.id !== merged[i]?.id);
      if (savedThisVisit || changedList) {
        // SRTs are positional in the original app. Move their slots with the old IDs,
        // leaving explicit empty slots for new tracks rather than shifting subtitles.
        if (originalSrt.length && existing.length) {
          const paired = new Map(existing.map((x,i) => [x.id, originalSrt[i]]));
          srtItems = merged.map(x => paired.get(x.id) || emptySrtSlot());
          srtItems.push(...originalSrt.slice(existing.length));
          selectedSrtIndex = srtItems.length ? 0 : -1;
        }
        // Re-home Files in the parent realm before destroying the editor frame.
        // Async File methods belonging to a detached frame can otherwise stall.
        tracks = merged.map(x => freshTrack(new File([x.file], x.file.name,
          { type:x.file.type, lastModified:x.file.lastModified }), x.id, x.edgeModified, x.sourceHandle));
        selectedIndex = Math.max(0, tracks.findIndex(x => x.id === selectedId));
        if (!tracks.length) selectedIndex = -1;
        referenceFormat = null;
        processingMode = 'standardWav';
        previewRange = null;
        detailWaveCache = null;
        pendingProject = null; // Do not reapply stale timing on the next load.
        $('fileInput').value = '';
        $('projectInput').value = '';
        setExportStatus('', 'ok');
        setStatus(t('edgeReset'), 'ok');
        if (srtItems.some(x => !x.file)) setSrtStatus(t('edgeMissingSrt'), 'warn');
      }
      frame.remove();
      hidden.forEach((el,i) => { el.inert = previousInert[i]; });
      document.body.style.overflow = previousOverflow;
      window.edgeSession = null;
      if (editorLang !== lang) { lang = editorLang; $('langSelect').value = lang; applyI18n(); }
      else if (savedThisVisit || changedList) render();
      $('openEdgeBtn').focus();
    }
  };
  // srcdoc inherits this local page's origin; a file:// child URL would not.
  const code = `(${EdgeFixer.init.toString()})(parent.edgeSession);`.replace(/<\/script/gi, '<\\/script');
  frame.srcdoc = EdgeFixer.html.replace('</body>', `<script>${code}</script></body>`);
  document.body.appendChild(frame);
}

function installEdgeIntegration() {
  Object.assign(I18N.ja, {
    openEdge:'先頭・末尾の確認・編集', edgeEdited:'修正済み',
    tipOpenEdge:'任意のEdge Fixerを開きます。音源の追加・削除、先頭・末尾の編集とWAV保存ができます。',
    edgeReset:'曲リストを更新しました。「音声読み込み・自動配置」で再開してください。',
    edgeMissingSrt:'追加曲のSRTが未割当です。該当行を選び「選択行にSRTを割当」で指定してください。',
    edgeAssignSrt:'選択行にSRTを割当', edgeUnassigned:'（未割当）',
    edgeUnavailable:'Edge Fixerを読み込めません。edge-fixer.jsをindex.htmlと同じフォルダに置いてください。',
    tipFileInput:'音源を選択します。最初の曲リストはファイル名順です。対応形式はブラウザに依存します。',
    inputModeHint:'WAVおよびブラウザが読み込める音声形式に対応。同一形式の対応WAVは標準WAVモード、それ以外はデコードモードで結合します。任意のEdge Fixerで先頭・末尾を編集し、個別WAVとして保存できます。',
    unsupportedInput:'このブラウザでは読み込めない音声形式です。'
  });
  Object.assign(I18N.en, {
    openEdge:'Check / edit head & tail', edgeEdited:'Edited',
    tipOpenEdge:'Open the optional Edge Fixer to add/remove audio, edit its edges and save individual WAV files.',
    edgeReset:'Track list updated. Use Load audio & auto arrange to continue.',
    edgeMissingSrt:'New tracks have no SRT assigned. Select the row and use Assign SRT to selected row.',
    edgeAssignSrt:'Assign SRT to selected row', edgeUnassigned:'(Unassigned)',
    edgeUnavailable:'Edge Fixer could not load. Keep edge-fixer.js beside index.html.',
    tipFileInput:'Select audio files. The initial list is sorted by filename. Format support depends on the browser.',
    inputModeHint:'Supports WAV and browser-decodable audio. Matching supported WAVs use standard WAV mode; other inputs use decode mode. The optional Edge Fixer edits heads/tails and saves individual WAV files.',
    unsupportedInput:'This browser cannot decode this audio format.'
  });
  $('openEdgeBtn').addEventListener('click', openEdgeEditor);
  $('fileInput').addEventListener('click', async event => {
    if (typeof window.showOpenFilePicker !== 'function') return;
    event.preventDefault();
    if (isBusy) return;
    setBusy(true);
    try {
      const entries = await pickAudioEntries();
      const files = entries.map(x => x.file);
      // Preserve the native input's filename/count display without losing file handles.
      const transfer = new DataTransfer();
      files.forEach(file => transfer.items.add(file));
      $('fileInput').files = transfer.files;
      handleFileSelection(files, new Map(entries.map(x => [x.file,x.sourceHandle])));
    } catch (error) {
      if (error.name !== 'AbortError') setStatus(error.message, 'err');
    } finally { setBusy(false); }
  });
  $('assignSrtBtn').addEventListener('click', () => $('assignSrtInput').click());
  $('assignSrtInput').addEventListener('change', event => {
    const file = event.target.files[0];
    if (file && !isBusy && selectedSrtIndex >= 0 && selectedSrtIndex < srtItems.length) {
      srtItems[selectedSrtIndex] = { file, fileName:file.name, size:file.size, loaded:false, text:null };
      setSrtStatus('', 'ok'); renderSrtList(); updateButtons();
    }
    event.target.value = '';
  });
  window.addEventListener('beforeunload', event => {
    if (window.edgeSession?.hasPending()) { event.preventDefault(); event.returnValue = ''; }
  });
}
