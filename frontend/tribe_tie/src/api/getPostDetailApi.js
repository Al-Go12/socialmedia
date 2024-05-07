// api cll to get the detail of each sigle post.!
import axios from 'axios';
import { BASE_URL } from '../constant/api_url';
import axiosInstance from '../utils/axiosInstance';



const getPostDetailApi = async (postID) => {
 try{
    console.log('haicheckgetpost')



    
        const accessToken = localStorage.getItem('access')
        const response = await axios.get(`${BASE_URL}/api/post/post-details/${postID}`, {
            headers: {
                Accept : 'application/json',
                'Content-Type':'application/json',
                Authorization:`Bearer ${accessToken}`
            }
        })
       
      if (response.status === 200) {
        console.log("homepage->post details->", response.data);
        return response.data;
      } else {
        console.log('homepage->p',response.error);
      }
    } catch (error) {
      console.log('homepage->p',error);
    } 
};

export default getPostDetailApi
