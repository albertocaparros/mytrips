import { Children, isValidElement, cloneElement } from 'react';
import { useInitializeMap } from './hooks/useInitializeMap';

function Map({ children }) {
  const { map, ref } = useInitializeMap();

  return (
    <>
      <div ref={ref} style={{ height: '60vh', width: '100%' }} />
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
