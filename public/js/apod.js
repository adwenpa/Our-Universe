/*
 * Replace with NASA API key if you intend to download more than thirty
 * APODs in an hour, or more than 50 APODs in a day.
 */
const apiUrl = "https://api.nasa.gov/planetary/apod?api_key=";
const apikey = "DEMO_KEY";
let apiQuery = apiUrl + apikey;
let today = dateToISO(new Date());

const heading = document.getElementById("topHeading");
const apodTitle = document.getElementById("apod-title");
const apodMedia = document.getElementById("apod-media");
const apodDescription = document.getElementById("description");
const apodDate = document.getElementById("date");
const copyright = document.getElementById("copyright");
const specificDate = document.getElementById("specific-date");

const randomBtn = document.getElementById("random-btn");
const slideBtn = document.getElementById("slide-btn");
const specificBtn = document.getElementById("specific-btn");

specificBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let date = specificDate.value;
  console.log(date);
  date = checkDays(date);
  date = dateToISO(date);
  fetchAPOD(date);
});

slideBtn.addEventListener("click", (event) => {
  event.preventDefault();
  showSlides();
});

randomBtn.addEventListener("click", (event) => {
  event.preventDefault();
  let date = randomDay();
  fetchAPOD(date);
});

// No APODs on June 17, 18, and 19, 1995.
function checkDays(date) {
  if (date === "1995-06-17" || date === "1995-06-18" || date === "1995-06-19") {
    return "1995-06-20";
  } else {
    return date;
  }
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

function displayAPOD(data) {
  let maxD = dateToISO(new Date());
  specificDate.setAttribute("max", `${maxD}`);
  const mediaUrl = data.url;
  const altText = data.title;
  heading.textContent = `ASTRONOMY PICTURE OF THE DAY (APOD) ${data.date}`;
  apodTitle.textContent = data.title;
  apodDescription.textContent = data.explanation;
  if (data.media_type === "image") {
    apodMedia.innerHTML = `<img src=${mediaUrl} 
  alt=${altText} />`;
  } else {
    playVideo(mediaUrl);
  }
  if (data.hasOwnProperty("copyright")) {
    copyright.innerHTML = `<p>&copy; ${data.copyright}</p>`;
  }
}

function showSlides() {
  let num = 10;
  for (let i = 0; i < num; i++) {
    let date = randomDay();
    setInterval(() => {
      fetchAPOD(date);
    }, 10000);
  }
}

async function fetchAPODs() {
  let num = 5;
  for (let i = 0; i < num; i++) {
    let date = randomDay();
    const response = await fetchAPOD(date);
    const data = await response.json();
    apods.push(data);
  }
}

async function fetchAPOD(date) {
  try {
    fetch(`${apiQuery}&date=${date}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        displayAPOD(json);
      });
  } catch (error) {
    console.log(error);
  }
}

fetchAPOD(today);
