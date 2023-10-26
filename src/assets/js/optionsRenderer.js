let audioAfterWorkFile = null;
let audioAfterRestFile = null;
let audioCountDownFile = null;
let audioFinishFile = null;
let notificationCount;

document.addEventListener("keypress", function (e) {
	if (e.key === "Enter") {
		e.preventDefault();
		return false;
	}
});

document.getElementById("toggle-dark-mode").addEventListener("click", () => {
	const isDarkMode = window.darkMode.toggle();
	document.getElementById("bodyColor").setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
});

document.getElementById("audioAfterWorkFile").addEventListener("change", () => {
	audioAfterWorkFile = document.getElementById("audioAfterWorkFile").files[0];
});

document.getElementById("audioAfterRestFile").addEventListener("change", () => {
	audioAfterRestFile = document.getElementById("audioAfterRestFile").files[0];
});

document.getElementById("audioCountDownFile").addEventListener("change", () => {
	audioCountDownFile = document.getElementById("audioCountDownFile").files[0];
});

document.getElementById("audioFinishFile").addEventListener("change", () => {
	audioFinishFile = document.getElementById("audioFinishFile").files[0];
});

document.getElementById("reset-audio-after-work").addEventListener("click", () => {
	window.files.copy(null, null, localStorage.getItem("audioWorkPath"));
	localStorage.removeItem("audioWorkPath");
	audioAfterWorkFile = null;
	document.getElementById("audioAfterWorkFile").value = null;

	showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Audio after work reset.", 3000, "blue");
});

document.getElementById("reset-audio-after-rest").addEventListener("click", () => {
	window.files.copy(null, null, localStorage.getItem("audioRestPath"));
	localStorage.removeItem("audioRestPath");
	audioAfterRestFile = null;
	document.getElementById("audioAfterRestFile").value = null;
	showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Audio after rest reset.", 3000, "blue");
});

document.getElementById("reset-audio-countdown").addEventListener("click", () => {
	window.files.copy(null, null, localStorage.getItem("audioCountdownPath"));
	localStorage.removeItem("audioCountdownPath");
	audioCountDownFile = null;
	document.getElementById("audioCountDownFile").value = null;
	showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Audio countdown reset.", 3000, "blue");
});

document.getElementById("reset-audio-finish").addEventListener("click", () => {
	window.files.copy(null, null, localStorage.getItem("audioFinishPath"));
	localStorage.removeItem("audioFinishPath");
	audioFinishFile = null;
	document.getElementById("audioFinishFile").value = null;
	showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Audio finish reset.", 3000, "blue");
});

document.getElementById("save-options").addEventListener("click", () => {
	try {
		let timeForPomodoroWorkingSession = document.getElementById("timeForPomodoroWorkingSession").value;
		let timeForPomodoroRestingSession = document.getElementById("timeForPomodoroRestingSession").value;
		let numberOfSessionsValue = document.getElementById("numberOfSessionsValue").value;
		let audioLevelValue = document.getElementById("audioLevelValue").value;
		// if (parseInt(numberOfSessionsValue == null || numberOfSessionsValue) < 1) {
		// 	numberOfSessionsValue = 1;
		// }

		if (
			timeForPomodoroWorkingSession == "" ||
			timeForPomodoroWorkingSession <= 0 ||
			timeForPomodoroWorkingSession > 86400 ||
			timeForPomodoroRestingSession == "" ||
			timeForPomodoroRestingSession <= 0 ||
			timeForPomodoroRestingSession > 86400 ||
			numberOfSessionsValue == "" ||
			numberOfSessionsValue <= 0 ||
			numberOfSessionsValue > 100 ||
			audioLevelValue == "" ||
			audioLevelValue < 0 ||
			audioLevelValue > 100
		) {
			return;
		}

		localStorage.setItem("timeForPomodoroWorkingSession", timeForPomodoroWorkingSession);
		localStorage.setItem("timeForPomodoroRestingSession", timeForPomodoroRestingSession);
		localStorage.setItem("numberOfSessionsValue", numberOfSessionsValue);
		localStorage.setItem("audioLevelValue", audioLevelValue / 100);

		if (audioAfterWorkFile != null && audioAfterWorkFile != undefined) {
			let finalDestination = window.files.copy(audioAfterWorkFile.path, null, localStorage.getItem("audioWorkPath"));
			localStorage.setItem("audioWorkPath", finalDestination);
		}

		if (audioAfterRestFile != null && audioAfterRestFile != undefined) {
			let finalDestination = window.files.copy(audioAfterRestFile.path, null, localStorage.getItem("audioRestPath"));
			localStorage.setItem("audioRestPath", finalDestination);
		}

		if (audioCountDownFile != null && audioCountDownFile != undefined) {
			let finalDestination = window.files.copy(
				audioCountDownFile.path,
				null,
				localStorage.getItem("audioCountdownPath")
			);
			localStorage.setItem("audioCountdownPath", finalDestination);
		}

		if (audioFinishFile != null && audioFinishFile != undefined) {
			let finalDestination = window.files.copy(audioFinishFile.path, null, localStorage.getItem("audioFinishPath"));
			localStorage.setItem("audioFinishPath", finalDestination);
		}

		showAlertAndDismiss("alert-green-div", "alert-green-text", "Options Saved!", 3000, "green");
	} catch (err) {
		//console.log(err);
		showAlertAndDismiss("alert-red-div", "alert-red-text", err, 3000, "red");
	}
});

window.addEventListener("load", () => {
	notificationCount = 0;
	let timeForPomodoroWorkingSession = localStorage.getItem("timeForPomodoroWorkingSession");
	let timeForPomodoroRestingSession = localStorage.getItem("timeForPomodoroRestingSession");
	let numberOfSessionsValue = localStorage.getItem("numberOfSessionsValue");
	let audioLevelValue = localStorage.getItem("audioLevelValue");

	if (numberOfSessionsValue == null || parseInt(numberOfSessionsValue) < 1) {
		numberOfSessionsValue = 3;
		showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Confirm the options and click save.", 3000, "purple");
	}

	if (audioLevelValue == null || parseInt(audioLevelValue) < 0 || parseInt(audioLevelValue) > 1) {
		audioLevelValue = 1;
	}

	if (timeForPomodoroWorkingSession == null) {
		timeForPomodoroWorkingSession = 1500;
	}

	if (timeForPomodoroRestingSession == null) {
		timeForPomodoroRestingSession = 900;
	}

	document.getElementById("timeForPomodoroWorkingSession").value = timeForPomodoroWorkingSession;
	document.getElementById("timeForPomodoroRestingSession").value = timeForPomodoroRestingSession;
	document.getElementById("numberOfSessionsValue").value = numberOfSessionsValue;
	document.getElementById("audioLevelValue").value = audioLevelValue * 100;

	convertTimerValues("timeForPomodoroWorkingSession", "timeToWorkConverted");
	convertTimerValues("timeForPomodoroRestingSession", "timeToRestConverted");
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

document.getElementById("timeForPomodoroWorkingSession").addEventListener("input", () => {
	convertTimerValues("timeForPomodoroWorkingSession", "timeToWorkConverted");
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

document.getElementById("timeForPomodoroRestingSession").addEventListener("input", () => {
	convertTimerValues("timeForPomodoroRestingSession", "timeToRestConverted");
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

document.getElementById("numberOfSessionsValue").addEventListener("input", () => {
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

document.getElementById("play-audio-after-work").addEventListener("click", () => {
	playAudio("Done", "Work", audioAfterWorkFile?.path);
});

document.getElementById("play-audio-after-rest").addEventListener("click", () => {
	playAudio("Done", "Rest", audioAfterRestFile?.path);
});
document.getElementById("play-audio-countdown").addEventListener("click", () => {
	playAudio("Countdown", null, audioCountDownFile?.path);
});

document.getElementById("play-audio-finish").addEventListener("click", () => {
	playAudio("Finish", null, audioFinishFile?.path);
});

function convertTimerValues(originalID, convertedID) {
	let timeForPomodoroWorkingSession = document.getElementById(originalID).value;

	if (timeForPomodoroWorkingSession == "") {
		document.getElementById(convertedID).innerHTML = "N/A";
		return;
	} else if (convertedID == "finalTimeConverted") {
		timeForPomodoroWorkingSession =
			(parseInt(document.getElementById("timeForPomodoroWorkingSession").value) +
				parseInt(document.getElementById("timeForPomodoroRestingSession").value)) *
			parseInt(document.getElementById("numberOfSessionsValue").value);
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

let currentAudio;

function playAudio(currentAudioToPlay, currentActivity = "", audioOverwrite = null) {
	if (currentAudio != null && currentAudio != undefined) {
		currentAudio.pause();
	}

	const audioName = !currentActivity ? currentAudioToPlay : currentActivity;

	const audioPath = "audio" + audioName + "Path";
	// console.log(audioPath);

	if (audioOverwrite) {
		currentAudio = new Audio(audioOverwrite);
	} else if (localStorage.getItem(audioPath) != null) {
		currentAudio = new Audio(localStorage.getItem(audioPath));
	} else if (currentAudioToPlay == "Done") {
		currentAudio = new Audio("assets/audio/" + currentActivity + ".wav");
	} else {
		currentAudio = new Audio("assets/audio/" + currentAudioToPlay + ".wav");
	}

	//audio level set to 100%
	currentAudio.volume = localStorage.getItem("audioLevelValue") || 1;
	currentAudio.play();
}

function showAlertAndDismiss(alertDivID, alertTextID, alertText, alertDismissTimeInMS = 3000, color = "blue") {
	let notificationArea = document.getElementById("notificationArea");

	if (notificationArea.innerHTML.length <= 0) {
		notificationCount = 0;
	}
	notificationCount += 1;

	let currentDivID = alertDivID + notificationCount;
	let currentTextID = alertTextID + notificationCount;

	let currentDismiss = alertDismissTimeInMS * /* notificationCount */ 1;

	let innerHTMLForDiv =
		`<div
			id="` +
		currentDivID +
		`"
		class="unselectable opacity-0 duration-200 ease-out transition transform fixed bottom-0 right-2 flex items-center p-4 z-100 mb-24 text-` +
		color +
		`-800 rounded-lg bg-` +
		color +
		`-50 dark:bg-` +
		color +
		`-950 dark:text-` +
		color +
		`-400"
		role="alert">
		<i class="bi bi-info-circle-fill"></i>
		<span class="sr-only">Info</span>
		<div id="` +
		currentTextID +
		`" class="ml-1 text-sm font-medium">
			</div>
		</div>`;

	notificationArea.innerHTML = innerHTMLForDiv;

	setTimeout(() => {
		if (document.getElementById(currentDivID) != null) {
			document.getElementById(currentDivID).classList.remove("opacity-0");
			document.getElementById(currentTextID).innerHTML = alertText;

			setTimeout(() => {
				if (document.getElementById(currentDivID) != null) {
					document.getElementById(currentDivID).classList.add("opacity-0");
					setTimeout(() => {
						if (document.getElementById(currentDivID) != null) {
							document.getElementById(currentDivID).remove();
						}
					}, 250);
				}
			}, currentDismiss);
		}
	}, 50);
}
