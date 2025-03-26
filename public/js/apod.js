// import { apiKey } from "../notes.js";

/*
 * Replace with NASA API key if you intend to download more than thirty
 * APODs in an hour, or more than 50 APODs in a day.
 */

const apiKey = "DEMO_KEY";

const heading = document.getElementById("topHeading");
const apodTitle = document.getElementById("apod-title");
const apodMedia = document.getElementById("apod-media");
const apodDescription = document.getElementById("description");
const apodDate = document.getElementById("date");
const copyright = document.getElementById("copyright");
const startDate = document.getElementById("start-date");

async function fetchAPOD() {
  try {
    fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
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
  const today = new Date().toISOString().slice(0, 10);
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
    apodMedia.innerHTML = `<video autoplay muted>
  <source src="mediaUrl" type="video/mp4">
Your browser does not support the video tag.
</video>`;
  }

  if (data.hasOwnProperty("copyright")) {
    copyright.innerHTML = `<p>&copy; ${data.copyright}</p>`;
  }
}

fetchAPOD();
