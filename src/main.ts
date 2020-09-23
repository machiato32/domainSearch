import { app, BrowserWindow, shell } from 'electron';
function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1100,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }

  });
  // and load the index.html of the app.
  win.loadFile(__dirname + '/index.html');
  win.removeMenu();
  win.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
}

app.whenReady().then(createWindow);