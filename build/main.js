"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
function createWindow() {
    // Create the browser window.
    var win = new electron_1.BrowserWindow({
        width: 1100,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    });
    // and load the index.html of the app.
    win.loadFile(__dirname + '/index.html');
    // win.removeMenu();
    win.webContents.on('new-window', function (e, url) {
        e.preventDefault();
        electron_1.shell.openExternal(url);
    });
}
electron_1.app.whenReady().then(createWindow);
