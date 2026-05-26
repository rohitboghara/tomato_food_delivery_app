import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Login from './pages/Login/Login'
import Settings from './pages/Settings/Settings'
import axios from 'axios'
import { url } from './assets/assets'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || "");
  const [adminProfile, setAdminProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!adminToken) return;
      try {
        const response = await axios.get(`${url}/api/admin/profile`, { headers: { token: adminToken } });
        if (response.data.success) {
          setAdminProfile(response.data.data);
        }
      } catch (error) {
        localStorage.removeItem("adminToken");
        setAdminToken("");
      }
    }
    fetchProfile();
  }, [adminToken]);

  if (!adminToken) {
    return (
      <div className='app'>
        <ToastContainer/>
        <Login setAdminToken={setAdminToken}/>
      </div>
    )
  }

  return (
    <div className='app'>
      <ToastContainer/>
      <Navbar setAdminToken={setAdminToken} adminProfile={adminProfile}/>
      <hr />
      <div className="app-content">
        <Sidebar/>
        <Routes>
          <Route path="/add" element={<Add adminToken={adminToken}/>}/>
          <Route path="/list" element={<List adminToken={adminToken}/>}/>
          <Route path="/orders" element={<Orders adminToken={adminToken}/>}/>
          <Route path="/settings" element={<Settings adminToken={adminToken} setAdminToken={setAdminToken} adminProfile={adminProfile} setAdminProfile={setAdminProfile}/>}/>
        </Routes>
      </div>
    </div>
  )
}

export default App
