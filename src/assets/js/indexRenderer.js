//Default invalid values for certain global variables
let glob_timeLeft = -1;
let glob_currentActivity = "N/A";
let glob_numberOfSessions = -1;
let glob_pomodoroTimerPartsRemaining = -1;
let glob_currentAudio;

//On page load
window.addEventListener("load", async () => {
	//If it's the first time opening the app, redirect to the options
	if (localStorage.getItem("numberOfSessionsValue") == null || localStorage.getItem("numberOfSessionsValue") < 1) {
		window.location.replace("options.html");
	}

	//Get the number of sessions and save it
	glob_numberOfSessions = localStorage.getItem("numberOfSessionsValue");
});

//When you click the start button
document.getElementById("startButton").addEventListener("click", async () => {
	//Calculate the number of pomodoro timers remaining
	glob_pomodoroTimerPartsRemaining = glob_numberOfSessions * 2;

	//Force the current activity to "work"
	toggleCurrentActivityAndTimeLeft("work");

	//Start the countdown
	startCountdown();
});

function startCountdown() {
	//Has the countdown started ?
	let hasCountdownStarted = false;

	// Timers left -1
	glob_pomodoroTimerPartsRemaining -= 1;

	//If no more timers, define the pomodoro with "Finished", and re-enable the start button
	if (glob_pomodoroTimerPartsRemaining < 0) {
		updateCurrentSessionMessage(0, "finish");
		toggleCurrentActivityAndTimeLeft("rest");
		return;
	}

	//Disable the start button and update colors of text and the circle timer
	document.getElementById("startButton").setAttribute("disabled", "disabled");
	updateCurrentSessionMessage();

	// console.log(glob_timeLeft);

	var currentPartTimer = setInterval(function () {
		//format mm:ss with allwas 2 digits
		document.getElementById("countdown").innerHTML =
			("0" + Math.floor(glob_timeLeft / 60)).slice(-2) + ":" + ("0" + (glob_timeLeft % 60)).slice(-2);
		glob_timeLeft -= 1;
		if (glob_timeLeft < 0) {
			if (glob_pomodoroTimerPartsRemaining == 0) {
				document.getElementById("countdown").innerHTML = "Congratulations";
				playAudio("finish");
			} else {
				document.getElementById("countdown").innerHTML = "Next part is Starting";
				playAudio("done");
			}
			clearInterval(currentPartTimer);

			document.getElementById("startButton").removeAttribute("disabled");
			toggleCurrentActivityAndTimeLeft();
			updateCurrentSessionMessage(0, "resetStyles");
			startCountdown();
		}
		if (glob_timeLeft < 3 && !hasCountdownStarted) {
			hasCountdownStarted = true;
			//play wav file
			playAudio("countdown");
		}
	}, 1000);
}

function toggleCurrentActivityAndTimeLeft(forceValue = null) {
	if (glob_currentActivity == "work" || forceValue == "rest") {
		glob_currentActivity = "rest";
		glob_timeLeft = localStorage.getItem("timeForPomodoroRestingSession");
	} else if (glob_currentActivity == "rest" || forceValue == "work") {
		glob_currentActivity = "work";
		glob_timeLeft = localStorage.getItem("timeForPomodoroWorkingSession");
	}
}

function updateCurrentSessionMessage(delayInSeconds = 1, status = glob_currentActivity) {
	setTimeout(function () {
		resetColorClassesCurrentSession();

		if (status == "rest") {
			updateCurrentTimerTextAndColor("Resting", "text-green-500");
			updateProgressBarColor("green", "drop-shadow(0px 0px 3px rgba(0, 255, 0, 0.7))");
		} else if (status == "work") {
			updateCurrentTimerTextAndColor("Working", "text-red-600");
			updateProgressBarColor("red", "drop-shadow(0px 0px 3px rgba(255, 0, 0, 0.7))");
		} else if (status == "finish") {
			updateCurrentTimerTextAndColor("Finished", "text-amber-400");
			updateProgressBarColor("gold", "drop-shadow(0px 0px 3px rgba(255,215,0, 0.7))");
		} else {
			//remove style color
			document.getElementById("currentSession").innerHTML = "Done";
			document.querySelector(".progressBarValue").style.setProperty("--animationTime", "0ms");
		}
	}, delayInSeconds * 1000);
}

function updateCurrentTimerTextAndColor(text, colorClass) {
	document.getElementById("currentSession").innerHTML = text;
	document.getElementById("currentSession").classList.add(colorClass);
}

function resetColorClassesCurrentSession() {
	//remove text danger class
	document.getElementById("currentSession").classList.remove("text-red-600");
	//remove text success class
	document.getElementById("currentSession").classList.remove("text-green-500");
	//remove golden text
	document.getElementById("currentSession").classList.remove("text-amber-400");
}

function updateProgressBarColor(barColor, barDropShadow, timeValue = glob_timeLeft) {
	document.querySelector(".progressBarValue").style.setProperty("--animationTime", "");

	document.querySelector(".progressBarValue").style.setProperty("stroke", barColor);
	document.querySelector(".progressBarValue").style.setProperty("filter", barDropShadow);

	document.querySelector(".progressBarValue").style.setProperty("--animationTime", timeValue + "s");
	document.querySelector(".progressBarValue").style.setProperty("animation", "none");
	setTimeout(function () {
		document.querySelector(".progressBarValue").style.setProperty("animation", "");
	}, 5);
}

function playAudio(currentAudioToPlay) {
	if (glob_currentAudio != null && glob_currentAudio != undefined) {
		glob_currentAudio.pause();
	}

	if (currentAudioToPlay == "countdown") {
		if (localStorage.getItem("audioCountdownPath") != null) {
			glob_currentAudio = new Audio(localStorage.getItem("audioCountdownPath"));
		} else {
			glob_currentAudio = new Audio("assets/audio/countdown.wav");
		}
	} else if (currentAudioToPlay == "done") {
		if (glob_currentActivity == "work") {
			if (localStorage.getItem("audioAfterWorkFilePath") != null) {
				glob_currentAudio = new Audio(localStorage.getItem("audioAfterWorkFilePath"));
			} else {
				glob_currentAudio = new Audio("assets/audio/playAfterWork.wav");
			}
		} else if (glob_currentActivity == "rest") {
			if (localStorage.getItem("audioAfterRestFilePath") != null) {
				glob_currentAudio = new Audio(localStorage.getItem("audioAfterRestFilePath"));
			} else {
				glob_currentAudio = new Audio("assets/audio/playAfterRest.wav");
			}
		}
	} else if (currentAudioToPlay == "finish") {
		if (localStorage.getItem("audioFinishPath") != null) {
			glob_currentAudio = new Audio(localStorage.getItem("audioFinishPath"));
		} else {
			glob_currentAudio = new Audio("assets/audio/finish.wav");
		}
	}

	//audio level set to 100%
	glob_currentAudio.volume = localStorage.getItem("audioLevelValue") || 1;
	glob_currentAudio.play();
}
