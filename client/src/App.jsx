


import { BrowserRouter } from 'react-router-dom'


// import React, {Suspense} from 'react'

// const Login = React.lazy(() => import('./components/log'));
// const Register = React.lazy(() => import('./components/reg'));

import { AppRoutes } from './AppRoutes.jsx';

export default function App() {
  return (
    <>

<BrowserRouter>
      <AppRoutes />
</BrowserRouter>

    </>
  );
}


