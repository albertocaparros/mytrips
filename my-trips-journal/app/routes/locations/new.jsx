import { Link, useActionData } from '@remix-run/react';
import { redirect, json } from '@remix-run/node';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

function validateTitle(title) {
  if (typeof title !== 'string' || title.length < 3) {
    return 'Title should be at least 3 characters long';
  }
}

function validateBody(body) {
  if (typeof body !== 'string' || body.length < 10) {
    return 'Body should be at least 10 characters long';
  }
}

function badRequest(data) {
  return json(data, { status: 400 });
}

export const action = async ({ request }) => {
  const form = await request.formData();
  const title = form.get('title');
  const body = form.get('body');
  const img = form.get('img');
  const lat = form.get('lat');
  const lng = form.get('lng');
  const visitDate = form.get('visitDate');
  const user = await getUser(request);

  const fields = { title, body, img, lat, lng, visitDate };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return badRequest({ fieldErrors, fields });
  }

  console.log(fields);

  const location = await db.location.create({
    data: {
      ...fields,
      lat: Number(lat),
      lng: Number(lng),
      visitDate: new Date(visitDate),
      userId: user.id,
    },
  });

  return redirect(`/locations/${location.id}`);
};

function NewLocation() {
  const actionData = useActionData();

  return (
    <>
      <div className='page-header'>
        <h1>New Location</h1>
        <Link to='/locations' className='btn btn-reverse'>
          Back
        </Link>
      </div>

      <div className='page-content'>
        <form method='POST'>
          <div className='form-control'>
            <label htmlFor='title'>Title</label>
            <input
              type='text'
              name='title'
              id='title'
              defaultValue={actionData?.fields?.title}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.title && actionData.fieldErrors.title}
              </p>
            </div>
          </div>
          <div className='form-control'>
            <label htmlFor='img'>Picture URL</label>
            <input
              type='text'
              name='img'
              id='img'
              defaultValue={actionData?.fields?.img}
            />
          </div>
          <div className='form-control'>
            <label htmlFor='lat'>Latitude</label>
            <input
              type='text'
              name='lat'
              id='lat'
              defaultValue={actionData?.fields?.lat}
            />
          </div>
          <div className='form-control'>
            <label htmlFor='lng'>Longitude</label>
            <input
              type='text'
              name='lng'
              id='lng'
              defaultValue={actionData?.fields?.lng}
            />
          </div>
          <div className='form-control'>
            <label htmlFor='visitDate'>Visit date</label>
            <input
              type='date'
              name='visitDate'
              id='visitDate'
              defaultValue={actionData?.fields?.visitDate}
            />
          </div>
          <div className='form-control'>
            <label htmlFor='body'>Location body</label>
            <textarea
              name='body'
              id='body'
              defaultValue={actionData?.fields?.body}
            />
            <div className='error'>
              <p>
                {actionData?.fieldErrors?.body && actionData.fieldErrors.body}
              </p>
            </div>
          </div>
          <button type='submit' className='btn btn-block'>
            Add location
          </button>
        </form>
      </div>
    </>
  );
}

export default NewLocation;
