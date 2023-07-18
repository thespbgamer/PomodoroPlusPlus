let timeLeft = -1;
let currentActivity = "N/A";
let numberOfSessions = -1;
let sessionsRemaining = -1;

//onpageload
window.addEventListener("load", async () => {
	//console.log("onpageload");

	toggleCurrentActivityAndTimeLeft();
	numberOfSessions = localStorage.getItem("numberOfSessionsValue");
	sessionsRemaining = numberOfSessions * 2;
});

document.getElementById("startButton").addEventListener("click", async () => {
	//start countdown timer
	sessionsRemaining = numberOfSessions * 2;
	startCountdown();
});

function startCountdown() {
	// sessions left
	sessionsRemaining -= 1;

	if (sessionsRemaining < 0) {
		document.getElementById("countdown").innerHTML = "Finished";
		toggleCurrentActivityAndTimeLeft();
		updateCurrentSessionMessage(0, "hide");
		return;
	}

	document.getElementById("startButton").setAttribute("disabled", "disabled");
	updateCurrentSessionMessage();
	var currentTimer = setInterval(function () {
		//format mm:ss with allwas 2 digits
		document.getElementById("countdown").innerHTML =
			("0" + Math.floor(timeLeft / 60)).slice(-2) + ":" + ("0" + (timeLeft % 60)).slice(-2);
		timeLeft -= 1;
		if (timeLeft < 0) {
			clearInterval(currentTimer);
			document.getElementById("countdown").innerHTML = "Finished";
			document.getElementById("startButton").removeAttribute("disabled");
			toggleCurrentActivityAndTimeLeft();
			updateCurrentSessionMessage(0, "hide");
			startCountdown();
		}
	}, 1000);
}

function toggleCurrentActivityAndTimeLeft() {
	if (currentActivity == "work") {
		currentActivity = "rest";
		timeLeft = localStorage.getItem("timeForPomodoroRestingSession");
	} else {
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
