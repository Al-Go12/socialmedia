import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import { BASE_URL } from "../constant/api_url";





const updateUserToken = async ()=>{
    const refreshToken = localStorage.getItem("refresh");
    console.log('geting refresh token')
    try {
        const res = await axios.post(BASE_URL+'/api/token/refresh/', 
        {
            'refresh':localStorage.getItem("refresh")
        })
        if(res.status === 200){
          console.log('refreshtokenupdated----------------->')
          localStorage.setItem('access', res.data.access)
          localStorage.setItem('refresh', res.data.refresh)
          let decoded = jwtDecode(res.data.access);
          console.log('decode', decoded)
          return {'name':decoded.name,isAuthenticated:true, is_admin:decoded.is_admin}
        }
        else
        {
            return {'name':null,isAuthenticated:false,is_admin:false, }
        }  
      }
      catch (error) {
         return {'name':null,isAuthenticated:false,is_admin:false, }
      }
}




  
    const IsAuthUser = async () => {

     
      
        const accessToken = localStorage.getItem("access");
        console.log('checking accesstoken token')
        if(!accessToken)
        {
          
            return {'name':null,isAuthenticated:false}
        }
        const currentTime = Date.now() / 1000;
        let decoded = jwtDecode(localStorage.getItem("access"));
    

        if (decoded.exp > currentTime) {
            console.log('main',decoded.name)
            return {'name':decoded.username, isAuthenticated:true, is_admin:decoded.is_superuser};
          } else {
            
            const updateSuccess = await updateUserToken();
            console.log(updateSuccess)
            return updateSuccess;
          }
    }  

    export default IsAuthUser



  
