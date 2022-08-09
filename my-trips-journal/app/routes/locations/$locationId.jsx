import { useLoaderData, Link } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { redirect } from '@remix-run/node';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request, params }) => {
  const user = await getUser(request);
  const location = await db.location.findUnique({
    where: { id: params.locationId },
  });

  if (!location) throw new Error('Location not found');

  return { location, user };
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

  return (
    <div>
      <div className='page-header'>
        <h1>{location.title}</h1>
        <Link to='/locations' className='btn btn-reverse'>
          Back
        </Link>
      </div>

      <div className='page-content'>
        <p>{location.body}</p>
      </div>

      <div className='page-footer'>
        {user !== null && user.id === location.userId && (
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
