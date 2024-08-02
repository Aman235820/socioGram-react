import React, { useContext, useEffect, useState } from 'react'
import Sidenav from "../basic/navigation/Sidenav";
import CreatePostModal from "../posts/CreatePostModal";
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../guards/AuthProvider';
import { GetUserById, UpdateUser , DeleteUser } from '../../services/UserServices';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetPostsByUser } from '../../services/PostsService';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Post from '../posts/Post';
import './UserProfile.css';
import Cookies from "js-cookie";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Input } from 'reactstrap';


function UserProfile() {

  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [writeAccess, setWriteAccess] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(user.token);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(true);
  const id = location.state || {};       //destructure the props state
  const [formError, setFormError] = useState(false);
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
  const toggle = () => setModal(!modal);

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
      if (response.hasError) {
        toast.error("Error : " ,  response.message);
      }
      else{
          alert("Profile delete successfully !!");
          navigate("/");
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
        <div className="timeline p-4">
          <img src={`https://cloud.appwrite.io/v1/avatars/initials?name=${profile.name}&amp;project=65c8d4500c7cf523e70d`} alt="profilePic" className="img-fluid rounded-circle" style={{ width: '9rem', height: '9rem' }} />
          <br />
          {
            loader && <div>
              <h3 className='text-white'>Loading...</h3>
            </div>
          }
          {
            !loader &&
            <div className="d-flex m-3 profile-inner">
              <div className='profile-detail'>
                <h1 className="mb-1 base-medium text-white text-left">
                  {profile.name} , {profile.age}
                </h1>
                <p className="small-regular text-white-50 bg-dark text-left">
                  @{profile.email}
                </p>
              </div>
              <div className='edit-btn'>
                {writeAccess && <button className='text-white border-0' onClick={toggle}><img src='edit.svg' className='px-2' alt='edit' />Edit Profile</button>}
                {writeAccess && <button className='text-white border-0' onClick={handleDeleteProfile}><img src='edit.svg' className='px-2' alt='edit' />Delete Profile</button>}
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
            posts?.length === 0 && (loading ? (<p className='text-white'>{`Loading Posts...`}</p>) : (<p className='text-white'>{`Oops , Nothing to see :(`}</p>))
          }
        </div>

      </div>
      
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


export default UserProfile
