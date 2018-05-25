$(document).ready(function(){

});

function displayNEOs (data) {
	var NEOs = data.near_earth_objects;
	var dateArray = [];

	console.log(NEOs);

	for (date in NEOs) {
		dateArray.push(date);
	}

	dateArray.sort(date_sort_asc);

	for (date in dateArray) {

		var rowHeader = '';
		rowHeader += '<tr><td style="height:30px;">&nbsp;</td></tr>';
		rowHeader += '<tr id="' + dateArray[date] + '">';
		rowHeader += '<td style="height:1em;"><b>' + dateArray[date] + '</b></td>';
		rowHeader += '<td><b>Name</b></td>';
		rowHeader += '<td><b>Hazard</b></td>';
		rowHeader += '<td><b>Est. Diameter</b></td>';
		rowHeader += '<td><b>Miss Distance</b></td>';
		rowHeader += '<td><b>Relative Velocity</b></td>';
		rowHeader += '<td><b>Orbits</b></td>';
		rowHeader += '</tr>';

		$('#neoTable tr:last-child').after(rowHeader);

		for (neo in NEOs[dateArray[date]]) {

			thisNEO = NEOs[dateArray[date]][neo];
			hazard = (thisNEO.is_potentially_hazardous_asteroid) ? '<span class="red">Yes</span>' : '<span class="green">No</span>';
			estDiameter = thisNEO.estimated_diameter.feet.estimated_diameter_min.toFixed(1) + ' - ' + thisNEO.estimated_diameter.feet.estimated_diameter_max.toFixed(1) + ' ft';
			missDistance = addCommas(thisNEO.close_approach_data[0].miss_distance.miles) + ' mi';
			relativeVelocity = addCommas(parseInt(thisNEO.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0)) + ' mph';
			orbits = thisNEO.close_approach_data[0].orbiting_body;

			var row = '';

			row += '<tr>';
			row += '<td></td>';
			row += '<td><a hrf="' + thisNEO.nasa_jpl_url + '" target="_new">' + thisNEO.name + '</a></td>';
			row += '<td>' + hazard + '</td>';
			row += '<td>' + estDiameter + '</td>';
			row += '<td>' + missDistance + '</td>';
			row += '<td>' + relativeVelocity + '</td>';
			row += '<td>' + orbits + '</td>';
			row += '</tr>';

			$('#' + dateArray[date]).after(row);
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
