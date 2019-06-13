const electron = require('electron')
const {
  app,
  BrowserWindow,
  ipcMain
} = electron
const mysql = require('mysql')

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'condica'
})

connection.connect(function(err) {
  if (err) throw err
})

let win

app.on('ready', () => {
  win = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      //contextIsolation: true,
      //webSecurity: true,
      nodeIntegration: true
    }
  })
  win.loadFile('login.html')
  win.once('ready-to-show', () => {
    win.show()
  })
  //win.webContents.openDevTools()
})

app.on('closed', () => {
  win = null
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    connection.end()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('login-data', (event, id, pass) => {
  connection.query('SELECT * from angajati WHERE id_angajati = ' + mysql.escape(id), function(err, result) {
    if (err) throw err
    if (result[0] != null) {
      if (result[0].pass_angajati == pass) {
        event.sender.send('login-result', true)
        ipcMain.on('user', (event, arg) => {
          arg = result[0]
          event.sender.send('user-data', arg)
        })

      } else event.sender.send('login-result', false)
    } else event.sender.send('login-result', false)
  })
})

ipcMain.on('login-passed', () => {
  win.loadFile('index.html')
})

ipcMain.on('quit-app', () => {
  app.quit()
  connection.end()
})

ipcMain.on('logout-app', () => {
  win.show = false
  win.loadFile('login.html')
  win.once('ready-to-show', () => {
    win.show()
  })
})
