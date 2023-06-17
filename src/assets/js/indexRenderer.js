document.getElementById("startButton").addEventListener("click", async () => {
	//start countdown timer
	document.getElementById("startButton").setAttribute("disabled", "disabled");

	var timeleft = 70;
	var downloadTimer = setInterval(function () {
		//format mm:ss with allwas 2 digits
		document.getElementById("countdown").innerHTML =
			("0" + Math.floor(timeleft / 60)).slice(-2) + ":" + ("0" + (timeleft % 60)).slice(-2);
		timeleft -= 1;
		if (timeleft < 0) {
			clearInterval(downloadTimer);
			document.getElementById("countdown").innerHTML = "Finished";
			document.getElementById("startButton").removeAttribute("disabled");
		}
	}, 1000);
});
