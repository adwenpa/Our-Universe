"use strict";

const express = require("express");
const app = express();
const path = require("path");
const port = 1776;

// Serves the front-end content in the public directory
app.use("", express.static(path.join(__dirname, "./public")));

// Serves the whole app
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log("Press Ctrl+C to end this process.");
});
