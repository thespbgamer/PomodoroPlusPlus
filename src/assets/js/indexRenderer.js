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

		document.querySelector(".progressBarValue").style.setProperty("stroke", "gold");
		document
			.querySelector(".progressBarValue")
			.style.setProperty("filter", "drop-shadow(0px 0px 3px rgba(255,215,0, 0.7))");

		updateCurrentSessionMessage(0, "hide");
		toggleCurrentActivityAndTimeLeft("rest");
		return;
	}

	let countdownStarted = false;

	document.getElementById("startButton").setAttribute("disabled", "disabled");
	updateCurrentSessionMessage();

	// console.log(timeLeft);

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
		document.getElementById("currentSession").classList.remove("text-red-600");
		//remove text success class
		document.getElementById("currentSession").classList.remove("text-green-500");

		document.querySelector(".progressBarValue").style.setProperty("--animationTime", "");

		if (status == "rest") {
			document.getElementById("currentSession").innerHTML = "Resting";
			document.getElementById("currentSession").classList.add("text-green-500");

			document.querySelector(".progressBarValue").style.setProperty("stroke", "green");
			document
				.querySelector(".progressBarValue")
				.style.setProperty("filter", " drop-shadow(0px 0px 3px rgba(0, 255, 0, 0.7))");

			document.querySelector(".progressBarValue").style.setProperty("--animationTime", timeLeft + "s");
			document.querySelector(".progressBarValue").style.setProperty("animation", "none");
			setTimeout(function () {
				document.querySelector(".progressBarValue").style.setProperty("animation", "");
			}, 5);
		} else if (status == "work") {
			document.getElementById("currentSession").innerHTML = "Working";
			document.getElementById("currentSession").classList.add("text-red-600");

			document.querySelector(".progressBarValue").style.setProperty("stroke", "red");
			document
				.querySelector(".progressBarValue")
				.style.setProperty("filter", "drop-shadow(0px 0px 3px rgba(255, 0, 0, 0.7))");

			document.querySelector(".progressBarValue").style.setProperty("--animationTime", timeLeft + "s");
			document.querySelector(".progressBarValue").style.setProperty("animation", "none");
			setTimeout(function () {
				document.querySelector(".progressBarValue").style.setProperty("animation", "");
			}, 5);
		} else {
			//remove style color
			document.getElementById("currentSession").innerHTML = "N/A";
			document.querySelector(".progressBarValue").style.setProperty("--animationTime", "0ms");
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
