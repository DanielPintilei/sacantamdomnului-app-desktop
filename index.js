'use strict'
const electron = require('electron')

const { app, BrowserWindow, Menu, ipcMain } = electron

// Adds debug features like hotkeys for triggering dev tools and reload
if (process.env.NODE_ENV !== 'production') require('electron-debug')()

// Prevent window being garbage collected
let mainWindow
let presentWindows = []
let presentWindowsId = 0

function onClosed() {
  // Dereference the window
  // For multiple windows store them in an array
  mainWindow = null
}

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1000,
    height: 800,
  })
  window.maximize()
  window.loadURL(`file://${__dirname}/main.html`)
  window.on('closed', () => {
    onClosed()
    app.quit()
  })
  return window
}

function setStatePresentWindows(state) {
  presentWindows.forEach(({ ref }) => {
    ref.webContents.send('setStanza', state)
  })
}

function createPresentWindow(initialState, id) {
  const window = new BrowserWindow({
    show: false,
    width: 1000,
    height: 800,
    frame: false,
  })
  window.loadURL(`file://${__dirname}/present.html`)
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
  const id = presentWindowsId++
  presentWindows.push({
    id,
    ref: createPresentWindow(payload, id),
  })
})
ipcMain.on('setStanza', (_, payload) => {
  setStatePresentWindows(payload)
})

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
      { role: 'zoomin' },
      { role: 'zoomout' },
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

app.on('ready', () => {
  mainWindow = createMainWindow()
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu)
})
