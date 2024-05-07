import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Screens51 from '../../additional/Group39.png'



import { BASE_URL } from "../../constant/api_url";

const ForgotPassword = () => {

    const [error , setError] =useState('')
    const [successMessage , setSuccessMessage] = useState('')

    
    const [formData,setFormData] = useState({
        email:'',
    })

    const {email} = formData

    const onChange = e =>{
        setFormData({...formData , [e.target.name]:e.target.value})
    }

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${BASE_URL}/api/forgot-password/`, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });
      
          const data = await response.json();
      
          if (response.status === 200) {
            console.log('Email sent successfully');
            setSuccessMessage('Email sent successfully');
            setError('');
          } else {
            console.error('Error occurred', data);
            setError(data.message);
            setSuccessMessage('');
          }
        } catch (error) {
            console.error('Error occurred', error);
            setError('Error occurred while sending email');
            setSuccessMessage(''); 
        }
    };

  return (


    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#181818' }}>
    <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ backgroundColor: 'rgb(38,38,38)', padding: '20px', borderRadius: '20px', width: '60%', height: '70%', marginTop: '10vh' }}>
        
            <form onSubmit={handleSubmit } style={{ textAlign: 'center', marginTop: '30%' }}>
                <div>
                    <h1 style={{ color: 'whitesmoke' }}>Forget Password</h1>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <input type='email'  
                    value={email}
                    id='email'
                    name='email'
                        onChange={onChange} placeholder="Email" style={{ margin: '10px', height: '50px', padding: '10px', paddingLeft:'15px', borderRadius: '15px', width: '80%', backgroundColor: '#181818', color: '#fff' }}  />
                </div>
                
               
                <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#B9933C', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '30%' }}>Send</button>

                {error && <p className="text-danger mt-2">{error}</p>}
                    {successMessage && <p className="text-success mt-2">{successMessage}</p>}
            
                

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

export default ForgotPassword
