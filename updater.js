// Electron-Updater
const { autoUpdater } = require('electron-updater');

// Configuring log debugging
autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

// Single export to check for and apply any available updates
module.exports = () => {
    // Check for updates
    autoUpdater.checkForUpdates()
}