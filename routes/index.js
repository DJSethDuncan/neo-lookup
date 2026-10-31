const express = require("express");
const axios = require("axios");
const router = express.Router();

router.get("/", async (_req, res) => {
  const startDate = new Date().toISOString().slice(0, 10);
  let data = null;
  let error = null;

  if (process.env.NASA_API) {
    try {
      const response = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
        params: { start_date: startDate, api_key: process.env.NASA_API },
        timeout: 10000,
      });
      data = response.data;
    } catch (err) {
      console.error("NASA NeoWs request failed:", err.message);
      error = "Mission data is temporarily unavailable. Please try again shortly.";
    }
  } else {
    error = "Add a NASA API key to .env to connect to the live asteroid feed.";
  }

  res.render("index", { title: "NEO // Close approach monitor", data, error });
});

module.exports = router;
