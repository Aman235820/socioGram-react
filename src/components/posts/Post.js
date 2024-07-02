import { useEffect, useState } from 'react';
import './Posts.css'
import { useNavigate } from 'react-router-dom';

export default function Post(props) {

  const navigate = useNavigate();
  const baseurl = 'http://localhost:6060/images';
  const [showComments, setShowComments] = useState(false);
  const [date  , setDate] = useState(null);

  const commentToggler = () => {
    setShowComments(!showComments);
  }

  useEffect(()=>{
    const setDateFormat = ()=>{
      let date = new Date(props.postDate);

      // Get the day, month, and year from the Date object
      let day = date.getDate();
      let month = date.toLocaleString('default', { month: 'long' });
      let year = date.getFullYear();
      let formattedDate = `${day}${getOrdinalSuffix(day)} ${month}, ${year}`;
      setDate(formattedDate);
    }
    setDateFormat();
  },[]);

  const  getOrdinalSuffix = (day)=> {
    if (day > 3 && day < 21) return 'th'; // All teen numbers get 'th'
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

  return (
    <>
      <div className='post bg-transparent text-white'>
        <div className='post_header m-0'>
          <div className='post_headerAuthor d-flex align-items-center w-100'>
            <div onClick={() => { navigate('/userProfile', { state: props.user.id }) }}>
              <img src={`https://cloud.appwrite.io/v1/avatars/initials?name=${props.user.name}&amp;project=65c8d4500c7cf523e70d`} alt="profilePic" className="img-fluid rounded-circle" style={{ width: '2rem', height: '2rem' }} />
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
          <div className='caption d-flex mt-2'><b>{props.user.name} : </b><div dangerouslySetInnerHTML={{ __html: props.content }} /></div>
        </div>
        <div className='post_footerIcons'>
          <p onClick={() => { commentToggler() }}>{showComments ? "Hide Comments" : "View Comments"}</p>
          {showComments && <div className='m-3'>
            {props.comments && props.comments.map((comment, index) => (
              <p key={index}><b>{comment.user.name} -</b> {comment.content}</p>
            ))}
          </div>}
        </div>
      </div>
    </>
  );
}