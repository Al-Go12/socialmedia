
import axiosInstance from "../utils/axiosInstance";

const myNetworkApi = async (userToken,email) => {
    try {
      console.log("checking networ email",email)
      const response = await axiosInstance({

        url: `/post/network/${email}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      if (response.status === 200) {
        console.log("networks", response.data);
        return response.data;
      } else {
    
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
      
    }
  };

export default myNetworkApi
