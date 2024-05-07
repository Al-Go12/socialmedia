import axios from "axios";
import { BASE_URL } from "../constant/api_url";

const ReportedPostListApi=async()=>{
    try{
        const accessToken = localStorage.getItem('access')
        const response = await axios.get(`${BASE_URL}/api/Reportedpostlist/`,{
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
                Authorization:`Bearer ${accessToken}`

            }
        })

        if (response.status===200){
            
            console.log('adminRP',response.data)
            return response.data
             
        }
        


    }
    catch(error){
        console.error(error)
        return null

    }
}

export default ReportedPostListApi