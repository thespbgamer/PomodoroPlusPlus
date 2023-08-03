//npx tailwindcss -i ./src/assets/css/styles.css -o ./src/assets/css/tailwind.css --watch
require("dotenv").config();
const { app, BrowserWindow, ipcMain, nativeTheme } = require("electron");
const path = require("path");

const isDev = process.env.NODE_ENV == "development";

const filesToCall = {
	"mainPreload.js": "./src/assets/js/globalPreload.js",
	"mainIndex.js": "./src/index.html",
};

function createWindow() {
	const win = new BrowserWindow({
		width: !isDev ? 1280 : 1500,
		height: 720,
		icon: "icon.ico",
		autoHideMenuBar: true,
		center: true,
		webPreferences: {
			preload: path.join(__dirname, filesToCall["mainPreload.js"]),
			nodeIntegration: true,
			devTools: isDev,
		},
	});

	if (isDev) {
		win.webContents.openDevTools();
	}

	win.loadFile(filesToCall["mainIndex.js"]);
}

ipcMain.handle("dark-mode:toggle", () => {
	if (nativeTheme.shouldUseDarkColors) {
		nativeTheme.themeSource = "light";
	} else {
		nativeTheme.themeSource = "dark";
	}
	return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle("dark-mode:get", () => {
	return nativeTheme.shouldUseDarkColors ? "dark" : nativeTheme.shouldUseSystemColors;
});

// ipcMain.handle("dark-mode:system", () => {
// 	nativeTheme.themeSource = "system";
// });

app.whenReady().then(() => {
	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
