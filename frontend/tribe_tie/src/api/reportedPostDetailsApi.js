

import axiosInstance from '../utils/axiosInstance'
import { BASE_URL } from '../constant/api_url'
import axios from 'axios'


const reportedPostDetailApi = async (pk) =>{
    try{
        const accessToken = localStorage.getItem('access')
        const response = await axios.get(`${BASE_URL}/api/post/reported-post-details/${pk}`, {
            headers: {
                Accept : 'application/json',
                'Content-Type':'application/json',
                Authorization:`Bearer ${accessToken}`
            }
        })
        
        if(response.status === 200){
           
            return response.data
        }else{
            console.error('Error:', response.status, response.statusText);
            return response.error
        }
    } catch(error){
        console.error('API Error:', error);}
        
}

export default reportedPostDetailApi 

