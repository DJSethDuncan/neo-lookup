$(document).ready(function(){

	$('.buttonHazardOnly').click(function() {
		$('.noHazard').parents('.neoRow').toggle();
		// make button active
	});

	$('.buttonNearOnly').click(function() {
		$('.midMiss, .farMiss').parents('.neoRow').toggle();
		// make button active
	});

	$(document).on('mouseenter','#neoTable .NEOIconContainer', function(){
		var targetID = $(this).data('neo-id')
		$('.neoRow').removeClass('highlightNEO')
		$('#neoTable #' + targetID).addClass('highlightNEO')
	})

	$(document).on('mouseleave','#neoTable .NEOIconContainer', function(){
		$('.neoRow').removeClass('highlightNEO')
	})
});

function displayNEOs (data) {

	$('#loading').hide();

	var NEOs = data.near_earth_objects;
	var dateArray = [];

	for (date in NEOs) {
		dateArray.push(date);
	}

	dateArray.sort(date_sort_asc);

	for (date in dateArray) {

		var rowHeader = '';

		rowHeader += '<tr><td style="height:30px;">&nbsp;</td></tr>';
		rowHeader += '<tr><td colspan="99" style="text-align:center;"><h1>' + dateArray[date] + '</h1></td></tr>'
		rowHeader += '<tr id="' + dateArray[date] + '">';
			rowHeader += '<td><b>Name</b></td>';
			rowHeader += '<td><b>Hazard</b></td>';
			rowHeader += '<td><b>Est. Diameter</b></td>';
			rowHeader += '<td><b>Miss Distance</b></td>';
			rowHeader += '<td><b>Relative Velocity</b></td>';
		rowHeader += '</tr>';

		$('#neoTable tr:last-child').after(rowHeader);

		var distanceChartHTML = getDistanceChartHTML(NEOs[dateArray[date]])

		for (neo in NEOs[dateArray[date]]) {

			var thisNEO = NEOs[dateArray[date]][neo];
			var missDistanceNumber = Math.round(thisNEO.close_approach_data[0].miss_distance.miles);
			var missDistanceClass = 'green farMiss'

			if (missDistanceNumber <= 250000) {
				missDistanceClass = 'red nearMiss';
			} else if (missDistanceNumber <= 2500000) {
				missDistanceClass = 'yellow midMiss';
			}

			var missDistanceText = '<span class="' + missDistanceClass + '">' + addCommas(missDistanceNumber) + ' mi</span>';
			var hazard = (thisNEO.is_potentially_hazardous_asteroid) ? '<span class="red hazard">Yes</span>' : '<span class="green noHazard">No</span>';
			var estDiameter = thisNEO.estimated_diameter.feet.estimated_diameter_min.toFixed(1) + ' - ' + thisNEO.estimated_diameter.feet.estimated_diameter_max.toFixed(1) + ' ft';
			var relativeVelocity = addCommas(parseInt(thisNEO.close_approach_data[0].relative_velocity.miles_per_hour).toFixed(0)) + ' mph';

			var row = '';

			row += '<tr class="neoRow" id="' + thisNEO.id + '">';
			row += '<td><a href="' + thisNEO.nasa_jpl_url + '" target="_new">' + thisNEO.name + '</a></td>';
			row += '<td>' + hazard + '</td>';
			row += '<td>' + estDiameter + '</td>';
			row += '<td>' + missDistanceText + '</td>';
			row += '<td>' + relativeVelocity + '</td>';
			row += '</tr>';

			$('#' + dateArray[date]).after(row);
		}

		var distanceChartRow = '<tr class="spaceMapContainer"><td colspan="99">' + distanceChartHTML + '</td></tr>'
		$('#' + dateArray[date]).before(distanceChartRow)

	}

}

function getDistanceChartHTML (NEOs) {
	
	var moonDistance = 238900,
	earth = '<div class="earth"> </div>',
	NEOIcon = '<div class="NEOIcon"> </div>',
	NEOsDistanceArray = [],
	NEODetailArray = []

	NEOs.forEach(NEO => NEOsDistanceArray.push(Math.round(NEO.close_approach_data[0].miss_distance.miles)))
	maxDistance = Math.max(...NEOsDistanceArray)
	
	if (maxDistance < moonDistance) { maxDistance = moonDistance }
	
	NEOs.forEach(function(NEO) {
		NEOObject = {
			id: NEO.id,
			missPercent: Math.round((NEO.close_approach_data[0].miss_distance.miles/maxDistance) * 100)
		}
		NEOObject.missPercent = rescaleView(NEOObject.missPercent)
		NEODetailArray.push(NEOObject)
	})
	
	moonPercent = rescaleView(Math.round((moonDistance/maxDistance) * 100))
	
	var moon = '<div class="moon" style="margin-left:' + moonPercent + '%;"> </div>'
	var html = '<div class="spaceMap">'
	html += earth
	html += moon
	
	NEODetailArray.forEach(function (NEODetail) {
		html += '<div class="NEOIconContainer" data-neo-id="' + NEODetail.id + '" style="margin-left:' + NEODetail.missPercent + '%;">' + NEOIcon + '</div>'
	})
	
	html += '</div>'
	
	return html
}

function rescaleView(originalPercent) {
	var scale = .95
	return originalPercent * scale
}

function addCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var date_sort_asc = function (date1, date2) {
	if (date1 > date2) return 1;
	if (date1 < date2) return -1;
	return 0;
}
