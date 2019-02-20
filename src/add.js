const electron = require('electron'); // required for all js in electron app
const path = require('path');
const remote = electron.remote;
const ipc = electron.ipcRenderer; // inter-process communication

// close button event logic
const clsBtn = document.getElementById('closeBtn');

clsBtn.addEventListener('click', function(event) {
    
    var window = remote.getCurrentWindow(); // close current window only
    window.close();

});

// update button event logic
const updBtn = document.getElementById('updateBtn');

updBtn.addEventListener('click', function(event) {

    ipc.send('update-notify-val', document.getElementById('notifyVal').value); // send to main.js through ipc

    var window = remote.getCurrentWindow();
    window.close();

});


