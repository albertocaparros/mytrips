import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Map from '../components/Map';
import Marker from '../components/Marker';
import { useLoaderData } from '@remix-run/react';
import keyInfo from '../../apiKey.json';
import { getUserMarkers } from '~/utils/session.server';

export const loader = async ({ request }) => {
  return await getUserMarkers(request);
};

function Maps() {
  const { locations } = useLoaderData();

  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return <p>Loading</p>;
      case Status.FAILURE:
        return <p>Failure</p>;
      case Status.SUCCESS:
        return <Map />;
    }
  };

  return (
    <div className='page-content flex-container'>
      <Wrapper
        className='two-column-flex-item'
        apiKey={keyInfo.apiKey}
        render={render}>
        <Map>
          {locations &&
            locations.map((location) => (
              <Marker
                key={location.id}
                options={{
                  position: { lat: location.lat, lng: location.lng },
                }}
                info={location}></Marker>
            ))}
        </Map>
      </Wrapper>
    </div>
  );
}

export default Maps;
