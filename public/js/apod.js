/*
 * Replace with NASA API key if you intend to download more than thirty
 * APODs in an hour, or more than 50 APODs in a day.
 */
const apiUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apikey = "DEMO_KEY";
let apiQuery = apiUrl + apikey;
let today = new Date();
today = dateToISO(today);
let dates = [today];
console.log(dates);
console.log(apiQuery);

const heading = document.getElementById("topHeading");
const apodTitle = document.getElementById("apod-title");
const apodMedia = document.getElementById("apod-media");
const apodDescription = document.getElementById("description");
const apodDate = document.getElementById("date");
const copyright = document.getElementById("copyright");
const startDate = document.getElementById("start-date");
let numApods;

const randomBtn = document.getElementById("random-btn");
const randomApod = document.getElementById("random-apod");
const specificBtn = document.getElementById("specific-btn");
const specificApod = document.getElementById("specific-apod");

randomBtn.addEventListener("click", (event) => {
  event.preventDefault();

  let numApods = parseInt(randomApod.value);
  for (let i = 0; i < numApods; i++) {
    dates[i] = randomDay();
  }
  fetchAPODs(dates);
});

specificBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let numApods = parseInt(specificApod.value);
  let date = startDate.value;
  let temp = addDaysToDate(date, numApods - 1);
  if (temp > today) {
    date = addDaysToDate(today, 1 - numApods);
  }
  for (let i = 0; i < numApods; i++) {
    date = addDaysToDate(date, i);
    date = checkDays(date);
    dates[i] = date;
    // dates[i] = addDaysToDate(apodStartDate, i);
  }
  fetchAPODs(dates);
});

// No APODs on June 17, 18, and 19, 1995.
function checkDays(date) {
  if (date === "1995-06-17" || date === "1995-06-18" || date === "1995-06-19") {
    return "1995-06-20";
  } else {
    return date;
  }
}

function addDaysToDate(date, days) {
  let day = 24 * 60 * 60 * 1000;
  let newDate = new Date(date).getTime() + days * day;
  return dateToISO(newDate);
}

// "YYYY-MM-DD"
function dateToISO(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function randomDay() {
  let begin = new Date("June 16, 1995"); // First APOD
  let today = new Date();
  let lowLim = new Date("June 17, 1995"); // No APODs on June 17, 18, 19
  let hiLim = new Date("June 19, 1995");
  begin = begin.getTime();
  today = today.getTime();
  lowLim = lowLim.getTime();
  hiLim = hiLim.getTime();
  let rD;
  do {
    rD = new Date(begin + Math.random() * (today - begin));
  } while (rD <= hiLim && rD >= lowLim);

  return dateToISO(rD);
}

function playVideo(videoUrl) {
  const iframe = document.createElement("iframe");
  iframe.src = videoUrl;
  iframe.width = "100%";
  iframe.allow = "accelerometer; autoplay; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  apodMedia.appendChild(iframe);
}

function loadAPOD(data) {
  const mediaUrl = data.url;
  const altText = mediaUrl.split("/")[mediaUrl.split("/").length - 1];
  heading.textContent = `ASTRONOMY PICTURE OF THE DAY (APOD) ${data.date}`;
  apodTitle.textContent = data.title;
  apodDescription.textContent = data.explanation;
  if (data.media_type === "image") {
    apodMedia.innerHTML = `<img src=${mediaUrl} 
  alt=${altText} />`;
  } else {
    apodMedia.innerHTML = `<iframe 
    width="640" 
    height="360" 
    src=${mediaUrl} 
    frameborder="0" 
    allowfullscreen 
    ></iframe>`;
  }
  if (data.hasOwnProperty("copyright")) {
    copyright.innerHTML = `<p>&copy; ${data.copyright}</p>`;
  }
}

function nextI(i, j) {
  i = (i + 1) % j;
}

function displayAPOD(data) {
  /* let today = new Date();
  today = dateToISO(today); */
  startDate.setAttribute("max", `${today}`);
  let num = data.length;

  if (num === 1) {
    loadAPOD(data[0]);
  } else {
    let i = 0;
    while (true) {
      loadAPOD(data[i]);
      setInterval(nextI(i, num), 10000);
    }
  }
}

async function fetchAPOD(date) {
  const response = await fetch(`${apiQuery}&date=${date}`);
  const apod = await response.json();
  return apod;
}

async function fetchAPODs(dates) {
  let apods = [];
  for (let date of dates) {
    const apod = await fetchAPOD(date);
    apods.push(apod);
  }
  displayAPOD(apods);
}

fetchAPODs(dates);
