import React, { useState } from 'react'
import './Login.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets';

const Login = ({ setAdminToken }) => {
  const [data, setData] = useState({ email: "", password: "" });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/admin/login`, data);
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        setAdminToken(response.data.token);
        toast.success("Admin logged in");
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className='admin-login'>
      <form onSubmit={onSubmitHandler} className='admin-login-form'>
        <h2>Admin Login</h2>
        <input name='email' type='text' placeholder='Email or username' value={data.email} onChange={onChangeHandler} required />
        <input name='password' type='password' placeholder='Password' value={data.password} onChange={onChangeHandler} required />
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login
