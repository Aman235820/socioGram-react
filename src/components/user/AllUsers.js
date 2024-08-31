import './AllUsers.css';
import { useQuery } from '@tanstack/react-query';
import { GetAllUsers } from '../../services/UserServices';
import { useContext, useState } from 'react';
import AuthContext from '../../guards/AuthProvider';
import { useEffect } from 'react';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Sidenav from '../basic/navigation/Sidenav';

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
    toast.error("Error : ", error);
  }

  return (
    <div className="user-inner bg-dark">
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-3'>
            <Sidenav />
          </div>
          <div className='col-9'>
            <div className="user-details mt-4 pt-2">
              <h3 className="font-weight-bold text-left mb-3">All Users</h3>
            </div>
            <div className="row">

              {
                isLoading ?
                  (<p className='loading'><img src='loader.gif' width={70} height={70} alt = "Loading..."/></p>) : (
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
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
