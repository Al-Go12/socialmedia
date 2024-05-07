import React, {useEffect,useState} from 'react'
import {Navigate} from 'react-router-dom'
import IsAuthUser  from '../../utils/isAuthUser';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../../store/slice';



function UserRoutes({children}) {
    // const [isAuthenticated,setIsAuthenticated]=useState(false);
    const dispatch = useDispatch()
    const fetchData =async ()=>{
        const authInfo =await IsAuthUser();
        // setIsAuthenticated(authInfo.isAuthenticated)
        const data = {
            name: authInfo?.name,
            isAuthenticated: authInfo?.isAuthenticated,
            isAdmin: authInfo?.is_admin,
        }
        dispatch(set_Authentication(data))
        //console.log("UserRoutes",data)
       
    }

    useEffect(()=>{
        fetchData();
    },[])

    const isAuthenticated = useSelector((state) => state.authentication_user.isAuthenticated)

    console.log("UserRoutes",isAuthenticated)

    if (!isAuthenticated){
        return <Navigate to="/login"/>
    }


  return children
}

export default UserRoutes
