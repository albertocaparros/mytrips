import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Map from './maps/Map';
import Marker from './maps/Marker';
import { useLoaderData } from '@remix-run/react';
import keyInfo from '../apiKey.json';
import { getUserMarkers } from '~/utils/session.server';

export const loader = async ({ request }) => {
  return await getUserMarkers(request);
};

function Home() {
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
    <div>
      <h1>Welcome to this journal application</h1>
      <p>
        This is a work in progress, when it's finish it will allow you to keep
        track of your trips around the world using google maps
      </p>
      <div>
        <Wrapper apiKey={keyInfo.apiKey} render={render}>
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
    </div>
  );
}

export default Home;
