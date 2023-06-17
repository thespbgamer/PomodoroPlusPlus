const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("darkMode", {
	toggle: () => ipcRenderer.invoke("dark-mode:toggle"),
	get: () => ipcRenderer.invoke("dark-mode:get"),
	// system: () => ipcRenderer.invoke("dark-mode:system"),
});
