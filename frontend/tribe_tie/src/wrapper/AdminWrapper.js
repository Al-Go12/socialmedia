import React, { lazy, useEffect } from 'react';
import { Outlet, useNavigate, useRoutes } from 'react-router-dom';
import isAuthAdmin from '../utils/isAuthAdmin';
import { useDispatch, useSelector } from 'react-redux';
import { set_Authentication } from '../store/slice' 
import AdminRouter from '../routes/Admin/AdminRoutes';
import AdminLogin from '../pages/admin/AdminLogin';
import Layout from '../components/Admin/Layout';
import ReportedPostList from '../pages/admin/ReportedPostList';
import ReportedUserList from '../pages/admin/ReportedUserList';
import ProfilePage from '../pages/User/UserProfile';

const Dashboard = lazy(() => import('../pages/admin/Admin_Dasboard'));

export default function AdminWrapper() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authentication_user = useSelector(state => state.authentication_user.isAdmin);

  const checkAuthANDFetchUserData = async () => {
    try {
      const isAuthenticated = await isAuthAdmin(); // Assuming isAuthAdmin is an asynchronous function that returns authentication data
      
      dispatch(
        set_Authentication({
          name: isAuthenticated.name,
          isAuthenticated: isAuthenticated.isAuthenticated,
          isAdmin: isAuthenticated.isAdmin,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!authentication_user.isAdmin) {
        
      checkAuthANDFetchUserData();
      console.log(authentication_user.isAdmin)
    }
  }, []);

  const routes = useRoutes([
    {
      element: (
        <div>
             <AdminRouter>
              <Layout>
          <Outlet />
          </Layout>
          </AdminRouter>
        </div>
      ),
      children: [
        { element: <Dashboard />, index:true},
    {element:<ReportedPostList/>,path:'/reportpage'},
    {element:<ReportedUserList/>,path:'/ReportedUserList'},
    {element:<ProfilePage/>,path:'/userprofile/:email'}

  ],
    },
  
   

    {
      path: 'login',
      element: <AdminLogin/> // Assuming AdminAuthRouter and Loginpage are defined
    },
    
  ]);

  return routes;
}
