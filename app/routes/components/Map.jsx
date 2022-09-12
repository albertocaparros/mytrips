import { Children, isValidElement, cloneElement, useEffect } from 'react';
import { useInitializeMap } from '../map/hooks/useInitializeMap';

function Map({ children, onClickMap }) {
  const { map, ref } = useInitializeMap();

  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) =>
        window.google.maps.event.clearListeners(map, eventName)
      );
      if (onClickMap) {
        map.addListener('click', onClickMap);
      }
    }
  }, [map, onClickMap]);

  return (
    <>
      <div ref={ref} style={{ minHeight: '80vh', width: '100%' }} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </>
  );
}

export default Map;
