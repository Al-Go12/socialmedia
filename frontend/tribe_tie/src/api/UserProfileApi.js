import axios from 'axios'
import { BASE_URL } from '../constant/api_url'


const userProfileApi = async (name) => {
  try {
    const accessToken = localStorage.getItem('access')
    const response = await axios.get(`${BASE_URL}/api/post/profile/${name}/`,{
        headers: {
            Accept:'application/json',
            Authorization:`Bearer ${accessToken}`,
        },
    })

    if (response.status === 200 ) {
        console.log('profile in Api',response.data)
        return response.data
    } else {
        console.log('error in profile Api')
        console.log(response.error)
    }
  } catch (error){
    console.log('error in profile Api')
    console.error(error)
  }
}

export default userProfileApi
