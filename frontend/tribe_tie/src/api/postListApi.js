import axios from 'axios'

import axiosInstance from '../utils/axiosInstance'
import { BASE_URL } from '../constant/api_url'


const postListApi = async () =>{
    try{
        const accessToken = localStorage.getItem('access')
        const response = await axios.get(`${BASE_URL}/api/post/Home`, {
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
            return { posts: [], users_not_following: [] };
        }
    } catch(error){
        console.error('API Error:', error);
        return { posts: [], users_not_following: [] }
    }
}

export default postListApi