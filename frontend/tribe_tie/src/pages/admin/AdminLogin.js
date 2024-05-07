import React from 'react'
import axios from 'axios'
import { BASE_URL } from '../../constant/api_url'
import {  useDispatch } from 'react-redux'
import { set_Authentication } from '../../store/slice'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Screens51 from '../../additional/Screens51.png'



function AdminLogin() {
    const dispatch=useDispatch()
    const navigate=useNavigate()


 const admin_login=async(e) => {  
    e.preventDefault();
    const formData=new FormData();
    formData.append('email',e.target.email.value);
    formData.append('password',e.target.password.value);
    try{
        const response = await axios.post(BASE_URL + '/api/Login', formData);
        if (!response.data.isAdmin){
            console.log(!response.data.isAdmin)
            return navigate('/login')
          }

        if (response.status === 200) {
            console.log("com")
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);
            console.log('check for',response.data.isAdmin)
            dispatch(
                set_Authentication({
                    name: jwtDecode(response.data.access).username,
                    isAuthenticated: true,
                    isAdmin: response.data.isAdmin
                })
            );

            navigate('/admin/');
            console.log("login success");
       
            
    }}
    catch (error) {
        console.error("login failed", error);
   
 }}




  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#181818' }}>
    <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'rgb(38,38,38)', padding: '20px', borderRadius: '20px', width: '60%', height: '80%', marginTop: '10vh' }}>

            <form onSubmit={admin_login} style={{ textAlign: 'center', marginTop: '30%' }}>
                <div>
                    <h1 style={{ color: 'whitesmoke' }}>LOGIN</h1>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <input type='email' placeholder="Email" style={{ margin: '10px', height: '30px', padding: '8px', border: 'none', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }} id='email' />
                </div>
                <div>
                    <input type='password' placeholder="Password" style={{ margin: '10px', height: '30px', padding: '8px', border: 'none', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }} id='password' />
                </div>
                <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#B9933C', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '30%' }}>Login</button>
            
               
            </form>
          
        </div>
    </div>
    <div style={{ flex: '1',backgroundImage: `url(${Screens51})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh' }}></div>

    <ToastContainer />
</div>
);
}    

export default AdminLogin
