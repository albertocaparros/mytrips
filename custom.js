$(function() {
  function initMap() {
    $.getJSON('map-style.json', function(mapStyle) {
      $.getJSON('locations.json', function(locations) {
        var location = new google.maps.LatLng(36.8415612, -2.4746691);
        var bounds = new google.maps.LatLngBounds();
        var markers = [];

        var mapCanvas = document.getElementById('map');
        var mapOptions = {
          center: location,
          zoom: 3,
          panControl: true,
          scrollwheel: true,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);

        var image = './img/flag.png';

        var infoContent = '';

        for (i = 0; i < locations.length; i++) {
          var infowindow = new google.maps.InfoWindow();

          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(
              locations[i].lat,
              locations[i].long
            ),
            map: map,
            icon: image
          });

          bounds.extend(marker.position);

          infoContent =
            '<div class="infoContent">' +
            '<h2 >' +
            locations[i].name +
            '</h2>' +
            '<p>' +
            locations[i].info +
            '</p>' +
            '<img src=' +
            locations[i].img +
            ' class="tripImg">' +
            '</img>' +
            '</div>';

          marker.html = infoContent;

          google.maps.event.addListener(
            marker,
            'click',
            (function(marker) {
              return function() {
                infowindow.setContent(this.html);
                infowindow.open(map, marker);
                map.panTo(marker.position);
                map.setZoom(7);
              };
            })(marker, i)
          );

          var item =
            "<button class='dropdown-item' type='button' id=place-" +
            locations[i].id +
            ' data-id=' +
            locations[i].id +
            '>' +
            locations[i].name +
            '</button>';
          if (locations[i].continent === 'europe') {
            $('#europe-locations').append(item);
          } else if (locations[i].continent === 'asia') {
            $('#asia-locations').append(item);
          }

          markers.push(marker);
        }

        map.fitBounds(bounds);

        var styles = mapStyle;
        map.set('styles', styles);

        $('#europe').click(function() {
          map.panTo(new google.maps.LatLng(52.50697, 13.2843075));
          map.setZoom(4);
          infowindow.close();
        });

        $('#asia').click(function() {
          map.panTo(new google.maps.LatLng(1.3439166, 103.7538334));
          map.setZoom(3);
          infowindow.close();
        });

        for (i = 0; i < markers.length; i++) {
          $('#place-' + i).click(function() {
            google.maps.event.trigger(
              markers[$(this).context.dataset.id],
              'click'
            );
            map.panTo(markers[$(this).context.dataset.id].position);
            map.setZoom(7);
          });
        }

        google.maps.event.addListener(map, 'click', function(event) {
          infowindow.close();
        });
      });
    });
  }

  google.maps.event.addDomListener(window, 'load', initMap);
});
