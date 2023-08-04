let audioAfterWorkFile = null;
let audioAfterRestFile = null;
let audioCountDownFile = null;
let audioFinishFile = null;
let notificationCount;

document.getElementById("toggle-dark-mode").addEventListener("click", async () => {
	const isDarkMode = await window.darkMode.toggle();
	document.getElementById("bodyColor").setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
});

document.getElementById("audioAfterWorkFile").addEventListener("change", async () => {
	audioAfterWorkFile = document.getElementById("audioAfterWorkFile").files[0];
});

document.getElementById("audioAfterRestFile").addEventListener("change", async () => {
	audioAfterRestFile = document.getElementById("audioAfterRestFile").files[0];
});

document.getElementById("audioCountDownFile").addEventListener("change", async () => {
	audioCountDownFile = document.getElementById("audioCountDownFile").files[0];
});

document.getElementById("audioFinishFile").addEventListener("change", async () => {
	audioFinishFile = document.getElementById("audioFinishFile").files[0];
});

document.getElementById("reset-audio-after-work").addEventListener("click", async () => {
	window.files.copy(null, null, localStorage.getItem("audioAfterWorkFilePath"));
	localStorage.removeItem("audioAfterWorkFilePath");
	audioAfterWorkFile = null;
	document.getElementById("audioAfterWorkFile").value = null;

	showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Audio after work reset.", 3000, "blue");
});

document.getElementById("reset-audio-after-rest").addEventListener("click", async () => {
	window.files.copy(null, null, localStorage.getItem("audioAfterRestFilePath"));
	localStorage.removeItem("audioAfterRestFilePath");
	audioAfterRestFile = null;
	document.getElementById("audioAfterRestFile").value = null;
	showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Audio after rest reset.", 3000, "blue");
});

document.getElementById("reset-audio-countdown").addEventListener("click", async () => {
	window.files.copy(null, null, localStorage.getItem("audioCountdownPath"));
	localStorage.removeItem("audioCountdownPath");
	audioCountDownFile = null;
	document.getElementById("audioCountDownFile").value = null;
	showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Audio countdown reset.", 3000, "blue");
});

document.getElementById("reset-audio-finish").addEventListener("click", async () => {
	window.files.copy(null, null, localStorage.getItem("audioFinishPath"));
	localStorage.removeItem("audioFinishPath");
	audioFinishFile = null;
	document.getElementById("audioFinishFile").value = null;
	showAlertAndDismiss("alert-blue-div", "alert-blue-text", "Audio finish reset.", 3000, "blue");
});

document.getElementById("save-options").addEventListener("click", async () => {
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
			let finalDestination = window.files.copy(
				audioAfterWorkFile.path,
				null,
				localStorage.getItem("audioAfterWorkFilePath")
			);
			localStorage.setItem("audioAfterWorkFilePath", finalDestination);
		}

		if (audioAfterRestFile != null && audioAfterRestFile != undefined) {
			let finalDestination = window.files.copy(
				audioAfterRestFile.path,
				null,
				localStorage.getItem("audioAfterRestFilePath")
			);
			localStorage.setItem("audioAfterRestFilePath", finalDestination);
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

window.addEventListener("load", async () => {
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

document.getElementById("timeForPomodoroWorkingSession").addEventListener("input", async () => {
	convertTimerValues("timeForPomodoroWorkingSession", "timeToWorkConverted");
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

document.getElementById("timeForPomodoroRestingSession").addEventListener("input", async () => {
	convertTimerValues("timeForPomodoroRestingSession", "timeToRestConverted");
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

document.getElementById("numberOfSessionsValue").addEventListener("input", async () => {
	convertTimerValues("numberOfSessionsValue", "finalTimeConverted");
});

document.getElementById("play-audio-after-work").addEventListener("click", async () => {
	playAudio("done", "work");
});

document.getElementById("play-audio-after-rest").addEventListener("click", async () => {
	playAudio("done", "rest");
});
document.getElementById("play-audio-countdown").addEventListener("click", async () => {
	playAudio("countdown");
});

document.getElementById("play-audio-finish").addEventListener("click", async () => {
	playAudio("finish");
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

function playAudio(currentAudioToPlay, currentActivity = "") {
	if (currentAudio != null && currentAudio != undefined) {
		currentAudio.pause();
	}

	if (currentAudioToPlay == "countdown") {
		if (localStorage.getItem("audioCountdownPath") != null) {
			currentAudio = new Audio(localStorage.getItem("audioCountdownPath"));
		} else if (audioCountDownFile != null) {
			currentAudio = new Audio(audioCountDownFile.path);
		} else {
			currentAudio = new Audio("assets/audio/countdown.wav");
		}
	} else if (currentAudioToPlay == "done") {
		if (currentActivity == "work") {
			if (localStorage.getItem("audioAfterWorkFilePath") != null) {
				currentAudio = new Audio(localStorage.getItem("audioAfterWorkFilePath"));
			} else if (audioAfterWorkFile != null) {
				currentAudio = new Audio(audioAfterWorkFile.path);
			} else {
				currentAudio = new Audio("assets/audio/playAfterWork.wav");
			}
		} else if (currentActivity == "rest") {
			if (localStorage.getItem("audioAfterRestFilePath") != null) {
				currentAudio = new Audio(localStorage.getItem("audioAfterRestFilePath"));
			} else if (audioAfterRestFile != null) {
				currentAudio = new Audio(audioAfterRestFile.path);
			} else {
				currentAudio = new Audio("assets/audio/playAfterRest.wav");
			}
		}
	} else if (currentAudioToPlay == "finish") {
		if (localStorage.getItem("audioFinishPath") != null) {
			currentAudio = new Audio(localStorage.getItem("audioFinishPath"));
		} else if (audioFinishFile != null) {
			currentAudio = new Audio(audioFinishFile.path);
		} else {
			currentAudio = new Audio("assets/audio/finish.wav");
		}
	}

	console.log(currentAudio);

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
