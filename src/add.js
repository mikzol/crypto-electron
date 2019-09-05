const electron = require('electron'); // required for all js in electron app
const path = require('path');


const ipc = electron.ipcRenderer; // inter-process communication

const currPlaceholder = document.getElementById('notifyVal');

// close button event logic
const clsBtn = document.getElementById('closeBtn');

clsBtn.addEventListener('click', function(event) {
    
    var window = remote.getCurrentWindow(); // close current window only
    window.close();

});

// update button event logic
const updBtn = document.getElementById('updateBtn');

updBtn.addEventListener('click', function(event) {

    var val = document.getElementById('notifyVal').value;
    if (val == '') { return; }

    ipc.send('update-notify-val', val); // send to main.js through ipc

    var window = remote.getCurrentWindow();
    window.close();

});

// receive currency values from index.html
ipc.on('currencyVal', function(event, curr, currSym) {

    currPlaceholder.placeholder = curr + ' (' + currSym + ')'; // set display value to current currency

});


