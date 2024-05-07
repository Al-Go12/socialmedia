import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import { BASE_URL } from "../constant/api_url"




const updateAdminToken = async () => {
    const refreshToken = localStorage.getItem("refresh");

    try {
        const res = await axios.post(BASE_URL + '/api/token/refresh/', {
            refresh: localStorage.getItem("refresh")
        }, { headers: {'Content-Type': 'application/json'}},{withCredentials: true});
        console.log('from updateAdminToken\n\n\n', res);
        if (res.status === 200) {
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            return true;
        } else {
            return false;
        }

    } catch (error) {
        return false;
    }
};

const fetchisAdmin = async () => {
    const token = localStorage.getItem('access');
    
    try {
        const res = await axios.get(BASE_URL + '/api/details', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("access")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        return res.data.is_superuser; // Return directly from the function

    } catch (error) {
        return false;
    }
};

const isAuthAdmin = async () => {
    const accessToken = localStorage.getItem("access");
    console.log("admin_Check",accessToken)

    if (!accessToken) {
        return { 'name': null, isAuthenticated: false, isAdmin: false };
    }

    const currentTime = Date.now() / 1000;
    let decoded = jwtDecode(accessToken);

    if (decoded.exp > currentTime) {
         // Await the result

        return {'name':decoded.username, isAuthenticated:true, is_admin:decoded.is_superuser};
    } else {
        const updateSuccess = await updateAdminToken();

        if (updateSuccess) {
            
            return {'name':decoded.username, isAuthenticated:true, is_admin:decoded.is_superuser};
        } else {
            return { 'name': null, isAuthenticated: false, is_admin: false };
        }
    }
};

export default isAuthAdmin;