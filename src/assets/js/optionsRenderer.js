document.getElementById("toggle-dark-mode").addEventListener("click", async () => {
	const isDarkMode = await window.darkMode.toggle();
	// console.log(isDarkMode);

	document.getElementById("bodyColor").setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
});

document.getElementById("save-options").addEventListener("click", async () => {
	//console.log("save-options clicked");

	try {
		//save in local storage the values of the options
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

		if (audioAfterWorkFileURL != null && audioAfterWorkFileURL != undefined) {
			localStorage.setItem("audioAfterWorkFileURL", audioAfterWorkFileURL);
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
		console.log(err);
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

//onpageload
window.addEventListener("load", async () => {
	//console.log("onpageload");
	//get the values from local storage
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

	//console.log(numberOfSessionsValue);

	//set the values from local storage
	document.getElementById("timeForPomodoroWorkingSession").value = timeForPomodoroWorkingSession;
	document.getElementById("timeForPomodoroRestingSession").value = timeForPomodoroRestingSession;
	document.getElementById("numberOfSessionsValue").value = numberOfSessionsValue;
	document.getElementById("audioLevelValue").value = audioLevelValue * 100;

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

let audioAfterWorkFileURL = null;
//after file is selected
document.getElementById("audioAfterWorkFile").addEventListener("change", async () => {
	console.log("file changed");
	let audioAfterWorkFile = document.getElementById("audioAfterWorkFile").files[0];
	console.log(audioAfterWorkFile);

	if (audioAfterWorkFile == null || audioAfterWorkFile == undefined) {
		return;
	}

	audioAfterWorkFileURL = URL.createObjectURL(audioAfterWorkFile);
	console.log(audioAfterWorkFileURL);

	Toastify.toast({
		text: "Audio file saved!",
		duration: 3000,
		close: true,
		gravity: "bottom",
		position: "right",
		style: {
			background: "linear-gradient(to right, #00b09b, #96c93d)",
		},
	});
});
