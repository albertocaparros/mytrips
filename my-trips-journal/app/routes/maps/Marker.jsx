import { useState, useEffect } from 'react';

function Marker(options) {
  const [marker, setMarker] = useState();

  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);
  useEffect(() => {
    if (marker) {
      marker.setOptions(options);

      marker.addListener('click', (e) => {
        var infowindow = new window.google.maps.InfoWindow();

        infowindow.setContent(
          `<div><h1>${options.info.title}</h1><p>${options.info.body}</p><img src="${options.info.img}" class="tripImg"/></div>`
        );
        infowindow.open(options.map, marker);
      });
    }
  }, [marker, options]);

  return null;
}

export default Marker;
