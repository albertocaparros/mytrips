import { useLoaderData, Link } from '@remix-run/react';
import { db } from '~/utils/db.server';

export const loader = async () => {
  const data = {
    locations: await db.location.findMany({
      take: 20,
      select: { id: true, title: true, body: true },
      orderBy: { createdAt: 'desc' },
    }),
  };
  return data;
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
    </>
  );
}

export default LocationsItems;
