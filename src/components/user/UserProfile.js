import React, { useContext, useEffect, useState } from 'react'
import Sidenav from "../basic/navigation/Sidenav";
import CreatePostModal from "../posts/CreatePostModal";
import { useQuery } from '@tanstack/react-query';
import AuthContext from '../../guards/AuthProvider';
import { GetUserById } from '../../services/UserServices';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GetPostsByUser } from '../../services/PostsService';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Post from '../posts/Post';
import './UserProfile.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, Input } from 'reactstrap';


function UserProfile() {

  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({});
  const [writeAccess, setWriteAccess] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(user.token);
  const [loader, setLoader] = useState(false);
  const id = location.state || {};       //destructure the props state

  const [pagination, setPagination] = useState({
    pageNumber: 0,
    pageSize: 2
  });

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['getUserPosts', profile.id, pagination],
    queryFn: GetPostsByUser,
    keepPreviousData : true
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
  }, [data , location.state , user]);

  const changePage = (pgNum) => {
    if(pgNum < 0 || pgNum >= data.data.totalPages){
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

  const handleEditProfile = ()=>{
       
  }

  const openCreatePostModal = () => {
    setShowPostModal(true);
  }
  const closeCreatePostModal = () => {
    setShowPostModal(false);
  }

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  console.log(user);

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
                {writeAccess && <button className='text-white border-0'><img src='edit.svg' className='px-2' alt='edit' onClick={toggle} />Edit Profile</button>}
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
             
              {posts.length > 0 ? posts.map((post , index) => (
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

      <div className="bg-dark">
                <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle}>Update User !!</ModalHeader>
                    <ModalBody>
                    <InputGroup>
                            <InputGroupText>
                                @
                            </InputGroupText>
                            <Input disabled={true} value={user.username} />
                        </InputGroup>
                        <br/>
                        <InputGroup>
                            <InputGroupText>
                                New Password
                            </InputGroupText>
                            <Input placeholder="Type Here.." />
                        </InputGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" disabled={loader} >
                            Reset
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
