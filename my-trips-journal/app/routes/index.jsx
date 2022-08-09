import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Map from './maps/Map';
import Marker from './maps/Marker';
import { useLoaderData } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async () => {
  const data = {
    locations: await db.location.findMany({
      take: 20,
      select: {
        id: true,
        title: true,
        createdAt: true,
        img: true,
        lat: true,
        lng: true,
        body: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  };
  return data;
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
        <Wrapper
          apiKey={'AIzaSyByC8GQGdIOKP2jv2CFmMJNpQDb38Eic5I'}
          render={render}>
          <Map>
            {locations.map((location) => (
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
