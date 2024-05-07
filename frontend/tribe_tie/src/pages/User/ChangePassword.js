import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate,useParams } from "react-router-dom";
import Screens51 from '../../additional/Group39.png'
import { ToastContainer,toast } from "react-toastify";
import { BASE_URL } from "../../constant/api_url";

import axios from "axios";

const ChangePassword = () => {

    const [error , setError] =useState('')
    const navigate = useNavigate()
   

    const dispatch = useDispatch()
    
    const [formData,setFormData] = useState({
        password:'',
        password1:''
    })
    const {password,password1} = formData

    const {userId} = useParams()

    const onchange = (e) =>{
        setFormData({ ...formData, [e.target.name] : e.target.value})
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try {
            if(password===password1){
                console.log('the user id is:',userId)
                const response = await axios.post(`${BASE_URL}/api/change-password/${userId}/`,formData,{
                    headers:{
                        'Accept':'application/json',
                        'Content-Type':'application/json',
                    },
                })

                if(response.status === 200){
                    console.log('Password change successfully')
                    navigate('/login')
                } else {
                    console.error('Error occured',response.data)
                    setError(response.data.message)
                }
            }else{
                toast.error("Password mis-match")
            }
        } catch (error) {
            console.error('Error occurred', error);
            setError('Error occurred while Changing password');
        }
        
    }

  return (


    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#181818' }}>
      <ToastContainer/>
    <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'rgb(38,38,38)', padding: '20px', borderRadius: '20px', width: '60%', height: '70%', marginTop: '10vh' }}>
        
            <form onSubmit={handleSubmit } style={{ textAlign: 'center', marginTop: '30%' }}>
                <div>
                    <h1 style={{ color: 'whitesmoke' }}>Forget Password</h1>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <input id="password"
                  name="password"
                  placeholder="New Password"
                  type="password"
                  value={password}
                  onChange={onchange} 
                  required
                  style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }}  />
                </div>
                

                <div style={{ marginBottom: '20px' }}>
                    <input   id="password1"
                  name="password1"
                  placeholder="Confirm New Password"
                  type="password"
                  value={password1}
                  onChange={onchange}
                  required style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }}  />
                </div>
                
               
                <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#B9933C', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '30%' }}> Submit</button>

              
            
                

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

export default ChangePassword
