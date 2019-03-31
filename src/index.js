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
// currency values (default to US)
var currDisplay = document.getElementById('curr-display');
var currency = 'USD';
var currSymbol = '$';
var prevCurr = 'USD';
// high / low / pct vars
var highPrice = document.getElementById('high-price');
var lowPrice = document.getElementById('low-price');
var pctPrice = document.getElementById('pct-price');

// notification settings
const notification = {
    title: 'BTC ALERT',
    body: 'BTC VALUE EXCEEDS SET TARGET PRICE',
    icon: path.join(__dirname, '../assets/images/btc.png')
}

// Axios HTTP library
// terminal > npm install axios --save
function getBTC() {

    // CryptoCompare API // dynamic based on selected currency (USD || EUR)
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms='+currency+'&api_key=adbe9819d79d1e9fd801665a2fb6657fa318cb9e3bec611029d1b78d8380d9d6') // custom API key gained at https://cyrptocompare.com/api
        .then(res => { // task chaining

            // console.log(JSON.stringify(res)) // CD: debug
            const cryptos = (currency == 'USD') ? res.data.BTC.USD : res.data.BTC.EUR; // return data in selected currency

            // set the display props
            currDisplay.innerHTML = 'CURRENT BTC ('+currency+')';
            price.innerHTML = currSymbol + cryptos.toLocaleString('en');

            // eval if set target value is less than current BTC exchange value
            if (targetPrice.innerHTML !== '' && targetPriceVal < res.data.BTC.USD)
            {
                // NOTE: notifications currently do not work for Win10
                const appNotification = new window.Notification(notification.title, notification);
            }

            getHighLowPct(); // run in sequence

        });
}

function getHighLowPct() {

        // CryptoCompare API for Kraken AVG stats // dynmaic based on selected currency (USD || EUR)
        axios.get('https://min-api.cryptocompare.com/data/generateAvg?fsym=BTC&tsym='+currency+'&e=Kraken&api_key=adbe9819d79d1e9fd801665a2fb6657fa318cb9e3bec611029d1b78d8380d9d6')
        .then(res => { // task chaining

            // console.log(JSON.stringify(res.data)) // CD: debug

            // capture retvals
            var high = res.data.DISPLAY.HIGH24HOUR;
            var low = res.data.DISPLAY.LOW24HOUR;
            var pct = res.data.DISPLAY.CHANGEPCT24HOUR;
            // console.log('debug' +high+ '-' +low+ '-' +pct) // CD: debug

            // set the display props
            highPrice.innerHTML = high.toLocaleString('en');
            lowPrice.innerHTML = low.toLocaleString('en');
            pctPrice.innerHTML = pct.toLocaleString('en');

        });
}
getBTC(); // runs getHighLowPct() in sequence
setInterval(getBTC, 30000); // run every 30s (30000ms)

// notify button event logic
notifyBtn.addEventListener('click', function(event) {

    buildAddWindow(); // moved logic for window creation to its own function (scalable)

});

// migrated logic from the notifyBtn.AddEventListener(). scalable for ipc from main process
function buildAddWindow() {

    const modalPath = path.join('file://', __dirname, 'add.html'); // retrieve path html
    let win = new BrowserWindow( // create window object
        { 
            frame:false, // remove toolbar menu
            transparent:true, // corresponds to add.css html, body
            alwaysOnTop:true, 
            width:400, 
            height:200 
        });
    win.webContents.on('did-finish-load', () => { // emitted after onload event has dispatched
        win.webContents.send('currencyVal', currency, currSymbol);
    })
    win.on('close', function() { win = null; });
    win.loadURL(modalPath); // load add.html as window
    win.show();

}

// UNUSED CODE?
//ipc.on('currVal', function(event, curr) {
//
//    currency = curr;
//    setCurrSymbol(curr);
//
//});

// set target price based on add.js response
ipc.on('targetPriceVal', function(event, arg, curr) { // targetPriceVal is the response event

    currency = curr; // global var
    targetPriceVal = tryParseInt(arg, 0); // attempt parse
    if (targetPriceVal > 0)
    {
        setCurrSymbol(curr);
        targetPrice.innerHTML = currSymbol + targetPriceVal.toLocaleString('en'); // set to the new target price && currency
    }
    else
    {
        arg = arg.replace(/\D/g, '') // regex search for all non-numeric chars
        targetPriceVal = tryParseInt(arg, 0); // attempt parse

        setCurrSymbol(curr);
        targetPrice.innerHTML = currSymbol + arg.toLocaleString('en'); // set to the new target price && currency
    }

    // reload if currency value changed
    if (prevCurr !== curr) { getBTC(); prevCurr = curr; /* global var */  }

});

// receive current selected currency from main.js
ipc.on('update-curr', function(event, updCurr) {

    if(currency != updCurr) { targetPrice.innerHTML = "CHOOSE TARGET PRICE"; } // reset displayed target value if currency changed
    currency = updCurr
    setCurrSymbol(currency);
    getBTC();

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

// parse the correct symbol for the currency value selected
function setCurrSymbol(curr)
{
    if (curr == 'USD') { currSymbol = '$' }
    if (curr == 'EUR') { currSymbol = '€' }
}

