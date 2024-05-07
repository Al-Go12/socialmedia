import React, { useState,useEffect } from 'react'
import userListApi from '../../api/UserList'

import { BASE_URL } from '../../constant/api_url'
import { toast } from 'react-toastify'


import { set_Authentication } from '../../store/slice';
import { useDispatch, useSelector } from 'react-redux';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Link } from 'react-router-dom';



const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"










function Admin_Dasboard() {
  const [users,setUsers] = useState([])
 

 
  

  
  const [loading, setLoading] = useState(true);





    

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        const userList = await userListApi();
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching user list:', error);
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchUserList();
  }, []);



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
}

  if (loading) {
    return <div>Loading...</div>;
  }
    




  return ( 

  <div style={{ backgroundColor: 'rgb(38, 38, 38)' }} className="w-full h-screen  p-10 rounded-2xl  text-white flex flex-col">
    <table className="w-full">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Email</th>
          <th></th>
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
                src={user?.display_pic ? `${BASE_URL}${user?.display_pic}` : DisplayPicture}
                className="rounded-circle"
                alt=""
                style={{ width: '45px', height: '45px' ,margin:'5px'}}
              />
            </td>
            <td style={{ textAlign: 'center'  }}>{user.username}</td>
            <td style={{ textAlign: 'center' }}>{user.email}
            
            
            </td>

            <td>
            <Link to={`userprofile/${user.email}`}>

<button 
className='bg-orange-400'

>
vist profile
</button>
</Link>
            </td>

            <td style={{ textAlign: 'center' }}>
              <span className={`badge rounded-pill d-inline ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </td>
            <td>
            <div style={{ textAlign: 'center' }}>
  <button
    className={`rounded-md p-2 text-white font-bold relative ${
      user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
    }`}
    onClick={() => blockUser(user.id)}
  >
    {user.is_active ? 'Block' : 'Unblock'}
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

export default Admin_Dasboard
