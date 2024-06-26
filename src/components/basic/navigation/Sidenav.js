import React from 'react'
import './Sidenav.css';


function Sidenav(props) {
  return (
    <div className='sidenav bg-dark'>
           
      <div className='sidenav_buttons'>
        <button className='sidenav_button'>
          <span>Home</span>
        </button>

        <button className='sidenav_button'>
          <span>Explore</span>
        </button>

        <button className='sidenav_button'>
          <span>Messages</span>
        </button>

        <button className='sidenav_button' onClick={()=>{props.openCreatePostModal()}}>
          <span>Create Post</span>
        </button>
      </div>


    </div>
    
  )
}

export default Sidenav