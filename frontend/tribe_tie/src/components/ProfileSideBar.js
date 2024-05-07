import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { set_Authentication } from '../store/slice'
import { BASE_URL } from '../constant/api_url'


const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"


const ProfileSideBar = () => {
   
   
   const UserName=useSelector(state=>state.authentication_user.userProfile)
   

   
   
  return (
    <div style={{ backgroundColor: 'rgb(38, 38, 38)',height:'220px' }} className=' py-4 bg-customColor text-white flex flex-col justify-center items-center my-10 rounded-2xl'>
      <img src={ UserName?.display_pic ? `${BASE_URL}${UserName?.display_pic}` : DisplayPicture }alt="profile_pic" className='rounded-2xl w-20 h-20'/>
      <h1 style={{ marginTop: '10px' }}>{UserName?.username}</h1>
      {UserName && UserName.first_name && UserName.last_name && (
    <h2 style={{ marginTop: '10px' }}>{UserName.first_name} {UserName.last_name}</h2>
)}

      
      <Link to={`/follow/${UserName.email}`}>
      <button  style={{ marginTop: '10px', backgroundColor: '#B9933C', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' ,width:'130%'}}>Profile</button>
        
      </Link>
      
    </div>
    
  )
}

export default ProfileSideBar
