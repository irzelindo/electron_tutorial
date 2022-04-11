// Module function to create main app menu

const { Menu, shell } = require('electron');

module.exports = appWin => {

    // Menu template

    let template = [
        {
            label: 'Items',
            submenu: [
                {
                    label: 'Add New',
                    accelerator: 'CmdOrCtrl+o',
                    click: async () => {
                        await appWin.send('menu-show-modal')
                    }
                },
                {
                    label: 'Read Item',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: async () => {
                        await appWin.send('menu-read-item')
                    }
                },
                {
                    label: 'Delete Item',
                    accelerator: 'CmdOrCtrl+Backspace',
                    click: async () => {
                        await appWin.send('menu-delete-item')
                    }
                },
                {
                    label: 'Open in Browser',
                    accelerator: 'CmdOrCtrl+Shift+Enter',
                    click: async () => {
                        await appWin.send('menu-open-item-native')
                    }
                },
                {
                    label: 'Search Items',
                    accelerator: 'CmdOrCtrl+s',
                    click: async () => {
                        await appWin.send('menu-focus-search')
                    }
                }
            ]
        },
        {
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        await shell.openExternal('https://electronjs.org')
                    }
                }
            ]
        }
    ];

        // Set as main app menu
        if (process.platform === 'darwin') template.unshift({role: 'appMenu'})

    // Build menu
    let menu = Menu.buildFromTemplate(template);

    // Set as main app menu
    Menu.setApplicationMenu(menu);

}