import { useLoaderData, Link } from '@remix-run/react';
import { db } from '~/utils/db.server';
import { redirect } from '@remix-run/node';
import { getUser } from '~/utils/session.server';

export const loader = async ({ request, params }) => {
  const user = await getUser(request);
  const post = await db.post.findUnique({ where: { id: params.postId } });

  if (!post) throw new Error('Post not found');

  return { post, user };
};

export const action = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get('_method') === 'delete') {
    const user = await getUser(request);
    const post = await db.post.findUnique({ where: { id: params.postId } });

    if (!post) throw new Error('Post not found');

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id: params.postId } });
    }

    return redirect('/posts');
  }
};

function Post() {
  const { post, user } = useLoaderData();

  return (
    <div>
      <div className='page-header'>
        <h1>{post.title}</h1>
        <Link to='/posts' className='btn btn-reverse'>
          Back
        </Link>
      </div>

      <div className='page-content'>
        <p>{post.body}</p>
      </div>

      <div className='page-footer'>
        {user.id === post.userId && (
          <form method='POST'>
            <input type='hidden' name='_method' value='delete' />
            <button className='btn btn-delete'>Delete</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Post;
