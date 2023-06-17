document.getElementById("toggle-dark-mode").addEventListener("click", async () => {
	const isDarkMode = await window.darkMode.toggle();
	// console.log(isDarkMode);
	document.getElementById("bodyColor").setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
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

function convertTimerValues(originalID, convertedID) {
	const timeForPomodoroWorkingSession = document.getElementById(originalID).value;

	if (timeForPomodoroWorkingSession == "") {
		document.getElementById(convertedID).innerHTML = "N/A";
		return;
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
