// Electron-Updater
const { dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

// Configuring log debugging
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

// Disable auto download of updates
autoUpdater.autoDownload = false;

// Single export to check for and apply any available updates
module.exports = () => {
    // Check for updates
    autoUpdater.checkForUpdates()

    // Add event to listen for updates
    autoUpdater.on('update-available', () => {

        // Prompt user to start download

        dialog.showMessageBox({
            type: 'info',
            title: 'Update Available',
            message: "A new version of Readit is available. Do you want to update now?",
            buttons: ['update', 'No']
        }).then( result => {
            let buttonIndex = result.response

            // If the button response is 0 (update button) start downloading the update
            if(buttonIndex === 0){
                autoUpdater.downloadUpdate();
            }

        })


    })

    // Listen for the download being ready or donwloaded
    autoUpdater.on('update-downloaded', () => {
        // Prompt the user to install update
        dialog.showMessageBox({
            type: 'info',
            title: 'Update Ready',
            message: 'Install & Restart',
            buttons: ['Yes', 'Later']
        }).then( result => {
            let buttonIndex = result.response

            // If the button response is 0 (update button) install and restart
            if(buttonIndex === 0){
                autoUpdater.quitAndInstall(false, true);
            }

        })

    });
}