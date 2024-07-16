import { useContext, useEffect, useState } from 'react';
import './Posts.css'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Input, InputGroup, Button } from 'reactstrap';
import AuthContext from '../../guards/AuthProvider';
import { CreateComment, DeleteComment } from '../../services/CommentService';
import { DeletePost } from '../../services/PostsService';

export default function Post(props) {

  const navigate = useNavigate();
  const baseurl = 'http://localhost:6060/images';
  const [showComments, setShowComments] = useState(false);
  const [date, setDate] = useState(null);
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const location = useLocation();

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
      const response = await DeletePost({ token, postId });
      if (response.hasError) {
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
          <div className='caption d-flex mt-2'><b>{props.user.name} : </b><div dangerouslySetInnerHTML={{ __html: props.content }} /></div>
          <br />
          <span>
            <InputGroup>
              <Input onChange={handleAddComment} />
              <Button onClick={() => { postCommentApi() }}>
                Post Comment
              </Button>
            </InputGroup> {(location.pathname === '/userProfile' && user.id === props.user.id) &&
              <Button className='btn-danger' onClick={() => handleDeletePost(props.postId)}>Delete Post</Button>}
          </span>


        </div>
        <div className='post_footerIcons'>
          <p className='mb-2' onClick={() => { commentToggler() }}>{showComments ? "Hide Comments" : "View Comments"}</p>
          {showComments && <div className='comment'>
            {props.comments && props.comments.map((comment, index) => (
              <p className='mb-1' key={index}><b>{comment.user.name} -</b> {comment.content}
                <img hidden={!(comment.user.id === user.id || user.id === props.user.id)} onClick={() => { handleDeleteComment(comment.commentId, props.postId, user) }} alt="delete" src='delete.svg' />
              </p>
            ))
            }
          </div>}
        </div>
      </div>
    </>
  );
}