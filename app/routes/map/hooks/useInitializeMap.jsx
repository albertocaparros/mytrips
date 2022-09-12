import { useEffect, useRef, useState } from 'react';
import mapStyle from '../../../styles/mapStyle';

export const useInitializeMap = () => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    const initialCenter = new window.google.maps.LatLng(52.50697, 13.2843075);
    const initialZoom = 4;

    if (ref.current && !map) {
      setMap(
        new window.google.maps.Map(ref.current, {
          zoom: initialZoom,
          center: initialCenter,
        })
      );
    }
  }, [ref, map]);

  useEffect(() => {
    if (ref.current && map) {
      map.set('styles', mapStyle);
    }
  }, [map]);

  return { map, ref };
};
