import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { deleteUser, getUser, updateUser } from '../api/user';
import '../assets/css/UserProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showToast = (error) => {
    let errorMessage = "There was an error. Please try again.";
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = "Incorrect email address or password";
          break;
        case 403:
          errorMessage = "You do not have the required permissions.";
          break;
        default:
          errorMessage = `Error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`;
      }
    } else if (error.request) {
      errorMessage = "No response was received from the server.";
    } else {
      errorMessage = "Request error.";
    }

    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
  };
  
  const fetchUser = async () => {
      try {
        const loadedUser = await getUser();
  
        setUser(loadedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        showToast(error)
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
        fetchUser();
    }, []);

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteUser();
        navigate('/');
    } catch (error) {
    console.error("Error fetching user:", error);
    showToast(error);
    }
    // TODO: call API to delete user
    // on success:
  };

  const handleEditProfile = async () => {
    try {
        await updateUser();
          navigate('/');
      } catch (error) {
      console.error("Error fetching user:", error);
      showToast(error);
      }
  }


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="user-profile-page">
      <nav className="navbar">
        <div className="nav-left">
          <span className="logo">BudgetWise</span>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/budgets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Budgets</NavLink>
        </div>
        <div className="nav-right">
          <NavLink to="/user-profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Profile</NavLink>
          <button onClick={handleLogout} className="nav-link logout-btn">Logout</button>
        </div>
      </nav>
      <div className="user-profile-container">
        {loading ? (
            <p className="empty-msg">Loading...</p>
            ) : (
            <div className="user-card">
                <div className="user-avatar"></div>
                <h2>{user.fullName}</h2>
                <p>{user.email}</p>
                <p>Registered: {new Date(user.createdAt).toLocaleDateString()}</p>

                <div className="user-actions">
                <button onClick={() => setShowEditModal(true)}>Edit Profile</button>
                <button className="danger" onClick={() => setShowDeleteModal(true)}>Delete Profile</button>
                </div>
            </div>
        )}

        {showEditModal && (
          <div className="modal-backdrop">
            <div className="modal-form-container">
              <p className="modal-form-title">Edit Profile</p>
              <p className="modal-form-subtitle">Update your information below.</p>
              <form onSubmit={handleEditProfile}>
                <div className="form-group">
                  <input type="text" name="name" defaultValue={user.name} placeholder="New Name" />
                </div>
                <div className="form-group">
                  <input type="password" name="password" placeholder="New Password" />
                </div>
                <div className="modal-button-row">
                  <button type="submit" className="modal-btn primary">Save</button>
                  <button type="button" className="modal-btn cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
          
          
        )}

        {showDeleteModal && (
          <div className="modal-backdrop">
            <div className="modal-form-container">
              <p className="modal-form-title">Delete Profile</p>
              <p className="modal-form-subtitle">
                Are you sure you want to delete your profile?
              </p>
              <div className="modal-button-row">
                <button className="modal-btn danger" onClick={handleDelete}>Yes, Delete</button>
                <button className="modal-btn cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer/>
      </div>
    </div>
  );
};

export default UserProfile;
