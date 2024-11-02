const CLIENT_ID = 'YOUR_CLIENT_ID';
const API_KEY = 'YOUR_API_KEY';
const FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(() => {
    listFiles();
  });
}

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function listFiles() {
  gapi.client.drive.files.list({
    q: `'${FOLDER_ID}' in parents and mimeType='audio/flac'`,
    fields: 'files(id, name)',
    pageSize: 10
  }).then(response => {
    const files = response.result.files;
    const playlist = document.getElementById('playlist');

    if (files && files.length > 0) {
      files.forEach(file => {
        const fileElement = document.createElement('div');
        fileElement.textContent = file.name;
        fileElement.onclick = () => loadFile(file.id);
        playlist.appendChild(fileElement);
      });
    } else {
      playlist.innerHTML = 'No FLAC files found in Drive folder.';
    }
  });
}

function loadFile(fileId) {
  gapi.client.drive.files.get({
    fileId: fileId,
    alt: 'media'
  }).then(response => {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = `data:audio/flac;base64,${response.body}`;
    audioPlayer.play();
  });
}

document.addEventListener('DOMContentLoaded', handleClientLoad);
