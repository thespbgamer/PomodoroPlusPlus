//npx tailwindcss -i ./src/assets/css/styles.css -o ./src/assets/css/tailwind.css --watch
require("dotenv").config();
const { app, BrowserWindow, ipcMain, nativeTheme, Tray, Menu } = require("electron");
const path = require("path");
let tray = null;

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

	win.on("minimize", function (event) {
		event.preventDefault();
		win.hide();
	});

	win.on("close", function (event) {
		if (!app.isQuiting) {
			event.preventDefault();
			win.hide();
		}
	});

	if (isDev) {
		win.webContents.openDevTools();
	}

	win.loadFile(filesToCall["mainIndex.js"]);

	tray = new Tray("icon.ico");
	const contextMenu = Menu.buildFromTemplate([
		{
			label: "Show",
			click: () => {
				win.show();
			},
		},
		{
			label: "Quit",
			click: () => {
				app.isQuiting = true;
				app.quit();
				functionQuit();
			},
		},
	]);
	tray.setToolTip("Pomodoro++");
	tray.setContextMenu(contextMenu);
	tray.addListener("double-click", function () {
		if (!win.isVisible()) {
			win.show();
		}
	});
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

app.on("window-all-closed", () => {});

function functionQuit() {
	if (process.platform !== "darwin") {
		app.quit();
	}
}
