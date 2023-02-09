// prep jquery
$(document).ready(function () {
  $(".buttonHazardOnly").click(function () {
    $(".noHazard").parents(".neoRow").toggle();
    // make button active
  });

  $(".buttonNearOnly").click(function () {
    $(".midMiss, .farMiss").parents(".neoRow").toggle();
    // make button active
  });

  $(document).on("mouseenter", "#neoTable .NEOIconContainer", function () {
    var targetID = $(this).data("neo-id");
    $(".neoRow").removeClass("highlightNEO");
    $("#neoTable #" + targetID).addClass("highlightNEO");
  });

  $(document).on("mouseleave", "#neoTable .NEOIconContainer", function () {
    $(".neoRow").removeClass("highlightNEO");
  });

  displayNEOs(dataJSON);
});

// the parent function for transforming the data json into visual elements
const displayNEOs = (data) => {
  $("#loading").hide();

  var NEOs = data.near_earth_objects;
  var dateArray = [];

  for (date in NEOs) {
    dateArray.push(date);
  }

  dateArray.sort(date_sort_asc);

  for (date in dateArray) {
    const rowHeader = `
			<tr><td style="height:30px;">&nbsp;</td></tr>
			<tr><td colspan="99" style="text-align:center;"><h1>${dateArray[date]}</h1></td></tr>
			<tr id="${dateArray[date]}">
				<td><b>Name</b></td>
				<td><b>Hazard</b></td>
				<td><b>Est. Diameter</b></td>
				<td><b>Miss Distance</b></td>
				<td><b>Relative Velocity</b></td>
			</tr>";
		`;

    $("#neoTable tr:last-child").after(rowHeader);

    const distanceChartHTML = getDistanceChartHTML(NEOs[dateArray[date]]);

    for (neo in NEOs[dateArray[date]]) {
      const thisNEO = NEOs[dateArray[date]][neo];
      const missDistanceNumber = Math.round(
        thisNEO.close_approach_data[0].miss_distance.miles
      );
      let missDistanceClass = "green farMiss";

      if (missDistanceNumber <= 250000) {
        missDistanceClass = "red nearMiss";
      } else if (missDistanceNumber <= 2500000) {
        missDistanceClass = "yellow midMiss";
      }

      const missDistanceText = `<span class="${missDistanceClass}">${addCommas(
        missDistanceNumber
      )} mi</span>`;

      const hazard = thisNEO.is_potentially_hazardous_asteroid
        ? '<span class="red hazard">Yes</span>'
        : '<span class="green noHazard">No</span>';

      const estDiameter =
        thisNEO.estimated_diameter.feet.estimated_diameter_min.toFixed(1) +
        " - " +
        thisNEO.estimated_diameter.feet.estimated_diameter_max.toFixed(1) +
        " ft";

      const relativeVelocity =
        addCommas(
          parseInt(
            thisNEO.close_approach_data[0].relative_velocity.miles_per_hour
          ).toFixed(0)
        ) + " mph";

      const row = `
				<tr class="neoRow" id="${thisNEO.id}">
					<td><a href="${thisNEO.nasa_jpl_url}" target="_new">${thisNEO.name}</a></td>
					<td>${hazard}</td>
					<td>${estDiameter}</td>
					<td>${missDistanceText}</td>
					<td>${relativeVelocity}</td>
				</tr>`;

      $("#" + dateArray[date]).after(row);
    }

    var distanceChartRow = `<tr class="spaceMapContainer"><td colspan="99">${distanceChartHTML}</td></tr>`;
    $("#" + dateArray[date]).before(distanceChartRow);
  }
};

// helper functions
const getDistanceChartHTML = (NEOs) => {
  var moonDistance = 238900,
    earth = '<div class="earth"> </div>',
    NEOIcon = '<div class="NEOIcon"> </div>',
    NEOsDistanceArray = [],
    NEODetailArray = [];

  NEOs.forEach((NEO) =>
    NEOsDistanceArray.push(
      Math.round(NEO.close_approach_data[0].miss_distance.miles)
    )
  );
  maxDistance = Math.max(...NEOsDistanceArray);

  if (maxDistance < moonDistance) {
    maxDistance = moonDistance;
  }

  NEOs.forEach(function (NEO) {
    NEOObject = {
      id: NEO.id,
      missPercent: Math.round(
        (NEO.close_approach_data[0].miss_distance.miles / maxDistance) * 100
      ),
    };
    NEOObject.missPercent = rescaleView(NEOObject.missPercent);
    NEODetailArray.push(NEOObject);
  });

  moonPercent = rescaleView(Math.round((moonDistance / maxDistance) * 100));

  var NEOsHTML = "";

  NEODetailArray.forEach(function (NEODetail) {
    NEOsHTML += `<div class="NEOIconContainer" data-neo-id="${NEODetail.id}" style="margin-left:${NEODetail.missPercent}%;">${NEOIcon}</div>`;
  });

  var moon = `<div class="moon" style="margin-left:${moonPercent}%;"> </div>`;
  return `<div class="spaceMap">${earth}${moon}${NEOsHTML}</div>`;
};

const rescaleView = (originalPercent) => {
  var scale = 0.95;
  return originalPercent * scale;
};

const addCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const date_sort_asc = (date1, date2) => {
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

const cleanAndParseData = (data) => {
  // pug does weird things so we need to clean it
  const cleanData = data.replaceAll("&quot;", '"');
  return JSON.parse(cleanData);
};
