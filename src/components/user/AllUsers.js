import './AllUsers.css';
import { useQuery } from '@tanstack/react-query';
import { GetAllUsers } from '../../services/UserServices';
import { useContext, useState } from 'react';
import AuthContext from '../../guards/AuthProvider';
import { useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const AllUsers = () => {

  const { user } = useContext(AuthContext);
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['allUsers', user.token],
    queryFn: GetAllUsers
  });

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data)) {
      setAllUsers(prev => {
        return ([...prev, ...data.data])
      })
    }
  }, [data]);

  if (isError) {
    toast("Error : ", error);
  }

  return (
    <div className="container my-5 text-white">
      <ToastContainer />
      <div className="row">
        <div className="col-12">
          <h2 className="h3 font-weight-bold text-left">All Users</h2>
        </div>
      </div>
      <div className="row">

        {
          isLoading ?
            (<p>Loading...</p>) : (
              allUsers.length > 0 ? allUsers.map((item, index) => {
                return (
                  <div className="col-md-4 col-sm-6 mb-4" key={index}>
                    <div className="user-card p-3">
                      <img src={`https://cloud.appwrite.io/v1/avatars/initials?name=${item.name}&amp;project=65c8d4500c7cf523e70d` || "profile-placeholder.svg"} alt="profilePic" className="img-fluid mb-3" />
                      <h4>{item.name}</h4>
                      <p className="text-white-50">@{item.email}</p>
                      <button className="btn follow-btn" onClick={() => { navigate('/userProfile', { state: item.id }) }}>View Profile</button>
                    </div>
                  </div>
                )
              }) : (<p>No Users Available !!</p>)

            )
        }
      </div>
    </div>
  );
};

export default AllUsers;
