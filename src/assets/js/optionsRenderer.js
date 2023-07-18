document.getElementById("toggle-dark-mode").addEventListener("click", async () => {
	const isDarkMode = await window.darkMode.toggle();
	// console.log(isDarkMode);

	document.getElementById("bodyColor").setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
});

document.getElementById("save-options").addEventListener("click", async () => {
	console.log("save-options clicked");

	//save in local storage the values of the options
	let timeForPomodoroWorkingSession = document.getElementById("timeForPomodoroWorkingSession").value;
	let timeForPomodoroRestingSession = document.getElementById("timeForPomodoroRestingSession").value;
	let numberOfSessionsValue = document.getElementById("numberOfSessionsValue").value;

	if (parseInt(numberOfSessionsValue == null || numberOfSessionsValue) < 1) {
		numberOfSessionsValue = 1;
	}

	localStorage.setItem("timeForPomodoroWorkingSession", timeForPomodoroWorkingSession);
	localStorage.setItem("timeForPomodoroRestingSession", timeForPomodoroRestingSession);
	localStorage.setItem("numberOfSessionsValue", numberOfSessionsValue);
});

//onpageload
window.addEventListener("load", async () => {
	//console.log("onpageload");
	//get the values from local storage
	let timeForPomodoroWorkingSession = localStorage.getItem("timeForPomodoroWorkingSession");
	let timeForPomodoroRestingSession = localStorage.getItem("timeForPomodoroRestingSession");
	let numberOfSessionsValue = localStorage.getItem("numberOfSessionsValue");

	if (numberOfSessionsValue == null || parseInt(numberOfSessionsValue) < 1) {
		numberOfSessionsValue = 1;
	}
	console.log(numberOfSessionsValue);

	//set the values from local storage
	document.getElementById("timeForPomodoroWorkingSession").value = timeForPomodoroWorkingSession;
	document.getElementById("timeForPomodoroRestingSession").value = timeForPomodoroRestingSession;
	document.getElementById("numberOfSessionsValue").value = numberOfSessionsValue;

	convertTimerValues("timeForPomodoroWorkingSession", "timeToWorkConverted");
	convertTimerValues("timeForPomodoroRestingSession", "timeToRestConverted");
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

// document.getElementById("reset-to-system").addEventListener("click", async () => {
// 	document.getElementById("bodyColor").setAttribute("data-bs-theme", "dark");
// });

//everytime you change the values on the timeForPomodoroWorkingSession
document.getElementById("timeForPomodoroWorkingSession").addEventListener("input", async () => {
	convertTimerValues("timeForPomodoroWorkingSession", "timeToWorkConverted");
});

document.getElementById("timeForPomodoroRestingSession").addEventListener("input", async () => {
	convertTimerValues("timeForPomodoroRestingSession", "timeToRestConverted");
});

document.getElementById("numberOfSessionsValue").addEventListener("input", async () => {
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

function convertTimerValues(originalID, convertedID) {
	let timeForPomodoroWorkingSession = document.getElementById(originalID).value;
	// console.log(timeForPomodoroWorkingSession);

	if (timeForPomodoroWorkingSession == "") {
		document.getElementById(convertedID).innerHTML = "N/A";
		return;
	} else if (convertedID == "finalTimeConverted") {
		timeForPomodoroWorkingSession =
			(parseInt(document.getElementById("timeForPomodoroWorkingSession").value) +
				parseInt(document.getElementById("timeForPomodoroRestingSession").value)) *
			parseInt(document.getElementById("numberOfSessionsValue").value);
		// console.log(timeForPomodoroWorkingSession);
	}

	//get hours
	let hoursLeft = Math.floor(timeForPomodoroWorkingSession / 3600);

	//get minutes
	let minutesLeft = Math.floor(timeForPomodoroWorkingSession / 60) % 60;

	//get remaining seconds
	let secondsLeft = timeForPomodoroWorkingSession % 60;

	let timeForPomodoroWorkingSessionConvertedInnerHTML = "";

	let isFirst = true;

	//if hours is greater than 1
	if (hoursLeft > 1) {
		timeForPomodoroWorkingSessionConvertedInnerHTML += hoursLeft + " hours ";
		isFirst = false;
	}
	if (hoursLeft == 1) {
		timeForPomodoroWorkingSessionConvertedInnerHTML += hoursLeft + " hour ";
		isFirst = false;
	}
	if (minutesLeft > 1) {
		if (!isFirst) {
			timeForPomodoroWorkingSessionConvertedInnerHTML += " and ";
		}

		timeForPomodoroWorkingSessionConvertedInnerHTML += minutesLeft + " mins ";
	}
	if (minutesLeft == 1) {
		if (!isFirst) {
			timeForPomodoroWorkingSessionConvertedInnerHTML += " and ";
		}

		timeForPomodoroWorkingSessionConvertedInnerHTML += minutesLeft + " min ";
	}
	if (secondsLeft > 1) {
		if (!isFirst) {
			timeForPomodoroWorkingSessionConvertedInnerHTML += " and ";
		}

		timeForPomodoroWorkingSessionConvertedInnerHTML += secondsLeft + " secs ";
	}
	if (secondsLeft == 1) {
		if (!isFirst) {
			timeForPomodoroWorkingSessionConvertedInnerHTML += " and ";
		}

		timeForPomodoroWorkingSessionConvertedInnerHTML += secondsLeft + " sec ";
	}

	document.getElementById(convertedID).innerHTML = timeForPomodoroWorkingSessionConvertedInnerHTML;
}
