import React, { useContext, useEffect, useState } from 'react'
import Sidenav from "../basic/navigation/Sidenav";
import CreatePostModal from "../posts/CreatePostModal";
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../guards/AuthProvider';
import { GetUserById, UpdateUser, DeleteUser, GetAllUsersV1, DeleteUserById } from '../../services/UserServices';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetPostsByUser } from '../../services/PostsService';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Post from '../posts/Post';
import Cookies from "js-cookie";

import './UserProfile.css';
import './AllUsers.css'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Input, ListGroup, ListGroupItem } from 'reactstrap';


function UserProfile() {

  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [writeAccess, setWriteAccess] = useState(false);
  const [adminAccess, setAdminAccess] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(user.token);
  const [loader, setLoader] = useState(false);
  const [allUsers, setAllUsers] = useState();
  const [loading, setLoading] = useState(true);
  const id = location.state || {};       //destructure the props state
  const [formError, setFormError] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const navigate = useNavigate();
  const [formErrorMsg, setFormErrorMsg] = useState('');
  const [updateForm, setUpdateForm] = useState({
    "name": user.name,
    "password": "",
    "age": user.age
  })

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 2
  });

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['getUserPosts', profile.id, pagination],
    queryFn: GetPostsByUser,
    keepPreviousData: true
  })

  useEffect(() => {
    setToken(user.token);

    if (!location.state) {
      setWriteAccess(true);
      fetchUser(user.id);
      setAdminAccess(user?.role[0]?.authority === 'ADMIN_USER' ? true : false);
    }
    else {
      fetchUser(id);
    }
  }, [user, location.state]);

  useEffect(() => {
    if (data && data.data && Array.isArray(data.data.content)) {
      setPosts(data.data.content);
    }
    if (isError) {
      toast.error("Error : ", error);
    }

  }, [data, location.state, user]);

  const changePage = (pgNum) => {
    if (pgNum < 0 || pgNum >= data.data.totalPages) {
      return;
    }
    setPagination(prev => {
      return ({ ...prev, pageNumber: pgNum })
    })
  }

  const fetchUser = async (id) => {
    setLoader(true);
    const response = await GetUserById({ id, token });

    if (response) {
      if (!response.hasError) {
        setProfile(response.data);
      }
      else {
        toast.error("Error : ", response.message);
      }
    }
    setLoader(false);
  }

  const fetchAllUsers = async () => {
    setUserLoading(true);
    const response = await GetAllUsersV1(token);
    if (response) {
      if (!response?.hasError) {
        setAllUsers(response?.data);
      }
      else {
        toast.error("Error : ", response.message);
      }
    }
    setUserLoading(false);
  }

  const handleEditProfile = async () => {
    const response = await UpdateUser({ updateForm, token });
    if (response.hasError) {
      setFormError(true);
      setFormErrorMsg(response.message);
    }
    else {
      setUser(prev => {
        return ({
          ...prev,
          name: response.data.name,
          age: response.data.age,
        })
      })
      setFormError(false);
      toast.success("Successfully updated user !!");
      toggle();
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
    }
  }

  const openCreatePostModal = () => {
    setShowPostModal(true);
  }
  const closeCreatePostModal = () => {
    setShowPostModal(false);
  }

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);

  const toggle = () => setModal(!modal);
  const toggle1 = () => {
    setModal1(!modal1);
    if (!modal1)
      fetchAllUsers();
  }


  const updateName = (e) => {
    const value = e.target.value;

    if (!(/^[a-zA-Z\s]+$/).test(value?.trim())) {
      setFormErrorMsg("Enter characters only");
      setFormError(true);
      return;
    }
    setFormError(false);
    setUpdateForm(prev => {
      return ({ ...prev, name: value });
    })

  }

  const updatePassword = (e) => {
    const value = e.target.value;
    setUpdateForm(prev => {
      return ({ ...prev, password: value });
    })
  }

  const updateAge = (e) => {
    const value = e.target.value;
    if (value < 1 || value > 150) {
      setFormErrorMsg("Please enter correct age");
      setFormError(true);
      return;
    }
    setFormError(false);
    setUpdateForm(prev => {
      return ({ ...prev, age: Number(value) });
    })
  }

  const handleDeleteProfile = async () => {
    const confirm = window.confirm("Are you sure you want to Delete this Profile !!");
    if (confirm) {
      const response = await DeleteUser(user);
      if (response?.hasError) {
        toast.error("Error : ", response.message);
      }
      else {
        alert("Profile delete successfully !!");
        navigate("/");
      }
    }
  }

  const deleteByUserId = async (id) => {
    const confirm = window.confirm("Are you sure you want to Delete this User !!");
    if (confirm) {
      let token = user.token;
      const response = await DeleteUserById({ id, token });
      if (!response?.hasError) {
        alert("Profile delete successfully !!");
        toggle1();
      }
      else {
        toast.error("Error : ", response.message);
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 8000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, []);


  return (
    <>
      <br /><br />
      <div className='row'>
        <div className='col-3'>
          <Sidenav openCreatePostModal={openCreatePostModal} />
        </div>

        {
          showPostModal && <CreatePostModal closeCreatePostModal={closeCreatePostModal} />
        }

        <div className="col-9">
          <div className="timeline user-profile py-2">
            {
              loader && <div className='profile-loader offset-3 mt-5'>
                {/* <h3 className='text-white'>Loading...</h3> */}
                <img src='loader.gif' width={40} height={40} alt="Loading..." />
              </div>
            }
            {
              !loader &&
              <div className="d-flex m-3 profile-inner">
                <div className='profile-detail profile-content'>
                  <img src={`https://cloud.appwrite.io/v1/avatars/initials?name=${profile.name}&amp;project=65c8d4500c7cf523e70d`} alt="profilePic" className="img-fluid rounded-circle" style={{ width: '9rem', height: '9rem' }} />
                  <h1 className="mb-1 base-medium text-white text-left">
                    {profile.name}, {profile.age}
                    <small className="d-block small-regular text-white-50 bg-dark text-left">
                      @{profile.email}
                    </small>
                  </h1>
                </div>
                <div className='edit-btn'>
                  {writeAccess && <button className='text-white border-0 btn-primary' onClick={toggle}><img src='edit.svg' className='px-2' alt='edit' />Edit Profile</button>}
                  {writeAccess && <button className='text-white border-0 btn-danger' onClick={handleDeleteProfile}><img src='delete.svg' className='px-2' alt='edit' />Delete Profile</button>}
                  {adminAccess && <button className='text-white border-0 btn-success' onClick={toggle1} ><img src='edit.svg' className='px-2' alt='edit' />Admin Access</button>}
                </div>
              </div>
            }
          </div>

          <div className='timeline_left bg-dark'>
            {isLoading && posts.length === 0 ? (
              <p>Loading....</p>
            ) : (
              <div className='timeline_post bg-dark'>

                {posts.length > 0 ? posts.map((post, index) => (
                  <Post
                    key={`${post.postId}-${index}`}
                    postId={post.postId}
                    user={post.user}
                    image={post.image}
                    content={post.content}
                    comments={post.comments}
                    postDate={post.postDate}
                  />
                )) : (
                  <p>No posts available !!</p>
                )}
              </div>
            )}
          </div>

          <div>
            {data && posts?.length > 0 && <Pagination>
              <PaginationItem disabled={data.data.pageNumber === 0} onClick={() => changePage(data.data.pageNumber - 1)}>
                <PaginationLink
                  previous
                />
              </PaginationItem>
              {
                [...Array(data.data.totalPages)].map((_, index) => (
                  <PaginationItem active={index === data.data.pageNumber} onClick={() => changePage(index)} key={index}>
                    <PaginationLink>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))
              }
              <PaginationItem disabled={data.data.lastPage} onClick={() => changePage(data.data.pageNumber + 1)}>
                <PaginationLink
                  next
                />
              </PaginationItem>
            </Pagination>}
            {
              posts?.length === 0 && (loading ? (<h2 className='text-white mt-5 text-center pt-5'>{`Loading Posts...`}</h2>) : (<p className='text-white'>{`Oops , Nothing to see !! Looks like ${profile.name} haven't posted in a while. :(`}</p>))
            }
          </div>

        </div>

      </div>

      <div>
        <Modal isOpen={modal1} toggle={toggle1}>
          <ModalHeader toggle={toggle1}>Delete Users !!</ModalHeader>
          {userLoading ? (<div>
            <p className='user-loading m-0 h-50'><img src='loader.gif' width={70} height={70} alt = "Loading..."/></p>
          </div>) :
            (<ModalBody className='p-0'>
              <ListGroup
                flush
                horizontal
                numbered
              >
                {allUsers && allUsers.length > 0 ?
                  (
                    allUsers.map(user => {
                      return (<ListGroupItem>
                        <span className='delet-user-list'>{user.name}
                          <img
                            alt='delete' src='delete.svg'
                            style={{ display: user.id === 36 ? 'none' : 'block;' }}
                            onClick={() => deleteByUserId(user.id)} /></span>
                      </ListGroupItem>)
                    })

                  ) :
                  (<p>No users Found !!</p>)
                }
              </ListGroup>
            </ModalBody>
            )}
          <ModalFooter>
            <Button color="secondary" onClick={toggle1}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>


      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Update User !!</ModalHeader>
          <ModalBody>
            <InputGroup>
              <InputGroupText>
                @
              </InputGroupText>
              <Input disabled={true} value={user.userName} />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroupText>
                Name
              </InputGroupText>
              <Input defaultValue={user.name} placeholder="Type Here..." onChange={(e) => updateName(e)} />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroupText>
                Change Password
              </InputGroupText>
              <Input placeholder="Optional..." onChange={(e) => updatePassword(e)} />
            </InputGroup>
            <br />
            <InputGroup>
              <InputGroupText>
                Age
              </InputGroupText>
              <Input type='number' defaultValue={user.age} placeholder="Enter.." onChange={(e) => updateAge(e)} />
            </InputGroup>

          </ModalBody>
          <ModalFooter>
            {formError && <p className='text-danger'>{formErrorMsg}</p>}
            <Button color="primary" disabled={formError} onClick={() => { handleEditProfile() }}>
              Update
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <ToastContainer />
    </>
  );
}

export default UserProfile;
