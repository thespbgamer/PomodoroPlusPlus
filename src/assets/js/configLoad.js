const start = async function () {
	const isDarkMode = await window.darkMode.get();
	document.getElementById("bodyColor").setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
};

start();
