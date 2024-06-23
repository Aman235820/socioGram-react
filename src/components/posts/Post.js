import './Posts.css'

export default function Post(props) {


    const baseurl = 'http://localhost:6060/images';

    return (
        <>
            <div className='post bg-dark'>
      <div className='post_header'>
        <div className='post_headerAuthor'>
          <span className='username'>{props.user.name}</span>
          <span>{new Date(props.postDate).toLocaleString()}</span>
        </div>
      </div>
      <div className='post_content'>
        {props.image && (
          <div className='post_image'>
            <img src={`${baseurl}/${props.image}`} alt="Post" />
          </div>
        )}
        <br/>
         <b style={{ color: 'white' }} >{props.user.name} : </b><div style={{ color: 'white' }} dangerouslySetInnerHTML={{ __html: props.content }} />
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