
import Homepage from './components/Homepage'
import NavBar from './components/NavBar'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'

import { Register } from './pages/public/reg'
import { Login } from './pages/public/log'
import UserTable from './pages/UserTable'
// import React, {Suspense} from 'react'

// const Login = React.lazy(() => import('./components/log'));
// const Register = React.lazy(() => import('./components/reg'));


function App() {
  return (
    <>
    {/* <NavBar/>   */}
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </>
  );
}

export default App
