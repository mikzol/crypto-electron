// define global vars
const {app, BrowserWindow, Menu} = require('electron'); // load modules from electron
const path = require('path');
const url = require('url');
const shell = require('electron').shell;

// global ref to window object (avoid JS garbage collection)
let win;

function createWindow() {

    // create window object
    win = new BrowserWindow({width: 800, height: 600});

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file',
        slashes: true
    }));

    // open devtools [Chrome]
    // win.webContents.openDevTools();

    // window close emitter
    win.on('closed', () => {
        win = null;
    });

    // build toolbar menu (passed as array)
    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu', // header task
            submenu: [ // dropdown task(s)
                {
                    label: 'Adjust Notification Value',
                    click() {
                        // to do
                    }
                },
                {
                    label: 'Load CoinMarketCap',
                    click() {
                        // navigate to specified URL in default browser
                        shell.openExternal('https://coinmarketcap.com');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Exit',
                    click() {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'Info'
        }
    ]);

    Menu.setApplicationMenu(menu);
}

// called after Electron initialization
app.on('ready', createWindow);

// quit when all windows are closed
app.on('window-all-closed', () => {
    // darwin = macOS
    if (process.platform !== 'darwin') { app.quit(); }
});

app.on ('activate', () => {
    if (win === null) { createWindow(); }
});

 // left off at 35:20