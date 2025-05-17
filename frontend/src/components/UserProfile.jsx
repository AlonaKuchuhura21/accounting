import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { deleteUser, getCurrentUser, updateUser } from '../api/user';
import '../assets/css/UserProfile.css';
import Navigation from './common/Navigation';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const showToast = (error) => {
    let errorMessage = "There was an error. Please try again.";
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = "Unauthorized.";
          break;
        case 403:
          errorMessage = "Access denied.";
          break;
        default:
          errorMessage = `Error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`;
      }
    } else if (error.request) {
      errorMessage = "No response received.";
    } else {
      errorMessage = "Request error.";
    }

    toast.error(errorMessage, {
      position: "bottom-right",
      autoClose: 4000,
      transition: Bounce,
    });
  };

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user:", error);
      showToast(error);
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
      console.error("Error deleting user:", error);
      showToast(error);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const form = e.target;
    const fullName = form.name.value.trim();
    const password = form.password.value.trim();

    try {
      await updateUser({ fullName, password: password || null });
      setShowEditModal(false);
      await fetchUser();
    } catch (error) {
      console.error("Error updating user:", error);
      showToast(error);
    }
  };

  return (
    <div className="user-profile-page">
      <Navigation />
      <div className="user-profile-container">
        {loading ? (
          <p className="empty-msg">Loading...</p>
        ) : (
          <div className="user-card">
            <div className="user-avatar">
            {user.fullName?.split(" ").map(n => n[0]).join("")}
            </div>
            <p>{user.email}</p>
            <p>Registered: {new Date(user.createdAt).toLocaleDateString()}</p>
            <div className="user-actions">
              <button onClick={() => setShowEditModal(true)}>Edit Profile</button>
              <button className="danger" onClick={() => setShowDeleteModal(true)}>Delete Profile</button>
            </div>
          </div>
        )}

        {showEditModal && user && (
          <div className="modal-backdrop">
            <div className="modal-form-container">
              <p className="modal-form-title">Edit Profile</p>
              <p className="modal-form-subtitle">Update your information below.</p>
              <form onSubmit={handleEditProfile}>
                <div className="form-group">
                  <input type="text" name="name" defaultValue={user.fullName} placeholder="New Name" />
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
              <p className="modal-form-subtitle">Are you sure you want to delete your profile?</p>
              <div className="modal-button-row">
                <button className="modal-btn danger" onClick={handleDelete}>Yes, Delete</button>
                <button className="modal-btn cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default UserProfile;
