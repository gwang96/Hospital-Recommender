function queryData() {
	overlay = null;
	d3.selectAll('.providers').remove();
	var drg = document.getElementById('diag').value;
	var zip = document.getElementById('location').value;
	d3.json('https://hospital-recommender.herokuapp.com/api?drg=' + drg + '&zip=' + zip, (error, data) => {
		console.log(data);
		var providers = [];
		for (var i = 0; i < data.length; i++) {
			addCoord(data[i]['Provider Street Address'] + ' ' + data[i]['Provider City'] + ' '  + data[i]['Provider State'] + ' ' + data[i]['Provider Zip Code'], data[i], providers, data.length);
		}
	});

}

function drawOverlay(data) {
	var providers = [];
	var colors = d3.scale.linear()
		.domain([d3.min(data, (d) => d['Average Total Payments']), d3.max(data, (d) => d['Average Total Payments'])])
		.range(['#d7191c', '#2c7bb6'])
		.interpolate(d3.interpolateHcl);
	console.log(colors);

	overlay = new google.maps.OverlayView();
	overlay.onAdd = function() {
		var layer = d3.select(this.getPanes().overlayLayer).append('div')
				.attr('class', 'providers');

		overlay.draw = function() {
			var projection = this.getProjection();
			var padding = 10;

			var marker = layer.selectAll('svg')
				.data(data)
				.each(transform)
				.enter().append('svg')
					.each(transform)
					.attr('class', 'marker');
			marker.append('circle')
				.attr('r', 5)
				.attr('cx', padding)
				.attr('cy', padding)
				.attr('fill', (d) => colors(d['Average Total Payments']));

			function transform(d) {
				if (d.coord != undefined) {
					var d = new google.maps.LatLng(d.coord.lat, d.coord.lng);
					console.log(d);
					d = projection.fromLatLngToDivPixel(d);
					return d3.select(this)
						.style('left', (d.x - padding) + 'px')
						.style('top', (d.y - padding) + 'px');
				}
			}
		};
	};
	overlay.setMap(map);
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
