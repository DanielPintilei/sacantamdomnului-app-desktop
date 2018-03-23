'use strict'
const electron = require('electron')
const { autoUpdater } = require('electron-updater')

const { app, BrowserWindow, Menu, ipcMain } = electron

// Adds debug features like hotkeys for triggering dev tools and reload
// require('electron-debug')()

// Prevent window being garbage collected
let mainWindow
let presentWindows = []
let presentWindowsCount = 0

function onClosed() {
  // Dereference the window
  // For multiple windows store them in an array
  mainWindow = null
}

function createMainWindow() {
  const window = new BrowserWindow({
    show: false,
    width: 1000,
    height: 800,
  })
  window.maximize()
  window.loadURL(`file://${__dirname}/html/main.html`)
  window.once('ready-to-show', () => {
    window.show()
  })
  window.on('closed', () => {
    onClosed()
    app.quit()
  })
  return window
}

function createShortcutsWindow() {
  const window = new BrowserWindow({
    parent: mainWindow,
    modal: true,
    show: false,
    width: 550,
    height: 620,
    minimizable: false,
    maximizable: false,
  })
  window.loadURL(`file://${__dirname}/html/shortcuts.html`)
  window.setMenu(null)
  window.once('ready-to-show', () => {
    window.show()
  })
  return window
}

function setStatePresentWindows(state) {
  presentWindows.forEach(({ ref }) => {
    ref.webContents.send('setStanza', state)
  })
}
function closePresentWindows(state) {
  presentWindows.forEach(({ ref }) => {
    ref.close()
  })
}

function createPresentWindow(initialState, id) {
  const window = new BrowserWindow({
    show: false,
    width: 1000,
    height: 800,
    frame: false,
  })
  window.loadURL(`file://${__dirname}/html/present.html`)
  window.setBackgroundColor('#000')
  window.once('ready-to-show', () => {
    setStatePresentWindows(initialState)
    window.show()
  })
  window.on('closed', () => {
    presentWindows = presentWindows.filter(window => window.id !== id)
  })
  return window
}

ipcMain.on('openPresentation', (_, payload) => {
  const id = presentWindowsCount++
  presentWindows.push({
    id,
    ref: createPresentWindow(payload, id),
  })
})
ipcMain.on('setStanza', (_, payload) => {
  setStatePresentWindows(payload)
})
ipcMain.on('closePresentations', closePresentWindows)
ipcMain.on('presentationKeydown', (_, payload) =>
  mainWindow.webContents.send('receivePresentationKeydown', payload),
)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
})

const mainMenuTemplate = [
  {
    label: 'View',
    submenu: [
      { role: 'resetzoom' },
      { role: 'zoomin', accelerator: 'CmdOrCtrl+=' },
      { role: 'zoomout', accelerator: 'CmdOrCtrl+-' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Shortcuts',
        click() {
          createShortcutsWindow()
        },
      },
      {
        label: 'Learn More',
        click() {
          require('electron').shell.openExternal('https://electronjs.org')
        },
      },
    ],
  },
]
if (process.platform === 'darwin') {
  mainMenuTemplate[1].submenu = [
    { role: 'close' },
    { role: 'minimize' },
    { role: 'zoom' },
    { type: 'separator' },
    { role: 'front' },
  ]
}

const sendUpdateStatusToWindow = (text, isDone = false) => {
  mainWindow.webContents.send('updateMessage', { text, isDone })
}

autoUpdater.on('checking-for-update', () => {
  sendUpdateStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', () => {
  sendUpdateStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', () => {
  sendUpdateStatusToWindow(
    'Update not available, you are using the latest version.',
    true,
  )
})
autoUpdater.on('error', err => {
  sendUpdateStatusToWindow(`Error in auto-updater: ${err}`)
})
autoUpdater.on('download-progress', progressObj => {
  const logMessage = `Downloading: ${progressObj.percent}%`
  sendUpdateStatusToWindow(logMessage)
})
autoUpdater.on('update-downloaded', () => {
  sendUpdateStatusToWindow(
    'Update downloaded, it will be installed next time the app is launched.',
    true,
  )
})

app.on('ready', () => {
  mainWindow = createMainWindow()
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
  autoUpdater.checkForUpdatesAndNotify()
})
