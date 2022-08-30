import { useLoaderData, Link } from '@remix-run/react';
import { getUserLocations } from '~/utils/session.server';

export const loader = async ({ request }) => {
  return getUserLocations(request);
};

function LocationsItems() {
  const { locations } = useLoaderData();

  return (
    <>
      <div className='page-header'>
        <h1>Locations</h1>
        <Link to='/locations/new' className='btn'>
          New Location
        </Link>
      </div>
      {locations && (
        <ul className='locations-list'>
          {locations.map((location) => (
            <li key={location.id}>
              <Link to={location.id.toString()}>
                <h3>{location.title}</h3>
                <p>{location.body}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default LocationsItems;
