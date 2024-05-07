import axios from 'axios'
import { BASE_URL } from '../constant/api_url'


const createPostApi = async (content, postImage) => {
    try {
        const accessToken = localStorage.getItem('access');
        console.log('hai',accessToken.username)
        const formData = new FormData();
        formData.append('body', content);
        formData.append('img', postImage);

        const response = await axios.post(`${BASE_URL}/api/post/create-post/`, formData, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 201) {
            return response.data;
          } else {
            console.log(response.error);
            return null
          }
    }
    catch(error){
        console.log(error);
        return null
    }
}

export default createPostApi
