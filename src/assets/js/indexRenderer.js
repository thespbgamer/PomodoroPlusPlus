let timeLeft = 0;
let currentTimer = "X";

//onpageload
window.addEventListener("load", async () => {
	console.log("onpageload");
	//get the values from local storage
	toggleTimerAndTime();
});

document.getElementById("startButton").addEventListener("click", async () => {
	//start countdown timer
	startCountdown();
});

function startCountdown() {
	document.getElementById("startButton").setAttribute("disabled", "disabled");
	updateCurrentSession();
	var timeleft = localStorage.getItem("timeForPomodoroWorkingSession");
	var downloadTimer = setInterval(function () {
		//format mm:ss with allwas 2 digits
		document.getElementById("countdown").innerHTML =
			("0" + Math.floor(timeleft / 60)).slice(-2) + ":" + ("0" + (timeleft % 60)).slice(-2);
		timeleft -= 1;
		if (timeleft < 0) {
			clearInterval(downloadTimer);
			document.getElementById("countdown").innerHTML = "Finished";
			document.getElementById("startButton").removeAttribute("disabled");
			toggleTimerAndTime();
			updateCurrentSession(0, "hide");
		}
	}, 1000);
}

function toggleTimerAndTime() {
	if (currentTimer == "work") {
		currentTimer = "rest";
		timeLeft = localStorage.getItem("timeForPomodoroRestingSession");
	} else {
		currentTimer = "work";
		timeLeft = localStorage.getItem("timeForPomodoroWorkingSession");
	}
}

function updateCurrentSession(delayInSeconds = 1, status = currentTimer) {
	setTimeout(function () {
		//remove text danger class
		document.getElementById("currentSession").classList.remove("text-danger");
		//remove text success class
		document.getElementById("currentSession").classList.remove("text-success");

		if (status == "rest") {
			document.getElementById("currentSession").innerHTML = "Resting";
			document.getElementById("currentSession").classList.add("text-success");
		} else if (status == "work") {
			document.getElementById("currentSession").innerHTML = "Working";
			document.getElementById("currentSession").classList.add("text-danger");
		} else {
			//remove style color
			document.getElementById("currentSession").innerHTML = "N/A";
		}
	}, delayInSeconds * 1000);
}
