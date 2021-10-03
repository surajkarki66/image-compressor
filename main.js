const path = require("path");
const os = require("os");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const slash = require("slash");
const log = require("electron-log");
const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");

// Set platform
process.env.NODE_ENV = "production";

const isDev = process.env.NODE_ENV !== "production" ? true : false;
const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;
function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "ImageCompressor",
    width: isDev ? 800 : 450,
    height: 600,
    icon: "./assets/icon/Icon_256x256.png",
    resizable: isDev ? true : false,
    backgroundColor: "white",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
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
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  aboutWindow.loadFile(`./app/about.html`);
}

app.on("ready", () => {
  // Creating browser window
  createMainWindow();

  // Adding main menu in BrowserWindow
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Garbage Collection
  mainWindow.on("ready", () => (mainWindow = null));
});

// Menu
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

ipcMain.on("image:minimize", (e, options) => {
  options.dest = path.join(os.homedir(), "imageshrink");
  shrinkImage(options);
});

async function shrinkImage({ imgPath, quality, dest }) {
  try {
    const pngQuality = quality / 100;
    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({ quality: [pngQuality, pngQuality] }),
      ],
    });
    log.info(files);
    // shell.openPath(dest);
    mainWindow.webContents.send("image:done");
  } catch (error) {
    log.error(error);
  }
}
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
