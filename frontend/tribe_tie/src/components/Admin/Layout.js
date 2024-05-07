import React, { useState } from 'react'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ReportIcon from '@mui/icons-material/Report';
import GroupIcon from '@mui/icons-material/Group';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { set_Authentication } from '../../store/slice';
import { useDispatch, useSelector } from 'react-redux';
import { Link,useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';












    

function Layout({children}) {
    const [open,setopen]=useState(true)
    const navigate = useNavigate();
    const dispatch = useDispatch();



    const Logout = ()=>{
    

  
        localStorage.clear();
        dispatch(
          set_Authentication({
            name: null,
            isAuthenticated: false,
            isAdmin:false
          })
        );
        navigate('/admin/login/')}

  return (
    <div style={{   backgroundColor:'#181818' }} className= 'flex p-5'>
        <div className={`${open ? "w-72":"w-20"} duration-300 p-5 pt-8 h-screen bg-neutral-800 border-r-4   border-neutral-800 rounded-2xl relative `}>
        <div className={` text-yellow-500  absolute rounded-full -right-2 top-9 cursor-pointer  w-7 border-2 ${!open && "rotate-180"}`}
        onClick={()=>setopen(!open)}>
        <ArrowCircleLeftIcon className="w-full h-full"/>
        
        </div>

       <div className='m-4 pt-6 text-white flex gap-x-4 items-center'>
        <DashboardIcon/>
         <h1
         className={`text-white origin-left duration-300 ${!open && "scale-0"}`}
         >Dashboard</h1>
       </div>
        <ul className='pt-6 '>


        <Link to='/admin'>
        <li className='m-4 gap-x-4 flex items-center cursor-pointer text-white'>
        <GroupIcon/> <span
        className={`text-white origin-left duration-300 ${!open && "scale-0"}`}
        >Users</span>
        </li>
     </Link>
     
        <Link to='/admin/reportpage/'>
         <li className='m-4 gap-x-4 flex items-center cursor-pointer text-white'>
         <ReportIcon/> <span
         className={`text-white origin-left duration-300 ${!open && "scale-0"}`}>
         Repoted Posts
         </span>
         
        
     
            </li>   </Link>

         

            <Link to='/admin/ReportedUserList/'>
         <li className='m-4 gap-x-4 flex items-center cursor-pointer text-white'>
         <ReportIcon/> <span
         className={`text-white origin-left duration-300 ${!open && "scale-0"}`}>
         Repoted Users
         </span>
         
        
     
            </li>   </Link>
        

          

            <li  className='m-4 gap-x-4 flex items-center cursor-pointer text-white'
            onClick={Logout}
            >
            <LogoutIcon/> <span
         className={`text-white origin-left  duration-300 ${!open && "scale-0"}`}>
         Logout
         </span>

            </li>   
              
       </ul>


        </div>

        <div className=' px-5  w-full h-screen'>
            
                {children}
            
        </div>
        
      
    </div>
  )
}

export default Layout
