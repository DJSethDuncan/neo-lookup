var express = require("express");
var router = express.Router();
var axios = require("axios");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const startDate = new Date().toISOString().slice(0, 10);
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&api_key=${process.env.NASA_API}`;
  const response = await axios.get(url);
  const data = JSON.stringify(response.data);
  if (process.env.NASA_API) {
    res.render("index", { title: "NEO Lookup", data: data });
  } else {
    res.render("index", { title: "No API Key Set Up" });
  }
});

module.exports = router;
