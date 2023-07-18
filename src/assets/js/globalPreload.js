const { contextBridge, ipcRenderer } = require("electron");
const Toastify = require("toastify-js");
var ProgressBar = require("progressbar.js");

contextBridge.exposeInMainWorld("darkMode", {
	toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
	get: () => ipcRenderer.invoke("dark-mode:get"),
	// system: () => ipcRenderer.invoke("dark-mode:system"),
});

contextBridge.exposeInMainWorld("Toastify", {
	toast: (options) => Toastify(options).showToast(),
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
