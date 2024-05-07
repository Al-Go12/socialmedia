import axiosInstance from "../utils/axiosInstance";


const getNotificationApi = async () => {
    try {
      const response = await axiosInstance({
        url: `/post/notifications/`,
        method: "GET",
      });
      if (response.status === 200) {
        console.log("notification view", response.data);
        return response.data;
      } else {
        console.log(response.error);
      }
    } catch (error) {
      return error
    }
  };

export default getNotificationApi