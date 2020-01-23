'use strict';

import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import axios from 'axios';
const isDevelopment = process.env.NODE_ENV !== 'production';

let win: BrowserWindow | null;

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
]);

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installVueDevtools();
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.on(
  'login-data',
  (event: Electron.Event, login: string, password: string) => {
    let hasPassed: boolean;
    const url = 'http://codaloca.go.ro:3000/worker';
    const data: { login: string; password: string } = {
      login,
      password,
    };
    axios.post(url, data).then(response => {
      if (response.data === '') {
        hasPassed = false;
      } else {
        hasPassed = true;
        setTimeout(() => {
          event.sender.send('data', response.data[0]);
        }, 2000);
      }
      event.sender.send('login-passed', hasPassed);
    });
  }
);

ipcMain.on('signup', (event: Electron.Event, signupData: {}) => {
  const url = 'http://codaloca.go.ro:3000/signup';
  let hasPassed: boolean;

  axios
    .post(url, signupData)
    .then(response => {
      if (response.data === '') {
        hasPassed = false;
      } else {
        hasPassed = true;
      }
      event.sender.send('signup-passed', hasPassed);
    })
    .catch(error => {
      console.log(error);
    });
});
