const { app, BrowserWindow, Menu } = require("electron");

// Set platform
process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isLinux = process.platform === "linux" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "ImageCompressor",
    width: 500,
    height: 600,
    icon: "./assets/icon/Icon_256x256.png",
    resizable: isDev ? true : false,
  });
  mainWindow.loadFile(`./app/index.html`);
  mainWindow.webContents.openDevTools();
}

app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.on("ready", () => (mainWindow = null));
});

// menu
const menu = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => app.quit(),
      },
    ],
  },
];

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
