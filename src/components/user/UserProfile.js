import React, { useContext, useEffect, useState } from 'react'
import Sidenav from "../basic/navigation/Sidenav";
import CreatePostModal from "../posts/CreatePostModal";
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../guards/AuthProvider';
import { GetUserById } from '../../services/UserServices';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function UserProfile() {

  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [writeAccess, setWriteAccess] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [token, setToken] = useState(user.token);
  const [loader, setLoader] = useState(false);

  const id = location.state || {};       //destructure the props state

  useEffect(() => {
    setToken(user.token);

    if (!location.state) {
      setWriteAccess(true);
      fetchUser(user.id);
    }
    else {
      fetchUser(id);
    }
  }, [user, location.state]);

  const fetchUser = async (id) => {
    setLoader(true);
    const response = await GetUserById({ id, token });

    if (response) {
      if (!response.hasError) {
        setProfile(response.data);
      }
      else {
        toast("Error : ", response.message);
      }
    }
    setLoader(false);
  }

  const openCreatePostModal = () => {
    setShowPostModal(true);
  }
  const closeCreatePostModal = () => {
    setShowPostModal(false);
  }

  return (
    <>
      <br /><br />
      <Sidenav openCreatePostModal={openCreatePostModal} />

      {
        showPostModal && <CreatePostModal closeCreatePostModal={closeCreatePostModal} />
      }

      <div className="col-4 offset-3">
        <ToastContainer />
        <div className="timeline p-4">
          <img src={`https://cloud.appwrite.io/v1/avatars/initials?name=${profile.name}&amp;project=65c8d4500c7cf523e70d`} alt="profilePic" className="img-fluid rounded-circle" style={{ width: '10rem', height: '10rem' }} />
          <br />
          {
            loader && <div>
              <h3 className='text-white'>Loading...</h3>
            </div>
          }
          {
            !loader &&

            <div className="flex-center flex-col gap-1 m-3">
              <p className="mb-1 base-medium text-white text-left">
                {profile.name}
              </p>
              <p className="small-regular text-white-50 bg-dark text-left">
                @{profile.email}
              </p>
              {writeAccess && <button><img src='edit.svg' alt='edit' />Edit Profile</button>}
            </div>
          }
        </div>
        <br />
        <div>

        </div>
        <br />
      </div>


    </>

  );
}


export default UserProfile
