import React, { useEffect, useState } from 'react'
import './Settings.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets, url } from '../../assets/assets';

const Settings = ({ adminToken, setAdminToken, adminProfile, setAdminProfile }) => {
  const [image, setImage] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [details, setDetails] = useState({ username: "", email: "" });

  const profileSrc = adminProfile?.profileImage
    ? `${url}/images/${adminProfile.profileImage}`
    : assets.profile_image;

  const onPasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswords((passwords) => ({ ...passwords, [name]: value }));
  }

  const onDetailsChange = (event) => {
    const { name, value } = event.target;
    setDetails((details) => ({ ...details, [name]: value }));
  }

  useEffect(() => {
    if (adminProfile) {
      setDetails({
        username: adminProfile.username || "",
        email: adminProfile.email || "",
      });
    }
  }, [adminProfile]);

  const submitDetails = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/admin/details`, details, { headers: { token: adminToken } });
      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        setAdminToken(response.data.token);
        setAdminProfile(response.data.data);
        toast.success(response.data.message);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Details update failed");
    }
  }

  const submitPhoto = async (event) => {
    event.preventDefault();
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/admin/profile-image`, formData, { headers: { token: adminToken } });
      if (response.data.success) {
        setAdminProfile((profile) => ({ ...profile, profileImage: response.data.data.profileImage }));
        setImage(false);
        toast.success(response.data.message);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile photo update failed");
    }
  }

  const submitPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${url}/api/admin/password`, passwords, { headers: { token: adminToken } });
      if (response.data.success) {
        setPasswords({ currentPassword: "", newPassword: "" });
        toast.success(response.data.message);
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    }
  }

  return (
    <div className='settings add'>
      <h3>Admin Settings</h3>
      <div className='settings-grid'>
        <form className='settings-panel' onSubmit={submitDetails}>
          <h4>Admin Details</h4>
          <input name='username' type='text' placeholder='Username' value={details.username} onChange={onDetailsChange} required />
          <input name='email' type='email' placeholder='Email' value={details.email} onChange={onDetailsChange} required />
          <button type='submit'>Update Details</button>
        </form>

        <form className='settings-panel' onSubmit={submitPhoto}>
          <h4>Profile Photo</h4>
          <img className='settings-avatar' src={image ? URL.createObjectURL(image) : profileSrc} alt="" />
          <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files[0])} />
          <button type='submit'>Update Photo</button>
        </form>

        <form className='settings-panel' onSubmit={submitPassword}>
          <h4>Change Password</h4>
          <input name='currentPassword' type='password' placeholder='Current password' value={passwords.currentPassword} onChange={onPasswordChange} required />
          <input name='newPassword' type='password' placeholder='New password' value={passwords.newPassword} onChange={onPasswordChange} required />
          <button type='submit'>Change Password</button>
        </form>
      </div>
    </div>
  )
}

export default Settings
