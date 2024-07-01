import { useState } from 'react';
import './Posts.css'

export default function Post(props) {


    const baseurl = 'http://localhost:6060/images';

    const [showComments , setShowComments] = useState(false);

    const commentToggler = ()=>{
       setShowComments(!showComments);
    }

    return (
        <>
            <div className='post bg-transparent text-white'>
      <div className='post_header m-0'>
        <div className='post_headerAuthor d-flex align-items-center w-100'>
          <span className='username flex-1'>{props.user.name}</span>
          <span className='text-align-right'>{new Date(props.postDate).toLocaleString()}</span>
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
        <span onClick={()=>{commentToggler()}}>{showComments ? "Hide Comments" : "View Comments"}</span>
         {props.comments && props.comments.map((comment, index) => (
          <p key={index}>{comment}</p>
        ))}
      </div>
    </div>
        </>
    );
}