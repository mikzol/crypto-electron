const electron = require('electron'); // required for all js in electron app
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow; // allows for window creation
const axios = require('axios'); // import axios HTTP library (after installing to project ROOT)
const ipc = electron.ipcRenderer; // inter-process communication

// notify button
const notifyBtn = document.getElementById('notifyBtn');
// Axios HTTP
var price = document.querySelector('h1');
var targetPrice = document.getElementById('targetPrice');
var targetPriceVal; // set with ipc.on event

// notification settings
const notification = {
    title: 'BTC ALERT',
    body: 'BTC VALUE EXCEEDS SET TARGET PRICE'
}

// Axios HTTP library
// terminal > npm install axios --save
function getBTC() {

    // CryptoCompare API (get USD for 1 BTC)
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD&api_key=adbe9819d79d1e9fd801665a2fb6657fa318cb9e3bec611029d1b78d8380d9d6') // custom API key gained at https://cyrptocompare.com/api
        .then(res => { // task chaining

            // console.log(JSON.stringify(res)) // CD: debug
            const cryptos = res.data.BTC.USD; // return data
            price.innerHTML = '$' + cryptos.toLocaleString('en');

            // eval if set target value is less than current BTC exchange value
            if (targetPrice.innerHTML !== '' && targetPriceVal < res.data.BTC.USD)
            {
                console.log(targetPriceVal)
                console.log(JSON.stringify(res.data.BTC.USD))
                const appNotification = new window.Notification(notification.title, notification);
            }

        });
}
getBTC();
setInterval(getBTC, 10000); // run every 30s (30000ms)

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

// set target price based on add.js response
ipc.on('targetPriceVal', function(event, arg) { // targetPriceVal is the response event

    targetPriceVal = tryParseInt(arg, 0); // attempt parse
    if (targetPriceVal > 0)
    {
        targetPrice.innerHTML = '$' + targetPriceVal.toLocaleString('en'); // set to the new target price
    }
    else
    {
        arg = arg.replace(/\D/g, '') // regex search for all non-numeric chars
        targetPriceVal = tryParseInt(arg, 0); // attempt parse
        targetPrice.innerHTML = '$' + arg.toLocaleString('en'); // set to the new target price
    }

});

// built similar to C#/Java int.TryParse() method
function tryParseInt(str, defVal)
{
    var retVal = defVal; // default val required
    if (str !== null)
    {
        if (str.length > 0)
        {
            if (!isNaN(str))
            {
                retVal = parseInt(str); // convert to int
            }
        }
    }
    return retVal;
}

