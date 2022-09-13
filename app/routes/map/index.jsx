import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Map from '../components/Map';
import Marker from '../components/Marker';
import Loader from '../components/Loader';
import { useLoaderData } from '@remix-run/react';
import { getUserMarkers } from '~/utils/session.server';

export const loader = async ({ request }) => {
  const env = {
    ENV: {
      GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
    },
  };

  const locations = await getUserMarkers(request);

  console.log(locations);
  return { locations, env };
};

function Maps() {
  const { locations, env } = useLoaderData();

  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return <Loader />;
      case Status.FAILURE:
        return <p>Google maps is not able to load 🤔</p>;
      case Status.SUCCESS:
        return <Map />;
    }
  };

  return (
    <div className='page-content flex-container'>
      <Wrapper
        className='two-column-flex-item'
        apiKey={env.ENV.GOOGLE_MAP_API_KEY}
        render={render}>
        <Map>
          {locations &&
            locations.locations.map((location) => (
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
