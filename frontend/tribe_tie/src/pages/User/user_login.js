import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { set_Authentication, updateUserProfile } from '../../store/slice';
import { BASE_URL } from '../../constant/api_url';
import { Link,useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Screens51 from '../../additional/Group40.png'

function User_login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", e.target.email.value);
        formData.append('password', e.target.password.value);
        try {
            const response = await axios.post(BASE_URL + '/api/Login', formData);
            if (response.status === 200) {
                localStorage.setItem('access', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);
                const user_name = jwtDecode(response.data.access).username;
                dispatch(
                    set_Authentication({
                        name: user_name,
                        isAuthenticated: true,
                        isAdmin: response.data.isAdmin
                    })
                    
                );
                

                console.log(response.data.authuser)

                dispatch(
                    updateUserProfile(response.data.authuser))
                navigate('/');
                toast.success("Login successful");
               
            }
        } catch (error) {
            console.log(error.response.data)
            
            toast.error(error.response.data.error)
        }
    };
    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#181818' }}>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'rgb(38,38,38)', padding: '20px', borderRadius: '20px', width: '60%', height: '70%', marginTop: '10vh' }}>
                <ToastContainer />
                    <form onSubmit={login} style={{ textAlign: 'center', marginTop: '30%' }}>
                        <div>
                            <h1 style={{ color: 'whitesmoke' }}>LOGIN</h1>
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <input type='email' placeholder="Email" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }} id='email' />
                        </div>
                        <div>
                            <input type='password' placeholder="Password" style={{ margin: '10px',height: '50px', padding: '10px', paddingLeft:'15px', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }} id='password' />
                        </div>
                        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#B9933C', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '30%' }}>Login</button>

                        <div className="text-sm mt-3 mb-3 float-right">
                                <Link
                                to={'/forgot-password'}
                                className="font-semibold text-indigo-600 hover:text-indigo-500 text-decoration-none"
                                >
                                Forgot password?
                                </Link>
                            </div>
                    
                        <div style={{ cursor: 'pointer', marginTop: '20px', color: 'whitesmoke' }}>


    <Link to='/signup'>
        <a>
            <h4>new user? Click here to signup</h4>
        </a>
    </Link>
</div>

                    </form>
                  
                </div>
            </div>
               {/* Right Section */}
               <div style={{ flex: '1', width: '500px',height: '900px', display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '100%', height: '100%', backgroundImage: `url(${Screens51})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        {/* Empty div */}
    </div>
</div>
    
           
        </div>
    );
    }    

export default User_login;
