import { useContext, useEffect, useState, useRef } from 'react';
import './Posts.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../guards/AuthProvider';
import { CreateComment, DeleteComment } from '../../services/CommentService';
import { DeletePost, UpdatePost } from '../../services/PostsService';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, Form, FormGroup, Label, Col, FormText, Input } from 'reactstrap';
import JoditEditor from 'jodit-react';

export default function Post(props) {

  const navigate = useNavigate();
  const baseurl = `${process.env.REACT_APP_API_BASEURL}/images`;
  const [showComments, setShowComments] = useState(false);
  const [date, setDate] = useState(null);
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState(props.content);
  const location = useLocation();
  const editor = useRef();
  const [image, setImage] = useState(null);
  const [loader, setLoader] = useState(false);



  const commentToggler = () => {
    setShowComments(!showComments);
  }

  useEffect(() => {
    const setDateFormat = () => {
      let date = new Date(props.postDate);

      // Get the day, month, and year from the Date object
      let day = date.getDate();
      let month = date.toLocaleString('default', { month: 'long' });
      let year = date.getFullYear();
      let formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
      setDate(formattedDate);
    }
    setDateFormat();
  }, []);

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return 'th'; // All teen numbers get 'th'
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }

  const handleAddComment = (e) => {
    if ((e.target.value).length > 0) {
      setComment(e.target.value);
    }
  }

  const postCommentApi = async () => {
    setShowComments(false);
    const postId = props.postId;
    if (comment.length > 0) {
      const response = await CreateComment({ user, comment, postId });
      if (response?.hasError) {
        toast.error("Error : ", response.message);
      }
      else {
        toast.success(`${response?.message}`);
        setTimeout(() => {
          navigate(0);
        }, 2000);
      }
    }
    else {
      toast.error("Please write something to post comment !!");
    }
  }

  const handleDeleteComment = async (commentId, postId, user) => {
    const response = await DeleteComment({ commentId, postId, user });
    if (response?.hasError) {
      toast.error("Error : ", response.message);
    }
    else {
      setShowComments(false);
      toast.success(`${response?.message}`);
      setTimeout(() => {
        navigate(0);
      }, 2000);
    }
  }

  const handleDeletePost = async (postId) => {

    const confirm = window.confirm("Are you sure you want to delete this post ?");
    const token = user.token;
    if (confirm) {
      console.log("confirm")
      const response = await DeletePost({ token, postId });
      if (response?.hasError) {
        toast.error(response.message);
      }
      else {
        toast.success("Post delete successfully !!");
        setTimeout(() => {
          navigate(0);
        }, 2000);
      }
    }

  }

  const handleUpdatePost = async (e, postId) => {
    setLoader(true);
    const token = user.token;
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('updatedPost', JSON.stringify({ content }));
    const response = await UpdatePost({ token, formData , postId });
    if (!response.hasError) {
      toast.success("Successfully updated post !!");
      setTimeout(() => {
        navigate(0);
      }, 2000);
    }
    else {
      toast.error("Error : ", response.message);
    }
    setLoader(false);
  }

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  return (
    <>
      <ToastContainer />
      <div className='post bg-transparent text-white'>
        <div className='post_header m-0'>
          <div className='post_headerAuthor d-flex align-items-center w-100'>
            <div onClick={() => { navigate('/userProfile', { state: props.user.id }) }}>
              <img src={`https://cloud.appwrite.io/v1/avatars/initials?name=${props.user.name}&amp;project=65c8d4500c7cf523e70d`} alt="profilePic" className="img-fluid rounded-circle mx-2" style={{ width: '2rem', height: '2rem' }} />
              <span className='username flex-1'>{props.user.name}</span>
            </div>
            <span className='text-align-right'>{date}</span>
          </div>
        </div>
        <div className='post_content m-0'>
          {props.image && (
            <div className='post_image'>
              <img src={`${baseurl}/${props.image}`} alt="Post" />
            </div>
          )}
          <br />
          <div className='caption d-flex mt-2 mb-3'><b>{props.user.name} : </b><div dangerouslySetInnerHTML={{ __html: props.content }} /></div>
          {/* <br /> */}
          <span>
            <InputGroup>
              <Input onChange={handleAddComment} />
              <Button onClick={() => { postCommentApi() }}>
                Post Comment
              </Button>
            </InputGroup>
            {(location.pathname === '/userProfile' && user.id === props.user.id) &&
              <div className='post-btn mt-3 d-flex justify-content-flex-end'>
                <Button className='btn-info' onClick={toggle}>Update Post</Button>
                <Button className='btn-danger' onClick={() => handleDeletePost(props.postId)}>Delete Post</Button>
              </div>
            }
          </span>


        </div>
        <div className='post_footerIcons'>
          <p className='mb-2' onClick={() => { commentToggler() }}>{showComments ? "Hide Comments" : "View Comments"}</p>
          {showComments && <div className='comment w-100 d-flex'>
            {props.comments && props.comments.map((comment, index) => (
              <p className='mb-1' key={index}><b>{comment.user.name} -</b> {comment.content}
                <img hidden={!(comment.user.id === user.id || user.id === props.user.id)} onClick={() => { handleDeleteComment(comment.commentId, props.postId, user) }} alt="delete" src='delete.svg' />
              </p>
            ))
            }
          </div>}
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Update Post !!</ModalHeader>
        <ModalBody>
          <Form>

            <FormGroup row>
              <Label
                for="exampleText"
                sm={2}
              >
                Post Content
              </Label>
              <Col sm={10}>
                <JoditEditor
                  ref={editor}
                  value={content}
                  onChange={newContent => { setContent(newContent) }}
                />
                {/* <Input
            id="exampleText"
            name="text"
            type="textarea"
            style={{height:'170px'}}
        /> */}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label
                for="exampleFile"
                sm={2}
              >
                Image
              </Label>
              <Col sm={10}>
                <Input
                  id="exampleFile"
                  name="file"
                  type="file"
                  onChange={(e) => { setImage(e.target.files[0]) }}
                />
                <FormText>
                  Upload any image less than 10 MB !
                </FormText>
              </Col>
            </FormGroup>

          </Form>

        </ModalBody>
        <ModalFooter>
          <Button color="primary" disabled={loader} onClick={(e) => {
            handleUpdatePost(e, props.postId)
            setTimeout(() => { toggle() }, 5000);
          }}>
            Update
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

    </>
  );
}