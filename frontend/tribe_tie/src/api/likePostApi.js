import axios from "axios";
import { BASE_URL } from "../constant/api_url";
import axiosInstance from '../utils/axiosInstance';
const likePostApi = async (postId, fetchData) => {
    try {
      const accessToken = localStorage.getItem('access');
      
      const response = await axiosInstance({
        url: `/post/like/${postId}/`,
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });
      if (response.status === 200) {
        console.log('Post like toggled successfully');
        if (fetchData) {
          console.log("fetingdata")
          fetchData(); 
        }
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export default likePostApi;