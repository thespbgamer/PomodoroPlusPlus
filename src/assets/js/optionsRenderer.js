let audioAfterWorkFile = null;
let audioAfterRestFile = null;
let audioCountDownFile = null;
let audioFinishFile = null;

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
	NotifyUpdate();
});

document.getElementById("reset-audio-after-rest").addEventListener("click", async () => {
	window.files.copy(null, null, localStorage.getItem("audioAfterRestFilePath"));
	localStorage.removeItem("audioAfterRestFilePath");
	NotifyUpdate();
});

document.getElementById("reset-audio-countdown").addEventListener("click", async () => {
	window.files.copy(null, null, localStorage.getItem("audioCountdownPath"));
	localStorage.removeItem("audioCountdownPath");
	NotifyUpdate();
});

document.getElementById("reset-audio-finish").addEventListener("click", async () => {
	window.files.copy(null, null, localStorage.getItem("audioFinishPath"));
	localStorage.removeItem("audioFinishPath");
	NotifyUpdate();
});

function NotifyUpdate() {
	Toastify.toast({
		text: "Audio reset done.",
		duration: 3000,
		close: true,
		gravity: "bottom",
		position: "right",
		style: {
			background: "linear-gradient(to right, rgba(14,0,255,1),rgba(0,232,255,1))",
		},
	});
}

document.getElementById("save-options").addEventListener("click", async () => {
	try {
		let timeForPomodoroWorkingSession = document.getElementById("timeForPomodoroWorkingSession").value;
		let timeForPomodoroRestingSession = document.getElementById("timeForPomodoroRestingSession").value;
		let numberOfSessionsValue = document.getElementById("numberOfSessionsValue").value;
		let audioLevelValue = document.getElementById("audioLevelValue").value;

		if (parseInt(numberOfSessionsValue == null || numberOfSessionsValue) < 1) {
			numberOfSessionsValue = 1;
		}

		if (
			timeForPomodoroWorkingSession == "" ||
			timeForPomodoroRestingSession == "" ||
			numberOfSessionsValue == "" ||
			audioLevelValue == ""
		) {
			// Toastify.toast({
			// 	text: "Fill all the fields!",
			// 	duration: 3000,
			// 	close: true,
			// 	gravity: "bottom",
			// 	position: "right",
			// 	style: {
			// 		background: "linear-gradient(to right, rgba(14,0,255,1),rgba(0,232,255,1))",
			// 	},
			// });
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

		Toastify.toast({
			text: "Options saved!",
			duration: 3000,
			close: true,
			gravity: "bottom",
			position: "right",
			style: {
				background: "linear-gradient(to right, #00b09b, #96c93d)",
			},
		});
	} catch (err) {
		//console.log(err);
		Toastify.toast({
			text: err,
			duration: 3000,
			close: true,
			gravity: "bottom",
			position: "right",
			style: {
				background: "linear-gradient(to right, rgba(37,2,2,1),rgba(233,68,68,1))",
			},
		});
	}
});

window.addEventListener("load", async () => {
	let timeForPomodoroWorkingSession = localStorage.getItem("timeForPomodoroWorkingSession");
	let timeForPomodoroRestingSession = localStorage.getItem("timeForPomodoroRestingSession");
	let numberOfSessionsValue = localStorage.getItem("numberOfSessionsValue");
	let audioLevelValue = localStorage.getItem("audioLevelValue");

	if (numberOfSessionsValue == null || parseInt(numberOfSessionsValue) < 1) {
		numberOfSessionsValue = 1;
	}

	if (audioLevelValue == null || parseInt(audioLevelValue) < 0 || parseInt(audioLevelValue) > 1) {
		audioLevelValue = 1;
	}

	if (timeForPomodoroWorkingSession == null) {
		timeForPomodoroWorkingSession = 60;
	}

	if (timeForPomodoroRestingSession == null) {
		timeForPomodoroRestingSession = 30;
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
