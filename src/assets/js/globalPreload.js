const { contextBridge, ipcRenderer } = require("electron");
var ProgressBar = require("progressbar.js");
const fs = require("fs");
const path = require("path");

contextBridge.exposeInMainWorld("darkMode", {
	toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
	get: () => ipcRenderer.invoke("dark-mode:get"),
	// system: () => ipcRenderer.invoke("dark-mode:system"),
});

contextBridge.exposeInMainWorld("progressBar", {
	line: (id, duration, animationType) => new ProgressBar.Line(id, { duration: duration }).animate(animationType),
	circle: (id, color, strokeWidth, duration, contentWidth, animationType) =>
		new ProgressBar.Circle(id, {
			color: color,
			strokeWidth: strokeWidth,
			duration: duration,
			svgStyle: {
				// Important: make sure that your container has same
				// aspect ratio as the SVG canvas. See SVG canvas sizes above.
				width: contentWidth,
			},
		}).animate(animationType),
});

//copy file
contextBridge.exposeInMainWorld("files", {
	copy: (source, fileOutputName, fileToDelete) => {
		if (fs.existsSync(fileToDelete)) {
			fs.unlinkSync(fileToDelete);
		}

		if (!fs.existsSync(source)) {
			return;
		}

		if (fileOutputName == null || fileOutputName == undefined) {
			fileOutputName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		}

		let sourceExtension = path.extname(source);
		//appdata path
		// console.log(process.env.APPDATA);
		let fileFinalLocation = process.env.APPDATA + "\\PomodoroPlusPlus\\Data\\" + fileOutputName + sourceExtension;

		//create folder if not exists
		if (!fs.existsSync(process.env.APPDATA + "\\PomodoroPlusPlus")) {
			fs.mkdirSync(process.env.APPDATA + "\\PomodoroPlusPlus");
		}
		if (!fs.existsSync(process.env.APPDATA + "\\PomodoroPlusPlus\\Data")) {
			fs.mkdirSync(process.env.APPDATA + "\\PomodoroPlusPlus\\Data");
		}

		fs.copyFileSync(source, fileFinalLocation);

		return fileFinalLocation;
	},
	doesExist: (filename) => {
		return fs.existsSync(process.env.APPDATA + "\\PomodoroPlusPlus\\Data\\" + filename);
	},
});
