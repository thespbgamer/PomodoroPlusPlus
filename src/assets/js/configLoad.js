const start = async function () {
	const isDarkMode = await window.darkMode.get();
	// console.log(isDarkMode);
	document.getElementById("bodyColor").setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
};

start();
