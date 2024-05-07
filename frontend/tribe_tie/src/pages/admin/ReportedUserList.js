import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ReportedPostListApi from '../../api/reportpostlistApi';
import { BASE_URL } from '../../constant/api_url';
import axios, { toFormData } from 'axios';
import reortedPostDetailApi from '../../api/reportedPostDetailsApi';
import ReportedPostDetailModal from '../../components/Admin/ReportedPostDetailModal';
import ReportedUserDetailModal from '../../components/Admin/ReportedUserDetails';
const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"

function ReportedUserList() {
    const [users,setUsers] = useState([])
  

  const fetchdata = async () => {
    try{
        const accessToken = localStorage.getItem('access')
        const response = await axios.get(`${BASE_URL}/api/reporteduserlist/`,{
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
                Authorization:`Bearer ${accessToken}`

            }
        })

        if (response.status===200){
            
          const uniqueUsers = Array.from(new Set(response.data.map(user => user.user.id))).map(id => {
            return response.data.find(user => user.user.id === id);
          });
    
          setUsers(uniqueUsers);
             
        }
        


    }
    catch(error){
        console.error(error)
        return null

    }
  };

  const blockUser = async (id) =>{
    const accessToken = localStorage.getItem('access')
    try {
        const response = await fetch(`${BASE_URL}/api/blockuser/${id}`,{
            method:'GET',
            headers:{
                Accept:'application/json',
                Authorization:`Bearer ${accessToken}`
            },
        })
        console.log(response)
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user.id === id ? { ...user,is_active: !user.is_active } : user
        ))
        toast.success('Blocked/Unblocked a User',{
            position:'top-center',
        })
    } catch {
        console.log('error')
    }
    fetchdata();
}

  useEffect(() => {
    fetchdata();
  }, []);



  

  return (
    <div style={{ backgroundColor: 'rgb(38, 38, 38)' }} className="w-full h-screen  p-10 rounded-2xl  text-white flex flex-col">
    <table className="w-full">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Email</th>
          <th>details</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 && <tr><td colSpan="5">No Users Found</td></tr>}
        {users.map((user) => (
          <tr key={user.id}>
            <td style={{margin:'2px'}}>
              <img 
                src={user?.user?.display_pic ? `${BASE_URL}${user?.user?.display_pic}` : DisplayPicture}
                className="rounded-circle"
                alt=""
                style={{ width: '45px', height: '45px' ,margin:'5px'}}
              />
            </td>
            <td style={{ textAlign: 'center'  }}>{user.user.username}</td>
            <td style={{ textAlign: 'center' }}>{user.user.email}</td>
            <td
style={{ textAlign: 'center'  }}
> <ReportedUserDetailModal pk={user.user.id}/></td>
            <td style={{ textAlign: 'center' }}>
              <span className={`badge rounded-pill d-inline ${user.user.is_active ? 'bg-success' : 'bg-danger'}`}>
                {user.user.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td>
            <div style={{ textAlign: 'center' }}>
  <button
    className={`rounded-md p-2 text-white font-bold relative ${
      user.user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
    }`}
    onClick={() => blockUser(user.user.id)}
  >
    {user.user.is_active ? 'Block' : 'Unblock'}
  </button>
</div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
}

export default ReportedUserList;
