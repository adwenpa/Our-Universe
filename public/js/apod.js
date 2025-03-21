"use strict";

const apiKey = "DEMO_KEY"; // Replace with your NASA API key
const apodContainer = document.getElementById("apod-container");

async function fetchAPOD() {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
  );
  const data = await response.json();

  const title = data.title;
  const imageUrl = data.url;
  const explanation = data.explanation;
  const date = data.date;

  document.getElementById("title").textContent = title;
  document.getElementById("apod-image").src = imageUrl;
  document.getElementById("apod-image").alt = title;
  document.getElementById("description").textContent = explanation;
  document.getElementById("date").textContent = `Date: ${date}`;
}

fetchAPOD();
