import React,{useEffect,useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import IsAuthUser from '../utils/isAuthUser';
import { set_Authentication } from '../store/slice';
import { Navigate,Outlet,useNavigate,useRoutes } from 'react-router-dom';
import User_login from '../pages/User/user_login';
import User_registration from '../pages/User/user_registration';
import User_Home from '../pages/User/User_Home';
import UserRoutes from '../routes/User/UerRoutes';
import Home from '../components/Home';
import ProfilePage from '../pages/User/UserProfile';
import ForgotPassword from '../pages/User/ForgetPassword';
import ChangePassword from '../pages/User/ChangePassword';

import Messages from '../pages/User/messages';
import Notifications from '../components/Notification';
import Follow from '../components/follow';
import RoomPage from '../pages/User/videoCall';
import SearchPage from '../pages/User/searchPage';
import AudioCall from '../pages/User/audioCall';



function UserWrapper() {
   
    const [isLoading, setIsLoading] = useState(true);

    const dispatch =useDispatch();
    const navigate = useNavigate();


    

    const checkAuth =async()=>{
        
        try {
            const isAuthenticated = await IsAuthUser();
            dispatch(set_Authentication({
                name: isAuthenticated.name,
                isAuthenticated: isAuthenticated.isAuthenticated
            }));
            setIsLoading(false);
        } catch (error) {
            console.error('Error checking authentication:', error);
            setIsLoading(false);
        }
    }



    const authentication_user=useSelector(state=>state.authentication_user.name)
   


  
    useEffect(()=>{
       
        if(!authentication_user?.name){
    
        checkAuth()}

        console.log("checking for error",authentication_user)
            

       if(!authentication_user){
        navigate('/login');
  
       }

      else{
        navigate('/')
      }   
    },[authentication_user])


   

 const routes=useRoutes([
    {
        element:(
            <div>
                
            <User_Home>
                
                <Outlet/>
                </User_Home>

            
                

            </div>
        ),
        children:[
          
            {element:<Home/>,index:true},
            {element:<ProfilePage/>,path:'/profile/:email'}, 
            {element:<Notifications/>,path:'/notification/'},
            {element:<Follow/>,path:'follow/:email'},
            {element:<SearchPage/>,path:'/searchpage/'}
           
        ],

    },

    {  element:(
         <Outlet/>
         ),
    children:[
       
        {element:<User_login/>,path:"/login"},
        {element:<User_registration/>,path:"/signup"},
        {element:<ForgotPassword/>,path:'/forgot-password'},
        {element:<ChangePassword/>,path:'/change-password/:userId'},
        {element:<Messages/>,path:'/messages'} ,
         {element:<RoomPage/>,path:'/RoomPage/:roomId'},
         {element:<AudioCall/>,path:'/AudioCall/:roomId'}
        

    ]
,
    }

 ]) 

 if (isLoading) {
    return <div>Loading...</div>; // Render a loading indicator while checking authentication
}   else{

      return routes;
    }



   
     
}

export default UserWrapper
