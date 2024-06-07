import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginFormPage from './components/LoginFormPage';
// import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';
import Landing from './components/Landing/Landing';
import GroupsFeed from './components/GroupsFeed/GroupsFeed';
import GroupDetails from './components/GroupDetails/GroupDetails';
import EventsFeed from './components/EventsFeed/EventsFeed';
import EventDetails from './components/EventDetails/EventDetails';
import CreateGroupForm from './components/CreateGroupForm/CreateGroupForm';
import UpdateGroupForm from './components/UpdateGroupForm/UpdateGroupForm';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Landing />
      },
      {
        path: 'groups',
        element: <GroupsFeed />
      },
      {
        path: 'groups/:groupId',
        element: <GroupDetails />
      },
      {
        path: 'groups/new',
        element: <CreateGroupForm />
      },
      {
        path: 'groups/:groupId/edit',
        element: <UpdateGroupForm />

      },
      {
        path: 'events',
        element: <EventsFeed />
      },
      {
        path: 'events/:eventId',
        element: <EventDetails />
      }
      // {
      //   path: 'login',
      //   element: <LoginFormPage />
      // },
      // {
      //   path: 'signup',
      //   element: <SignupFormPage />
      // }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
