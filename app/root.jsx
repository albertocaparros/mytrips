import {
  Outlet,
  LiveReload,
  Link,
  Links,
  Meta,
  useLoaderData,
  Scripts,
} from '@remix-run/react';
import globalStylesUrl from '~/styles/global.css';
import { getUser } from '~/utils/session.server';

export const links = () => [{ rel: 'stylesheet', href: globalStylesUrl }];
export const meta = () => {
  const description = 'Travel journal with google Maps';
  const keywords = 'google, maps, travel, journal, memories, keep';

  return { description, keywords };
};

export const loader = async ({ request }) => {
  const user = await getUser(request);

  return { user };
};

export default function App() {
  return (
    <Document title='My travel journal'>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links></Links>
        <title>{title ? title : 'Add title to App'}</title>
      </head>
      <body>
        {children}
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }) {
  const { user } = useLoaderData();

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='logo'>
          My travel journal
        </Link>

        <ul className='nav'>
          <li>
            <Link to='/Map'>Map</Link>
          </li>
          <li>
            <Link to='/Locations'>Locations</Link>
          </li>
          {user ? (
            <li>
              <form action='/auth/logout' method='POST'>
                <button className='btn' type='submit'>
                  {' '}
                  Logout {user.username}
                </button>
              </form>
            </li>
          ) : (
            <li>
              <Link to='/auth/login'>Login</Link>
            </li>
          )}
        </ul>
      </nav>

      <div className='container'>{children}</div>
    </>
  );
}

export function ErrorBoundary({ error }) {
  return (
    <Document>
      <Layout>
        <h1>Error</h1>
        <p>{error.message}</p>
      </Layout>
    </Document>
  );
}
