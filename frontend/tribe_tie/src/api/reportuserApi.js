import axios from "axios";
import { BASE_URL } from "../constant/api_url";

const ReportUserApi = async(profileid,reasons,fetchData,handleClose)  => {
          

    try{
        let accessToken=localStorage.getItem('access')
        const response=await axios.post(`${BASE_URL}/api/report-user/${profileid}/`,reasons,{
            headers:{
                Accept:'application/json',
                Authorization:`Bearer ${accessToken}`,
            },
        })
        if (response.status===200){
            console.log(response.data)
            
            if(fetchData){
                fetchData()
            }
            return response.data
        }
        else{
            console.log(response.error)
        }
    }
    catch(error){
        console.log(error)
    }

};

export default ReportUserApi;


