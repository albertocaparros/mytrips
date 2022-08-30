import { useLoaderData, Link } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { redirect } from '@remix-run/node';
import { getUser } from '~/utils/session.server';

const demoLocation = {
  location: {
    id: 1,
    title: 'Demo marker',
    visitDate: 'December 21, 1987 21:24:00',
    img: 'https://www.fillmurray.com/640/360',
    lat: 36.834402627271054,
    lng: -2.479881891820917,
    body: 'This is just a Demo to show the functionality! If you want to start creating your own, register a new account.',
  },
  user: null,
};

export const loader = async ({ request, params }) => {
  const user = await getUser(request);

  if (user) {
    const location = await db.location.findUnique({
      where: { id: params.locationId },
    });

    if (!location) throw new Error('Location not found');

    return { location, user };
  } else {
    return demoLocation;
  }
};

export const action = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get('_method') === 'delete') {
    const user = await getUser(request);
    const location = await db.location.findUnique({
      where: { id: params.locationId },
    });

    if (!location) throw new Error('Location not found');

    if (user && location.userId === user.id) {
      await db.location.delete({ where: { id: params.locationId } });
    }

    return redirect('/locations');
  }
};

function Location() {
  const { location, user } = useLoaderData();
  const { userId, title, body, img, visitDate } = location;

  return (
    <div>
      <div className='page-header'>
        <h1>{title}</h1>
        <Link to='/locations' className='btn btn-reverse'>
          Back
        </Link>
      </div>

      <div className='page-content'>
        <img src={img} alt={title}></img>
        <p>{body}</p>
        <sub>
          Visited{' '}
          {new Date(visitDate).toLocaleString('en-GB', {
            dateStyle: 'long',
          })}
        </sub>
      </div>
      <div className='page-footer'>
        {user !== null && user.id === userId && (
          <form method='POST'>
            <input type='hidden' name='_method' value='delete' />
            <button className='btn btn-delete'>Delete</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Location;
