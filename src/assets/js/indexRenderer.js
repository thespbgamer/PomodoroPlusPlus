let timeLeft = -1;
let currentActivity = "N/A";
let numberOfSessions = -1;
let sessionsRemaining = -1;
let currentAudio;

//onpageload
window.addEventListener("load", async () => {
	//console.log("onpageload");
	if (localStorage.getItem("numberOfSessionsValue") == null || localStorage.getItem("numberOfSessionsValue") < 1) {
		window.location.replace("options.html");
	}

	numberOfSessions = localStorage.getItem("numberOfSessionsValue");
	sessionsRemaining = numberOfSessions * 2;
});

document.getElementById("startButton").addEventListener("click", async () => {
	//start countdown timer
	sessionsRemaining = numberOfSessions * 2;
	toggleCurrentActivityAndTimeLeft("work");
	startCountdown();
});

function startCountdown() {
	// sessions left
	sessionsRemaining -= 1;

	if (sessionsRemaining < 0) {
		document.getElementById("countdown").innerHTML = "Finished";
		updateCurrentSessionMessage(0, "hide");
		return;
	}

	let countdownStarted = false;

	document.getElementById("startButton").setAttribute("disabled", "disabled");
	updateCurrentSessionMessage();
	var currentTimer = setInterval(function () {
		//format mm:ss with allwas 2 digits
		document.getElementById("countdown").innerHTML =
			("0" + Math.floor(timeLeft / 60)).slice(-2) + ":" + ("0" + (timeLeft % 60)).slice(-2);
		timeLeft -= 1;
		if (timeLeft < 0) {
			if (sessionsRemaining == 0) {
				playAudio("finish");
			} else {
				playAudio("done");
			}
			clearInterval(currentTimer);
			document.getElementById("countdown").innerHTML = "Finished";
			document.getElementById("startButton").removeAttribute("disabled");
			toggleCurrentActivityAndTimeLeft();
			updateCurrentSessionMessage(0, "hide");
			startCountdown();
		}
		if (timeLeft < 3 && !countdownStarted) {
			countdownStarted = true;
			//play wav file
			playAudio("countdown");
		}
	}, 1000);
}

function toggleCurrentActivityAndTimeLeft(forceValue = null) {
	if (currentActivity == "work" || forceValue == "rest") {
		currentActivity = "rest";
		timeLeft = localStorage.getItem("timeForPomodoroRestingSession");
	} else if (currentActivity == "rest" || forceValue == "work") {
		currentActivity = "work";
		timeLeft = localStorage.getItem("timeForPomodoroWorkingSession");
	}
}

function updateCurrentSessionMessage(delayInSeconds = 1, status = currentActivity) {
	setTimeout(function () {
		//remove text danger class
		document.getElementById("currentSession").classList.remove("text-danger");
		//remove text success class
		document.getElementById("currentSession").classList.remove("text-success");

		if (status == "rest") {
			document.getElementById("currentSession").innerHTML = "Resting";
			document.getElementById("currentSession").classList.add("text-success");

			progressBar.circle("#progressBarID", "#35c425", 50, timeLeft * 1000, "33.3%", 1);

			setTimeout(() => {
				//remove everything in the progress bar
				document.getElementById("progressBarID").innerHTML = "";
			}, timeLeft * 1000);
		} else if (status == "work") {
			document.getElementById("currentSession").innerHTML = "Working";
			document.getElementById("currentSession").classList.add("text-danger");

			progressBar.circle("#progressBarID", "#c4252d", 50, timeLeft * 1000, "33.3%", 1);

			setTimeout(() => {
				//remove everything in the progress bar
				document.getElementById("progressBarID").innerHTML = "";
			}, timeLeft * 1000);
		} else {
			//remove style color
			document.getElementById("currentSession").innerHTML = "N/A";
		}
	}, delayInSeconds * 1000);
}

function playAudio(currentAudioToPlay) {
	if (currentAudio != null && currentAudio != undefined) {
		currentAudio.pause();
	}

	if (currentAudioToPlay == "countdown") {
		if (localStorage.getItem("audioCountdownPath") != null) {
			currentAudio = new Audio(localStorage.getItem("audioCountdownPath"));
		} else {
			currentAudio = new Audio("assets/audio/countdown.wav");
		}
	} else if (currentAudioToPlay == "done") {
		if (currentActivity == "work") {
			if (localStorage.getItem("audioAfterWorkFilePath") != null) {
				currentAudio = new Audio(localStorage.getItem("audioAfterWorkFilePath"));
			} else {
				currentAudio = new Audio("assets/audio/playAfterWork.wav");
			}
		} else if (currentActivity == "rest") {
			if (localStorage.getItem("audioAfterRestFilePath") != null) {
				currentAudio = new Audio(localStorage.getItem("audioAfterRestFilePath"));
			} else {
				currentAudio = new Audio("assets/audio/playAfterRest.wav");
			}
		}
	} else if (currentAudioToPlay == "finish") {
		if (localStorage.getItem("audioFinishPath") != null) {
			currentAudio = new Audio(localStorage.getItem("audioFinishPath"));
		} else {
			currentAudio = new Audio("assets/audio/finish.wav");
		}
	}

	//audio level set to 100%
	currentAudio.volume = localStorage.getItem("audioLevelValue") || 1;
	currentAudio.play();
}
