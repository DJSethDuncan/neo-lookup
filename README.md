# neo-lookup

Near-Earth-Object Lookup

This tool will show you the near-earth-asteroids that are making a close pass on each day for the coming week. The tool has the ability to show NEOs for any date or a date range, so let's build that out together, fren.

This is an Express application using jQuery to get the data.

# setup

1. clone
2. `npm i`
3. get a NASA API key [here](https://api.nasa.gov/index.html#apply-for-an-api-key)
4. setup `.env` file to match the example `.env.default` format using the NASA API you acquired
5. `npm start`
6. navigate to `localhost:3000` in a browser

# dev

The app uses express/pug as a backend to spin up locally.

- The `routes/index.js` file handles the request to `localhost:3000` -- gets the API data, stringifies it, and passes it via express arg to `index.pug`
- The `views/index.pug` file handles the UI of the page, but it also _extends_ `views/layout.pug` -- which is important...
- The `views/layout.pug` file imports `public/javascripts/main.js` (which is where most of our display/transform logic lives) _and_ parses the JSON data string back into a JSON object (because I can't figure out how to pass an object vs a string as a param from express -> pug...)
- The `public/javascripts/main.js` file handles the logic to transform the data into UI elements for display

# data

Data sourced from [this API](https://api.nasa.gov/api.html#NeoWS) from JPLs database
