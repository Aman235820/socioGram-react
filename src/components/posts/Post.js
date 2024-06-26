import './Posts.css'

export default function Post(props) {


    const baseurl = 'http://localhost:6060/images';

    return (
        <>
            <div className='post bg-transparent'>
      <div className='post_header m-0'>
        <div className='post_headerAuthor text-white d-flex align-items-center w-100'>
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
         <div className='caption d-flex text-white mt-2'><b>{props.user.name} : </b><div dangerouslySetInnerHTML={{ __html: props.content }} /></div>
      </div>
      <div className='post_footerIcons'>
        {/* Add icons or other footer content here */}
        {/* {props.comments && props.comments.map((comment, index) => (
          <p key={index}>{comment}</p>
        ))} */}
      </div>
    </div>
        </>
    );
}