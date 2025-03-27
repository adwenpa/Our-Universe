// import { apiKey } from "../notes.js";

/*
 * Replace with NASA API key if you intend to download more than thirty
 * APODs in an hour, or more than 50 APODs in a day.
 */
const apiUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apiKey = "DEMO_KEY";
let apiQuery = apiUrl + apiKey;

const heading = document.getElementById("topHeading");
const apodTitle = document.getElementById("apod-title");
const apodMedia = document.getElementById("apod-media");
const apodDescription = document.getElementById("description");
const apodDate = document.getElementById("date");
const copyright = document.getElementById("copyright");
const startDate = document.getElementById("start-date");
let numApods;

async function fetchAPOD() {
  try {
    fetch(apiQuery)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        displayAPOD(json);
      });
  } catch (error) {
    console.log(error);
  }
}

function displayAPOD(data) {
  let today = new Date();
  today = dateToISO(today);
  startDate.setAttribute("max", `${today}`);
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

const randomBtn = document.getElementById("random-btn");
const randomApod = document.getElementById("random-apod");
const specificBtn = document.getElementById("specific-btn");
const specificApod = document.getElementById("specific-apod");

randomBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let today = new Date();
  today = dateToISO(today);
  let firstDate = new Date("June 16, 1995");
  let randomDate = randomDay(firstDate, today);
  randomDate = dateToISO(randomDate);
  let numApods = parseInt(randomApod.value);
  if (numApods === 1) {
    additions = `&date=${randomDate}`;
  } else {
    let today = new Date();
    endDate = addDaysToDate(apodStartDate, numApods - 1);
    if (endDate > today) {
      endDate = apodStartDate;
      apodStartDate = addDaysToDate(endDate, 1 - numApods);
      apodStartDate = dateToISO(apodStartDate);
    } else {
      endDate = dateToISO(endDate);
    }
    additions = `&start_date=${apodStartDate}&end_date=${endDate}`;
  }
  apiQuery = apiUrl + apiKey + additions;
  fetchAPOD();
});

specificBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let numApods = parseInt(specificApod.value);
  let apodStartDate = startDate.value;
  let endDate;
  let additions;
  if (numApods === 1) {
    additions = `&date=${apodStartDate}`;
  } else {
    let today = new Date();
    endDate = addDaysToDate(apodStartDate, numApods - 1);
    if (endDate > today) {
      endDate = apodStartDate;
      apodStartDate = addDaysToDate(endDate, 1 - numApods);
      apodStartDate = dateToISO(apodStartDate);
    } else {
      endDate = dateToISO(endDate);
    }
    additions = `&start_date=${apodStartDate}&end_date=${endDate}`;
  }
  apiQuery = apiUrl + apiKey + additions;
  fetchAPOD();
});

function addDaysToDate(date, days) {
  let newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

function dateToISO(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function randomDay(begin, end) {
  begin = new Date(begin);
  end = new Date(end);
  return new Date(
    begin.getTime() + Math.random() * (end.getTime() - begin.getTime())
  );
}

function playVideo(videoUrl) {
  const iframe = document.createElement("iframe");
  iframe.src = videoUrl;
  iframe.width = "100%";
  iframe.allow = "accelerometer; autoplay; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  apodMedia.appendChild(iframe);
}

fetchAPOD();
