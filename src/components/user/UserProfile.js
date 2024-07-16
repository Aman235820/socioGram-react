import React, { useContext, useEffect, useState } from 'react'
import Sidenav from "../basic/navigation/Sidenav";
import CreatePostModal from "../posts/CreatePostModal";
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../guards/AuthProvider';
import { GetUserById, UpdateUser } from '../../services/UserServices';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
  const [loadings, setLoadings] = useState(false);
  const id = location.state || {};       //destructure the props state
  const [formError, setFormError] = useState(false);
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
        toast("Error : ", response.message);
      }
    }
    setLoader(false);
  }

  const handleEditProfile = async () => {
    setLoadings(true);
    console.log(updateForm)
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
      alert("Successfully updated user !!");
      toggle();
      Cookies.set('user', JSON.stringify(user), { expires: 1 });
    }
    setLoadings(false);
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

  return (
    <>
      <br /><br />
      <Sidenav openCreatePostModal={openCreatePostModal} />

      {
        showPostModal && <CreatePostModal closeCreatePostModal={closeCreatePostModal} />
      }

      <div className="col-9 offset-3">
        <ToastContainer />
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
                  {profile.name}
                </h1>
                <p className="small-regular text-white-50 bg-dark text-left">
                  @{profile.email}
                </p>
              </div>
              <div className='edit-btn'>
                {writeAccess && <button className='text-white border-0' onClick={toggle}><img src='edit.svg' className='px-2' alt='edit' />Edit Profile</button>}
              </div>
            </div>
          }
        </div>
        <br />
        <div>
          {data && <Pagination size="sm">
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
        </div>

        <div className='timeline_left bg-dark'>
          {isLoading && posts.length === 0 ? (
            <p>Loading....</p>
          ) : (
            <div className='timeline_post bg-dark'>

              {posts.length > 0 ? posts.map((post, index) => (
                <Post
                  key={`${post.postId}-${index}`}
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

        <br />
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


    </>

  );
}


export default UserProfile
