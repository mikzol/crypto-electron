const electron = require('electron');
const path = require('path');
const remote = electron.remote;

// close button event logic
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', function(event) {
    
    var window = remote.getCurrentWindow(); // close current window only
    window.close();

});
