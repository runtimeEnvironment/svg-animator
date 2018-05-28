const electron = require('electron'),
    {app, BrowserWindow} = electron;

let mainWindow;

app.on('ready', _ => {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 720
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);

    mainWindow.on('close', _ => {
        console.log('closed');
    })
});