import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constant/api_url';
import {  ToastContainer ,toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Screens51 from '../../additional/Group39.png'


function User_registration() {





    const Navigate=useNavigate()
    const [otp, setOtp] = useState("")
    const [formError, setFormError] = useState([])
    const [UserID, setUserID] = useState(null)





    const userregistration = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmpassword.value;
    
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            toast.error("Password mismatch", {
                position: "top-center",
            });
            return; // Stop further execution if passwords don't match
        }
    

        

        const formData = new FormData();
        formData.append("email", e.target.email.value);
        formData.append("password", e.target.password.value);
        formData.append("username", e.target.username.value);
        formData.append("first_name", e.target.firstname.value);
        formData.append("last_name", e.target.lastname.value);
        
        

        try {
            const response = await axios.post(BASE_URL + '/api/register', formData);
            console.log(response.data); // Handle the response as needed
            if (response.status === 201) {
               console.log(response.data.id)
                setUserID(response.data.id)
                
          
                console.log("OTP sent")
                toast.success("OTP sent", {
                    position: "top-center",
                });



                return response
            }
        } catch (errors) {


            for (let key in errors.response.data.errors) {
                const errorArray = errors.response.data.errors[key];
                const errorMessage = errorArray[0]; // Access the first element of the array
                toast.error(errorMessage, {
                    position: "top-center",
                });
                console.log(errorMessage);
            }}
            
    };




    const verify_otp = async(e) => {
        e.preventDefault()
        
        setOtp(e.target.otp.value)
        console.log(otp);
            
            await axios.patch(BASE_URL + `/api/otp/verify`,{"OTP":otp, 'UserID':UserID}).then(
                (response) => {

                    console.log('Verified Successfully')
                    toast.success("signup sucessfully", {
                        position: "top-center",
                    });
                    Navigate('/login',{state:response.data.Message})
                   
                }
            ).catch((err) => {
                if(err.response.status == 422)
                toast.error( 'invalid otp', {
                    position: "top-center",
                })
                console.log(err);
                
            })
    }

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#181818' ,justifyContent: 'center', alignItems: 'center'  }}>
             <ToastContainer />
            {/* Left Section */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ backgroundColor:  'rgb(38,38,38)', padding: '50px', borderRadius: '20px', width: '60%', height: '80%', marginTop: '10vh' }}>
                    <form onSubmit={userregistration} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ color: 'whitesmoke' }}>User Registration</h1>
                        <div>
                            <input type="email" id="email" name="email" placeholder="Email" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', border: 'none', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }} required />
                        </div>
                        <div>
                            <input type="text" id="username" name="username" placeholder="Username" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', border: 'none', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }} required />
                        </div>
                        <div>
                            <input type="text" id="firstname" name="firstname" placeholder="first name" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', border: 'none', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }}  required/>
                        </div>
                        <div>
                            <input type="text" id="lastname" name="lastname" placeholder="Last name" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', border: 'none', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }} required />
                        </div>
                        <div>
                            <input type="password" id="password" name="password" placeholder="password" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', border: 'none', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }}  required/>
                        </div>
                        <div>
                            <input type="password" id="confirmpassword" name="confirmpassword" placeholder="confirmPassword" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', border: 'none', borderRadius: '15px', width: '60%', backgroundColor: '#181818', color: '#fff' }} required />
                            <button type="submit" style={{ margin: '10px',  padding: '8px',backgroundColor: '#B9933C', height: '45px',border: 'none', borderRadius: '10px', width: '20%', color: '#fff' }}>Get OTP</button>
                        </div>
                        
                    </form>
                    <form onSubmit={verify_otp} style={{ textAlign: 'center', marginTop: '30px' }}>
                        <input type="text" id="otp" name="otp" placeholder="Enter OTP"   maxLength="4" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', border: '1px solid #ccc', borderRadius: '15px', width: '50%', backgroundColor: '#181818', color: '#fff' }} />
                        <button type="submit" style={{ margin: '10px', padding: '8px 20px', backgroundColor: '#B9933C', color: '#fff', border: 'none', borderRadius: '15px', cursor: 'pointer' }}>Verify OTP</button>
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



export default User_registration;
