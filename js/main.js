function get5DayWeather(cityOrLat, long) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      parseWeather(this.responseXML);
    } else if (this.readyState == 4 && this.status == 404) {
      alert(
        "Error with Request, Please Enter a Valid City in OpenWeather's Scope"
      );
    }
  };
  xhttp.open(
    "GET",
    long == undefined
      ? `http://api.openweathermap.org/data/2.5/forecast?q=${cityOrLat}&mode=xml&units=metric&appid=95d0b55841d67b70908514813581f44c`
      : `http://api.openweathermap.org/data/2.5/forecast?lat=${cityOrLat}&lon=${long}&mode=xml&units=metric&appid=95d0b55841d67b70908514813581f44c`,
    true
  );
  xhttp.send();
}

function parseWeather(xml) {
  document.getElementById("left-card").style.visibility = "visible";
  document.getElementById("left-card").style.display = "none";

  let allTimes = xml.getElementsByTagName("time");
  document.getElementById("5dayForecast").innerHTML = "";
  for (let i = 0; i < allTimes.length; i += 8) {
    let time = new Date(allTimes[i].attributes[0].nodeValue);
    let foreType = allTimes[i].children[0].attributes[1].nodeValue;
    let foreDayNight = allTimes[i].children[0].attributes[2].nodeValue;

    let forecaseObj =
      '<div class="for-5-obj">' +
      (i == 0 ? "Today" : time.toDateString().split(" ")[0]) +
      "<br>" +
      time.toDateString().split(" ")[1] +
      " " +
      time.toDateString().split(" ")[2] +
      "<br>" +
      getWeatherOf(foreType, foreDayNight) +
      "<br />" +
      foreType
        .split(" ")
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ") +
      "</div>";
    document.getElementById("5dayForecast").innerHTML += forecaseObj;
  }

  // Left Card
  document.getElementById("currentWeatherHeading").innerHTML =
    xml.getElementsByTagName("location")[0].children[0].textContent +
    ", " +
    xml.getElementsByTagName("location")[0].children[2].textContent;
  document.getElementById("currentWeather").innerHTML =
    parseFloat(allTimes[0].children[4].attributes[2].nodeValue).toFixed(1) +
    "°";
  document.getElementById("currentWeatherInfo").innerHTML =
    allTimes[0].children[0].attributes[1].nodeValue
      .split(" ")
      .map(s => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ") +
    "<br>" +
    parseFloat(allTimes[0].children[4].attributes[2].nodeValue).toFixed(1) +
    "° / " +
    parseFloat(allTimes[0].children[4].attributes[3].nodeValue).toFixed(1) +
    "°";

  document.getElementById("currentWeatherIcon").src = imageSrcFrom(
    getActualWeatherName(allTimes[0].children[0].attributes[1].nodeValue),
    allTimes[0].children[0].attributes[2].nodeValue
  );

  document.getElementById("left-card").style.display = "block";
  document.getElementsByClassName("card-normal")[0].style.display = "block";

  toggleBackgroundAnimation(allTimes[0].children[0].attributes[1].nodeValue);
  generateChartData(xml);
}

function generateChartData(xml) {
  let allTimes = xml.getElementsByTagName("time");
  let labels = [];
  let mins = [];
  let maxs = [];
  for (let i = 0; i < allTimes.length; i++) {
    let period = allTimes[i];
    let time = new Date(allTimes[i].attributes[0].nodeValue);
    labels.push(
      time.toUTCString().split(" ")[1] +
        " " +
        time.toUTCString().split(" ")[2] +
        " " +
        time
          .toUTCString()
          .split(" ")[4]
          .split(":")[0] +
        ":" +
        time
          .toUTCString()
          .split(" ")[4]
          .split(":")[1]
    );

    console.log(allTimes[0]);
    mins.push(parseFloat(allTimes[i].children[4].attributes[2].nodeValue));
    maxs.push(parseFloat(allTimes[i].children[4].attributes[3].nodeValue));
  }
  console.log(mins);
  generateChart(labels, mins, maxs);
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    position => {
      get5DayWeather(position.coords.latitude, position.coords.longitude);
    },
    error => {
      //   alert("Cannot retrieve location!");
    }
  );
}

function getWeatherFromUser() {
  get5DayWeather(document.getElementById("cityInp").value);
}
