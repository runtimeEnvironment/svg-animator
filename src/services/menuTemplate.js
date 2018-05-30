
const electron = require('electron'),
    { Menu, ipcMain: ipc, dialog } = electron;

const name = electron.app.getName();
let window;

exports.appMenu = (win) => {
    window = win;
    const template = [
        {
            label: name,
            submenu: [
                {
                    label: `About ${name}`,
                    click: about
                }
            ]
        },
        {
            label: 'File',
            submenu: [
                {
                    label: 'Open',
                    click: open,
                    accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O'
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {role: 'reload'},
                {role: 'forcereload'},
                {role: 'toggledevtools'},
                {type: 'separator'},
                {role: 'resetzoom'},
                {role: 'zoomin'},
                {role: 'zoomout'},
                {type: 'separator'},
                {role: 'togglefullscreen'}
            ]
        },
    ];


   const menu = Menu.buildFromTemplate(template);
   Menu.setApplicationMenu(menu);
};

const about = () => {
    console.log('Hello there');
};

const open = () => {
    dialog.showOpenDialog({
        filters: [
            {
                name: 'Images',
                extensions: ['svg']
            }
        ],
        properties: ['openFile']
    }, function (paths) {
        if (paths !== undefined) {
            console.log(window);
            window.webContents.send('open', paths[0]);
        }
    });
};