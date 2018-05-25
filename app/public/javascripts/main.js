$(document).ready(function(){

});

function displayNEOs (data) {
	var NEOs = data.near_earth_objects;
	var dateArray = [];

	for (date in NEOs) {
		dateArray.push(date);
	}

	dateArray.sort(date_sort_asc);

	console.log(dateArray);

	for (date in NEOs) {
		$('#neoTable').after('<tr id="' + date + '"><td style="padding-top:20px;"><b>' + date + '</b></td><td>Name</td><td>Hazard</td><td>Est. Diameter</td><td>Miss Distance</td></tr>');

		for (neo in NEOs[date]) {
			thisNEO = NEOs[date][neo];
			hazard = (thisNEO.is_potentially_hazardous_asteroid) ? 'Yes' : 'No';
			estDiameter = thisNEO.estimated_diameter.feet.estimated_diameter_min.toFixed(1) + ' - ' + thisNEO.estimated_diameter.feet.estimated_diameter_max.toFixed(1) + ' ft';
			missDistance = addCommas(thisNEO.close_approach_data[0].miss_distance.miles) + ' mi';
			$('#' + date).after('<tr><td></td><td><a href="' + thisNEO.nasa_jpl_url + '" target="_new">' + thisNEO.name + '</a></td><td>' + hazard + '</td><td>' + estDiameter + '</td><td>' + missDistance + '</td></tr>');
		}

	}

}

function addCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var date_sort_asc = function (date1, date2) {
	if (date1 > date2) return 1;
	if (date1 < date2) return -1;
	return 0;
}
