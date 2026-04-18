const { app, BrowserWindow, ipcMain, screen, globalShortcut } = require('electron');
const path = require('path');

let win;

function toggleVisibility() {
  if (!win) return;
  if (win.isVisible()) {
    win.hide();
  } else {
    win.show();
    win.setAlwaysOnTop(true, 'screen-saver');
  }
}

function createWindow() {
  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize;
  const w = 720;
  const h = 480;

  win = new BrowserWindow({
    width: w,
    height: h,
    x: Math.round((sw - w) / 2),
    y: Math.round(sh * 0.15),
    minWidth: 320,
    minHeight: 200,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    resizable: true,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    title: 'Telepromptr',
    type: process.platform === 'darwin' ? 'panel' : undefined,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Hide from screen capture (Loom, QuickTime, OBS, etc.)
  // On macOS this sets NSWindowSharingNone.
  win.setContentProtection(true);

  // Float above everything, including fullscreen apps.
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  win.loadFile('index.html');

  win.on('closed', () => {
    win = null;
  });
}

app.whenReady().then(() => {
  // Hide from the Dock on macOS so the icon doesn't show during recording.
  if (process.platform === 'darwin' && app.dock) {
    app.dock.hide();
  }
  createWindow();

  // Global shortcut to toggle visibility, since the app is hidden from the Dock.
  globalShortcut.register('CommandOrControl+Shift+T', toggleVisibility);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    else if (win && !win.isVisible()) win.show();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.handle('win:close', () => {
  if (win) win.close();
});

ipcMain.handle('win:minimize', () => {
  if (win) win.hide();
});

ipcMain.handle('win:hide', () => {
  if (win) win.hide();
});

ipcMain.handle('win:toggle-click-through', (_e, ignore) => {
  if (!win) return;
  win.setIgnoreMouseEvents(!!ignore, { forward: true });
});
