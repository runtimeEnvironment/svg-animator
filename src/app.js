const electron = require('electron'),
    { appMenu } = require('./services/menuTemplate'),
    {app, BrowserWindow} = electron;

let mainWindow;

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    appMenu(mainWindow);

    mainWindow.on('close', _ => {
        console.log('closed');
    })
});