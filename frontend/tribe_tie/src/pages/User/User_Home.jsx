import React, { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { set_Authentication } from '../../store/slice';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import SideBar from '../../components/SideBar';
import Home from '../../components/Home';
import './userwrapper.css'
import Suggestionbar from '../../components/suggestionbar';
// Define the Logout function as a custom hook


function User_Home({children}) {

  // Use the useLogout custom hook to get the logout function
  
  const navigate = useNavigate();

 

  const authentication_user=useSelector(state=>state.authentication_user.name)
  useEffect(()=>{
       
   

   if(!authentication_user){
    navigate('/login');

   }

  
},[authentication_user])
  

  return (
    <div style={{   height : '100vh'   , backgroundColor:'#181818' }}>
      <ToastContainer/>
      {

       <div className='leftsidebar'> 
       <SideBar/>
       </div>
      }
       <div style={{ backgroundColor:'#181818',display : 'flex',flexDirection :'column' , alignItems :'center',justifyContent : 'center' }}className='rounded-2xl'>
          {children}
       </div>
       <div  style={{ backgroundColor: 'rgb(38,38,38)',position : 'fixed',right : '20px' ,top : 0,height : '88vh',marginTop:'70px',overflow: 'auto' }} className=' w-1/6 px-10  rounded-lg'> 
      
        
         { <Suggestionbar/>}

          
       </div>
    </div>
  );
}

export default User_Home;
