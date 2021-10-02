const { app, BrowserWindow, Menu } = require("electron");

// Set platform
process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isLinux = process.platform === "linux" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "ImageCompressor",
    width: 500,
    height: 600,
    icon: "./assets/icon/Icon_256x256.png",
    resizable: isDev ? true : false,
    backgroundColor: "white",
  });
  mainWindow.loadFile(`./app/index.html`);
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About ImageCompressor",
    width: 300,
    height: 300,
    icon: "./assets/icon/Icon_256x256.png",
    resizable: false,
    backgroundColor: "white",
  });
  aboutWindow.loadFile(`./app/about.html`);
}

app.on("ready", () => {
  // Creating browser window
  createMainWindow();

  // Adding main menu in BrowserWindow
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // // Global shortcuts
  // globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload());
  // globalShortcut.register(isMac ? "Command+Alt+I" : "Ctrl+Shift+I", () =>
  //   mainWindow.toggleDevTools()
  // );

  // Garbage Collection
  mainWindow.on("ready", () => (mainWindow = null));
});

// menu
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ label: "About", click: createAboutWindow }],
        },
      ]
    : []),
  { role: "fileMenu" },
  ...(!isMac
    ? [
        {
          label: "Help",
          submenu: [{ label: "About", click: createAboutWindow }],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { role: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
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
