# neo-lookup
Near-Earth-Object Lookup

This tool will show you the near-earth-asteroids that are making a close pass on each day for the coming week. The tool has the ability to show NEOs for any date or a date range, so let's build that out together, fren.

This is an Express application using jQuery to get the data.

# setup
1. clone
2. `npm install`
3. get a NASA API key [here](https://api.nasa.gov/index.html#apply-for-an-api-key)
4. setup `.env` file to match the example `.env.default` format using the NASA API you acquired
5. `npm start`
6. navigate to `localhost:3000` in a browser

# data
Data sourced from [this API](https://api.nasa.gov/api.html#NeoWS) from JPLs database
