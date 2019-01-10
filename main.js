// define global vars
const {app, BrowserWindow} = require('electron'); // load modules from electron
const path = require('path');
const url = require('url');

// global ref to window object (avoid JS garbage collection)
let win;

function createWindow() {

    // create window object
    win = new BrowserWindow({width: 800, height: 600});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }));

    // open devtools
    win.webContents.openDevTools();

    // window close emitter
    win.on('closed', () => {
        win = null;
    });
}

// left off at video 10:01