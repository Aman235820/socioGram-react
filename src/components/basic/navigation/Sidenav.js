import React from 'react'
import './Sidenav.css';
import { useNavigate } from 'react-router-dom';


function Sidenav(props) {

  const navigate = useNavigate();

  return (
    <div className='sidenav bg-dark mt-4'>
           
      <div className='sidenav_buttons'>
        <button className='sidenav_button' onClick={()=>{navigate('/userHome')}}>
          <span>Home</span>
        </button>

        <button className='sidenav_button' onClick={()=>{navigate('/allUsers')}}>
          <span>People</span>
        </button>

        <button className='sidenav_button' onClick={()=>{navigate('/userProfile')}}>
          <span>Profile</span>
        </button>

        <button className='sidenav_button' onClick={()=>{props.openCreatePostModal()}}>
          <span>Create Post</span>
        </button>
      </div>


    </div>
    
  )
}

export default Sidenav