const electron = require('electron'); // required for all js in electron app
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow; // allows for window creation
const axios = require('axios'); // import axios HTTP library (after installing to project ROOT)

// notify button
const notifyBtn = document.getElementById('notifyBtn');
// Axios HTTP
var price = document.querySelector('h1');
var targetPrice = document.getElementById('targetPrice');

// Axios HTTP library
// terminal > npm install axios --save
function getBTC() {

    // CryptoCompare API (get USD for 1 BTC)
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD&api_key=adbe9819d79d1e9fd801665a2fb6657fa318cb9e3bec611029d1b78d8380d9d6') // custom API key gained at https://cyrptocompare.com/api
        .then(res => { // task chaining

            // console.log(JSON.stringify(res)) // CD: debug
            const cryptos = res.data.BTC.USD; // return data
            price.innerHTML = '$' + cryptos.toLocaleString('en');

        });
}
getBTC();
setInterval(getBTC, 30000); // run every 30s (30000ms)

// notify button event logic
notifyBtn.addEventListener('click', function(event) {

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



