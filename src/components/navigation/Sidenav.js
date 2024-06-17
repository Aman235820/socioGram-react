import React from 'react'
import './Sidenav.css';


function Sidenav() {
  return (
    <div className='sidenav'>
           
           <div className='sidenav_buttons'>
        <button className='sidenav_button'>
          <span>Home</span>
        </button>

        <button className='sidenav_button'>
          <span>Search</span>
        </button>

        <button className='sidenav_button'>
          <span>Explore</span>
        </button>

        <button className='sidenav_button'>
          <span>Reels</span>
        </button>

        <button className='sidenav_button'>
          <span>Messages</span>
        </button>

        <button className='sidenav_button'>
          <span>Notifications</span>
        </button>

        <button className='sidenav_button'>
          <span>Create</span>
        </button>

        <div className='sidenav_more'>
          <button className='sidenav_button'>
            <span>Menu</span>
          </button>
        </div>
        </div>


    </div>
    
  )
}

export default Sidenav