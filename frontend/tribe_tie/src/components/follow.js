import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Link, NavLink, Navigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

import { BASE_URL } from '../constant/api_url'; 
import ProfileUpdateModal from './ProfileUpdate';
import userProfileApi from '../api/UserProfileApi';
import checkfollowstatusapi from '../api/checkfollowestatusapi';
import { prototype } from 'postcss/lib/warning';
import PostDetailModal from './PostDetailsModal';
import IsAuthUser from '../utils/isAuthUser';
import userDetailsApi from '../api/Userdetail';
import { ToastContainer, toast } from 'react-toastify';
import createChatRoomApi from '../api/CreateChatRoomApi';
import followUserApi from '../api/followUserApi';
import ReportedPostApi from '../api/ReportPostApi';
import {set_Authentication, updateUserProfile } from '../store/slice';
import myNetworkApi from '../api/NetworkApi';
import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@material-ui/core';
import ReportUserModal from './ReportUserModal';






const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"




const UserPage = styled.div`
  display: flex;
  height: 100vh;
  width : 100vw;
  background-color:#181818
`;


const ProfileContentWrapper = styled.div`
  width:100%;
  display: flex;
  flex-direction: column; /* Display children in a column */
//   padding-left: 16.5%;
justify-content: space-around;
  height : fit-content;
`;

const ProfileContainer = styled.div`
  width:80%;
  margin: 0;
  display : flex !important;
  justify-content : space-between ;
//   flex: 0.8;
//   display: grid;
//   grid-template-columns: 1fr 2fr;
  font-family: Arial, Helvetica, sans-serif;
//   padding: 0em ;
  margin-top: 4em;
  margin-bottom: 0em;
`;


const NetworkContainer = styled.div`
 margin:0;
 width:80%;
 display:flex!important;
 justifyContent:space-between;

 
 
    `;

const ProfilePhoto = styled.div`
  background: #000;
  width: 10em;
  height: 10em;
  border-radius: 50%;
  margin-top: 0.5em;

  @media screen and (max-width: 600px) {
    width: 5em;
    height: 5em;
    margin-top: 3em;
    margin-right: 2em;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }

  img:hover {
    opacity: 0.7;
  }
`;



const CustomText = styled.span`
  font-weight: bold;
  font-size: 18px; 
`;

const UserName = styled.div`
  display: flex;
  align-items: center;
`;


const ImagesContainer = styled.div`
  display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap:10px;
  align-items: baseline;
  justify-content: space-around;
 //  padding:5px 400px;
  margin-top:10px;
//  padding : 30px 25px;
padding-left: 22%; /* Adjust the left padding */
  padding-right: 15%; /* Adjust the right padding */


`;



const ImagesWrapper = styled.div`
  margin-top: 2em; /* Adjust the margin as needed to create space between the profile and images */
`;

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 30px; /* Increase margin-bottom to create space between images in the same column */
//   margin-left: 0px; /* Decrease margin-left to reduce space between images in the same row */

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  img:hover {
    opacity: 0.7;
  }
`;
const Follow = () => {

  const param = useParams()
  const email = param.email
  console.log(email)
  
    const [posts, setPosts] = useState([]);
    const [postId,setPostId] =useState(null)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [showPostDetailModal,setShowPostDetailModal] = useState(false)
    const [followers,setfollowers] =useState([])
    const [following,setfollowing] = useState([])
   

    const [isLoading, setIsLoading] = useState(false)
    const [isFollowingLocal, setIsFollowingLocal] = useState(false)
    const [profile, setProfile] = useState(null)
    const [showNetworkModal , setShowNetworkModal] = useState(false)
    const [showBlockButton, setShowBlockButton] = useState(false); 
    const[shownetwork,setnetwork]=useState(true)
    const[showpostgrid,setpostgrid]=useState(false)
    const[showReported,setShowModal]=useState(false)




    
        const [anchorEl, setAnchorEl] = useState(null);
      
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
        };
      
        const handleClose = () => {
          setAnchorEl(null);
        };
      
       
      
        const handleBlockUser = () => {
          // Implement block user logic here
          
        };
      

  // Other state variables...

  const toggleBlockButton = () => {
    setShowBlockButton(!showBlockButton);
  };


    const dispatch = useDispatch()
    
    const filteredFollowers = followers.filter(follower => {
    // Assuming you want to show only followers and not the following
    return follower.follower === 'gokulshabu007@gmail.com';
  });



    const access_token=localStorage.getItem('access')

    const user=useSelector(state=>state.authentication_user.userProfile)
    
    
    const fetchData = async () => {
        try {
          
            const data = await userProfileApi(email)
            const rdata = await myNetworkApi(access_token,email)
            
            
            if (data && data.profile_user) {
               
              console.log('checkin profile',data.profile_user)
                // dispatch(updateUserProfile(data?.profile_user))
                console.log('checkin id',data.profile_user.id)
                console.log('checking user',user)
                setProfile(data.profile_user)
                setPosts(data.profile_posts)
                setfollowers(rdata.followers)
                setfollowing(rdata.following)
                // setIsLoading(false)
            } else {
                console.error('Profile data is undefined')
                // setIsLoading(false)
            }

        } catch (error) {
            console.error(error)
        }
    }

    const checkAuth =async()=>{
        console.log('check4')
        const isAuthenticated=await IsAuthUser();
        
        dispatch(
            set_Authentication({
                name:isAuthenticated.name,
                isAuthenticated:isAuthenticated.isAuthenticated
            })
        )
        
    }


   

   
  
    useEffect(()=>{
       
        if(user?.username === null){
          checkAuth()
          
        }
        else{
            fetchData()

            
            
        }
    },[user,param])




    useEffect(() => {
      if (profile && user) {
        const fetchFollowStatus = async () => {
          try {
            const response = await checkfollowstatusapi(profile.email)
            if (!response.error) {
              const { isFollowing } = response;
              setIsFollowingLocal(isFollowing);
            } else {
              // Handle the error case, e.g., show an error message
              console.log('Error checking follow status:', response.error);
            }
          } catch (error) {
            console.error(error);
          }
        };
        fetchFollowStatus();
      }
    }, [profile,param]);


    
    const blockuser=async()=>{
      const id=profile.id
      try {
          const response=await fetch(`${BASE_URL}/api/blockuser-user/${id}/`,{
              method:'GET',
              headers:{
                  Accept:'application/json',
                  Authorization:`Bearer ${access_token}`,
              },
          })
          const data = await response.json();
          if(response.status===200){
              toast.success(data.message,{
                  position:'top-center'
                 })
              console.log('checking message',data.message) 
              fetchData()  
          }
          else{
              console.log(data)
          }
      } catch (error) {
          console.log(error)
          
      }
      handleClose();
  }


    const handleViewPost = (postId) =>{
        setPostId(postId)
        setShowPostDetailModal(true)
        



      }
      
      const handleReportPost=async(postId,reason)=>{
        try{
           await ReportedPostApi(postId,reason,fetchData)
           toast.success('post Reported sucessfully',{
            position:'top-center'
           })

        }
        catch(error){
          toast.error('Failure,post not Resported',{
            position:'top-center'
           })
        }
      }
      
      const handleToggleFollow = async (userId) => {
        try {
          const updatedProfile = { ...profile };
          await  followUserApi(userId)
          await createChatRoomApi(userId);
          if (isFollowingLocal) {
            updatedProfile.following_count -= 1;
          } else {
            updatedProfile.following_count += 1;
      
            // Call an asynchronous function
            await createChatRoomApi(userId);
          }
      
          setProfile(updatedProfile);
        } catch (error) {
          console.error(error);
        }
      };
      


    
      const closereportModal=()=>{
        setShowModal(false)
       }
      


    //
    
   
    return (
        <UserPage>
          <ToastContainer/>
            < ProfileContentWrapper>
                {/* Profile content */}
                <ProfileContainer>
                    <ProfileUpdateModal isVisible={showProfileModal} onClose={() => setShowProfileModal(false)  } />
                   <ReportUserModal 
                   
       onClose={closereportModal} isVisible={showReported} profileid={profile?.id} fetchData={fetchData}

                   />
                    <PostDetailModal isVisible={showPostDetailModal} onClose={() =>setShowPostDetailModal(false)} postID={postId}/>
                    <div style={{ color:'whitesmoke', padding:'5px',backgroundColor: 'rgb(38,38,38)' , display : 'flex', justifyContent : 'center',width :'100%'}}>
                        <div style={{ backgroundColor: 'rgb(38,38,38)', marginRight : '1rem' }}>
                            <label htmlFor="profilePhotoInput">
                                <ProfilePhoto>
                                    <img src={
                                        user?.email === profile?.email ?
                                            user?.display_pic ? `${BASE_URL}${user?.display_pic}` : DisplayPicture
                                            : profile?.display_pic ? `${BASE_URL}${profile.display_pic}` : DisplayPicture} alt="profile" />
                                </ProfilePhoto>
                            </label>
                        </div>
                        <div className="profile-content">
                            <UserName>
                            
                <p className="name mr-5" style={{ fontWeight: 'bold', fontSize:'x-large', margin:'0px -3px'}}>{profile?.username ?? ""}</p>

                {user?.email !== profile?.email && (
                  isFollowingLocal ? (
                    <Button
                      className='ml-5'
                      type='button'
                      variant='outline-secondary'
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      title={`Unfollow ${profile?.username}`}
                      onClick={() => handleToggleFollow(profile?.id)}
                    >
                      Unfollow
                     </Button>




                  ) : (
                    <Button
                    style={{  backgroundColor: '#B9933C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width:'25%'}}
                      className='ml-5'
                      type='button'
                      variant='outline-primary'
                      data-te-ripple-init
                      data-te-ripple-color="light"
                      title={`Follow ${profile?.username}`}
                    onClick={() => handleToggleFollow(profile?.id)}
                    >
                      Follow
                    </Button>





                
                  )

                 
         

                )}

                              
                                

                            </UserName>
                            <div className="stats">
                                <div className="flex" style={{ marginLeft: '-20px' }}>
                                    <div className="lg:mr-4 p-3 text-center">
                                        <CustomText style={{ fontWeight: 'bold' }} className="text-sm text-blueGray-400">{profile?.total_posts ?? "0"}  Posts</CustomText>
                                    </div>
                                    <div className="flex">
                                        <div className="mr-4 p-3 text-center"
                                        onClick={() => setShowNetworkModal(true)}
                                        
                                        
                                        >
                                            <CustomText style={{ fontWeight: 'bold', cursor: 'pointer' }} className="text-sm text-blueGray-400">
                                                {profile?.following_count ?? "0"}  Followers
                                            </CustomText>
                                        </div>
                                        <div className="mr-4 p-3 text-center">
                                            <CustomText style={{ fontWeight: 'bold', cursor: 'pointer' }} 
                                            className="text-sm text-blueGray-400"
                                            onClick={() => setShowNetworkModal(true)}
                                            >
                                              
                                                {profile?.follower_count ?? "0"} Following
                                                
                                            </CustomText>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="about">{`${user.first_name ?? ""} ${user.last_name ?? ""}`}</p>
                           {user?.email===profile?.email&&(
                             <button  style={{  backgroundColor: '#B9933C', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width:'25%'}} onClick={() => setShowProfileModal(true)}>EditProfile</button>
                           )}
                           
                        </div>


                     
                       


                        
                          {user?.email!=profile?.email&&(

<div className='mr-0'>
<button onClick={handleClick}><MoreVertIcon /></button>
<Menu
  anchorEl={anchorEl}
  keepMounted
  open={Boolean(anchorEl)}
  onClose={handleClose}
>
  <MenuItem onClick={() => setShowModal(!showReported)}>Report</MenuItem>
  <MenuItem onClick={blockuser}>
  {user?.blocked_users.includes(profile?.id) ? 'Unblock' : 'Block'}
  </MenuItem>
</Menu>
</div>
                          )}
                          


                    </div>


                    

                </ProfileContainer>

               
                <ProfileContainer ><div style={{ color:'whitesmoke', padding:'20px',backgroundColor: 'rgb(38,38,38)' , display : 'flex', justifyContent : 'center',width :'100%'}}>
                <button   className={`w-20 mx-10 ${ shownetwork ? 'bg-yellow-300':''} text-black rounded-md`}onClick={() => { setnetwork(!shownetwork); setpostgrid(false); }}>
        Follow
      </button>
      <button 
      className={`w-20 mx-10 ${showpostgrid ? 'bg-yellow-300' : ''} text-black rounded-md`} onClick={() => { setpostgrid(!showpostgrid); setnetwork(false); }}>
        Post
      </button>
                    </div></ProfileContainer>
              { showpostgrid && <ImagesContainer >
                    {posts && posts.length > 0 ? (
                        posts.map((post) => (
                            <ImageWrapper
                                
                                key={post.id}
                                onClick={() => handleViewPost(post.id)}

                            >
                                <img src={`${BASE_URL}${post.img}`} alt="post" />
                            </ImageWrapper>
                        ))
                    ) : (
                        <h1 className='text-white'>No Posts Available.</h1>
                    )}
                </ImagesContainer>}



                {
                    shownetwork&&<NetworkContainer>
                        <div style={{ color:'whitesmoke', padding:'20px',backgroundColor: 'rgb(38,38,38)' , display : 'flex', justifyContent : 'center',width :'100%'}}>
                     
                        <div className=' mx-10'>
                            Following
                        { followers.length > 0 && (
        <table>
          <tbody>
            {followers.map((item, index) => (
              <tr key={index}>
                <td >
                  <NavLink to={`/follow/${item.email}`} style={{ textDecoration: 'none' }}>
                    <div className=' my-5 flex flex-row border-2 border-gray-300 rounded-md'>
                      <img
                        src={item.display_pic ? `${BASE_URL}${item.display_pic}` : DisplayPicture }
                        alt={item.username}
                        style={{ width: '45px', height: '45px', borderRadius:'20px' }}
                        className='rounded-circle'
                      />
                      <div className='ms-3'>
                        <p className='fw-bold mb-0'>{item.username}</p>                            
                        <p className='text-muted mb-1'>{item.first_name} {item.last_name}</p>
                      </div>
                    </div>
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}



 
                        </div>



                        <div>
                            Followers



                            <div>
                                 { following.length > 0 && (
        <table>
          <tbody>
            {following.map((item, index) => (
              <tr key={index}>
                
                <td >
                  <NavLink to={`/follow/${item.email}`} style={{ textDecoration: 'none' }}>
                    <div className=' my-5 flex flex-row border-2 border-gray-300 rounded-md'>
                      <img
                        src={item.display_pic ? `${BASE_URL}${item.display_pic}` : DisplayPicture }
                        alt={item.username}
                        style={{ width: '45px', height: '45px' ,borderRadius:'20px' }}
                        className='rounded-circle '
                      />
                      <div className='ms-3'>
                        <p className='fw-bold mb-0'>{item.username}</p>                            
                        <p className='text-muted mb-1'>{item.first_name} {item.last_name}</p>
                      </div>
                    </div>
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
                            </div>
                        </div>
                        </div>
                        
                    </NetworkContainer>
                }

            </ProfileContentWrapper>
        </UserPage>
    );
};

export default Follow;
