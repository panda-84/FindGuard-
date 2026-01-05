import './App.css'
import Homepage from './components/Homepage'
import NavBar from './components/NavBar'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'

import { Register } from './components/reg'
import { Login } from './components/log'
import UserTable from './pages/UserTable'

function App() {
  return (
    <>
    <NavBar/>  
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/userlist' element={<UserTable/>}/>
    </Routes>
    </>
  );
}

export default App
