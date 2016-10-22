var svg = d3.select('body').append('svg')
	.attr('width', 80)
	.attr('height', 400)
	.attr('class', 'legend');
var legend = svg.append('g')
		.attr('transform', 'translate(10,100)')
	.append('defs')
	.append('svg:linearGradient')
		.attr('id', 'gradient')
		.attr('x1', '100%')
		.attr('y1', '0%')
		.attr('x2', '100%')
		.attr('y2', '100%')
		.attr('spreadMethod', 'pad');
svg.append('text')
	.attr('y', 11)
	.text('High Cost');
svg.append('text')
	.attr('y', 330)
	.text('Low Cost');
legend.append('stop')
	.attr('offset', '0%')
	.attr('stop-color', '#ff5c33')
	.attr('stop-opacity', 1);
legend.append('stop')
	.attr('offset', '100%')
	.attr('stop-color', '#adebad')
	.attr('stop-opacity', 1);
svg.append('rect')
	.attr('width', 50)
	.attr('height', 300)
	.attr('y', 5)
	.style('fill', 'url(#gradient)')
	.attr('transform', 'translate(0,10)');

function queryData() {
	overlay = null;
	d3.selectAll('.providers').remove();
	var drg = document.getElementById('diag').value;
	var city = document.getElementById('location').value;
	if (city == '') {
		center = 'us';
		zoom = 4;
	} else {
		center = city + ',us';
		zoom = 10;
	}
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': center}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			map.setZoom(zoom);
		}
	})
	d3.json('https://hospital-recommender.herokuapp.com/api?drg=' + drg + '&city=' + city, (error, data) => {
		console.log(data);
		var providers = [];
		for (var i = 0; i < data.length; i++) {
			addCoord(data[i]['Provider Street Address'] + ' ' + data[i]['Provider City'] + ' '  + data[i]['Provider State'] + ' ' + data[i]['Provider Zip Code'], data[i], providers, data.length);
		}
	});

}

function drawOverlay(data) {
	var colors = d3.scale.linear()
		.domain([d3.min(data, (d) => d['Average Total Payments']), d3.max(data, (d) => d['Average Total Payments'])])
		.range(['#adebad', '#ff5c33'])
		.interpolate(d3.interpolateHcl);
	console.log(colors);
	var infowindow = new google.maps.InfoWindow();
	for (var i = 0; i < data.length ; i++) {
		var contentString = '<h3>' + data[i]['Provider Name'] + '</h3>'  + '<p> Address: ' + data[i]['Provider Street Address'] + ', ' + data[i]['Provider City'] + ', ' + data[i]['Provider State'] + " " + data[i]['Provider Zip Code'] + '</p>' + '<p1> Average Total Payments: $' + parseFloat(data[i]['Average Total Payments']).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')  + '</p1>' + '<br><br>' + '<p2> Total Discharges:' + data[i]['Total Discharges'] + '<p2>';
		var circle = {
			path: 'M-5,0a5,5 0 1,0 10,0a5,5 0 1,0 -10,0',
			fillColor: colors(data[i]['Average Total Payments']),
			fillOpacity: 1
		}
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(data[i].coord.lat, data[i].coord.lng),
			icon: circle,
			map: map
		});

		google.maps.event.addListener(marker, 'mouseover', (function(marker, contentString, infowindow) {
			return function() {
				infowindow.setContent(contentString);
				infowindow.open(map, marker);
			}
		})(marker, contentString, infowindow));
		google.maps.event.addListener(marker, 'mouseout', function() {
			infowindow.close();
		});
	}


}

function addCoord(addr, obj, list, length) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address':addr}, function(results, status) {
		var coord = {};
		if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
			setTimeout(function(){
				console.log('waiting');
				addCoord(addr, obj, list, length);
			}, 200);
		} else {
			if (results != null) {
				coord.lat = results[0].geometry.location.lat();
				coord.lng = results[0].geometry.location.lng();
			}
			obj.coord = coord;
			list.push(obj);
			if (list.length == length) {
				drawOverlay(list);
			}
		}
	});
}
function initMap() {
	var center = new google.maps.LatLng(41.850033, -95.6500523);
	map = new google.maps.Map(document.getElementById('map'), {
									zoom: 4,
									mapTypeId: google.maps.MapTypeId.ROADMAP,
									center: center});
}
