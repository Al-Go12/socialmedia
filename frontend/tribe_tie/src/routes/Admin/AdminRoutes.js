import React, {useEffect,useState} from 'react'
import {Navigate} from 'react-router-dom'
import isAuthAdmin from '../../utils/isAuthAdmin';



function AdminRouter({ children }) {
    // lihgjhvjv
  
    const [isAuthenticated, setIsAuthenticated] = useState({
       'name':null, 
      'is_authenticated' : true,
      'is_admin' : true,
    });
    const [isLoading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const authInfo = await isAuthAdmin();
        console.log(authInfo,'finalcheck')
        console.log('ijas check',authInfo.name,authInfo.isAuthenticated,authInfo.is_admin,)
        setIsAuthenticated({
            name:authInfo.name,
            is_authenticated : authInfo.isAuthenticated,
            is_admin: authInfo.is_admin,
        });
        setLoading(false);
      };
  
      fetchData();
    }, []);

  
    if (!isAuthenticated.is_authenticated){
        return <Navigate to="/admin/login"/>
    }

    if (!isAuthenticated.is_admin){
        return <Navigate to="/login"/>
    }


  return children
}

export default AdminRouter
