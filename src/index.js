const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow; // allows for window creation

// notify button event logic
const notifyBtn = document.getElementById('notifyBtn');

notifyBtn,addEventListener('click', function(event) {

    const modalPath = path.join('file://', __dirname, 'add.html'); // retrieve path html
    let win = new BrowserWindow( // create window object
        { 
            frame:false, // remove toolbar menu
            transparent:true, // corrsponds to add.css html, body
            alwaysOnTop:true, 
            width:400, 
            height:200 
        });

    win.on('close', function() { win = null; });
    win.loadURL(modalPath); // load add.html as window
    win.show();

});