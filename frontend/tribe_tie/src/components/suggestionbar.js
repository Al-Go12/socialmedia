import { useEffect,useState } from "react"
import React  from 'react'
import postListApi from "../api/postListApi";

import userDetailsApi from "../api/Userdetail";
import followUserApi from "../api/followUserApi";
import { useSelector,useDispatch } from "react-redux";



import styled from 'styled-components';

import { Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { BASE_URL } from '../constant/api_url'


import { updateUserProfile } from '../store/slice'
import { NavLink } from 'react-router-dom';
import createChatRoomApi from "../api/CreateChatRoomApi";

const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"






const SuggessionsContainer = styled.div`
  margin-top: 50px;
  margin-right: 20px;
`;

const SuggesstionsTitle = styled.div`
  color: grey;
  font-weight: bold;
`;

const UsernameLeft = styled.div`
  display: flex;
  align-items: center;
`;

const UsernameInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const Relation = styled.span`
  color: grey;
  font-size: 12px;
`;

const SuggesstionUsername = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const FollowButton = styled.button`
  color: #0095f7;
  font-weight: bold;
  background: 0;
  border: 0;

  &:hover {
    color: #0a4064;
    cursor: pointer;
  }
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

const initialUsersToDisplay = 4;  



function Suggestionbar() {
     


    const user=useSelector(state=>state.authentication_user.userProfile)
    const [usersNotFollowing, setUsersNotFollowing] = useState([])
    const [showAllUsers, setShowAllUsers] = useState(false)
    const dispatch=useDispatch()


    useEffect(() => {
        const fetchData = async () => {
          try {
    
            const data = await postListApi()
           
            
            
            setUsersNotFollowing(data.users_not_following);
            
    
            handleuserUpdate()
            console.log('posts inside home page useEffect',data)
          } catch (error) {
            console.error(error)
          }
        }
    
        fetchData()
    
      }, [])
   
      const access_token = localStorage.getItem('access')

      const fetchData = async () =>{
        try {
          const data =await postListApi(access_token)
          
          setUsersNotFollowing(data.users_not_following);
          console.log('Posts inside home page fetchData', data.users_not_following)
          
        } catch (error) {
          console.error(error)
        }
      }


      const handleToggleFollow = async (userId) =>{
        try {
            await followUserApi(userId,fetchData)
            await createChatRoomApi(userId)
           
            setUsersNotFollowing((prevUsers) =>
              prevUsers.filter((user) => user.id !== userId)
            );
        } catch (error) {
            toast.error('Cannot follow user',{
                position:'top-center'
            })
        }
      }
    
      const toggleShowAllUsers = () => {
        setShowAllUsers(!showAllUsers)
      }



      const handleuserUpdate = async () => {
        try {
          const userdetail = await userDetailsApi();
          dispatch(updateUserProfile(userdetail));
        } catch (error) {
          // Handle errors if needed
          console.error('Error updating user details:', error);
        }
      };



  return (
    <div >
        <SuggessionsContainer className='suggessions w-3/9 '>
          
          <SuggesstionsTitle className="suggesstions__title">Suggesstions for you</SuggesstionsTitle>
          <div className="suggesstions_usernames">
            {usersNotFollowing ? showAllUsers ? usersNotFollowing.map((users) =>(
              <SuggesstionUsername className="suggesstion__username" key={users.id}>
                  <UsernameLeft className="username__left">
                      <span className="avatar">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={users.display_pic ? `${BASE_URL}${users.display_pic}` : DisplayPicture}
                          alt="user_image"
                        />
                      </span>
                      <UsernameInfo className="username__info m-2">
                          <Username className='username'>
                           
                          </Username>
                          <Relation className='relation'>New to Tribe Tie</Relation>
                      </UsernameInfo>
                  </UsernameLeft>
                  {users.email !== user.email &&
                    (users.followers && users.followers.some(
                      (follower) => follower.follower === user.email
                    ) ? (
                          <FollowButton className="follow__button" title={`Unfollow ${users.username}`} onClick={() => handleToggleFollow(users.id)}>Unfollow</FollowButton>
                        ):(
                          <FollowButton className="follow__button" title={`Follow ${users.username}`} onClick={() => handleToggleFollow(users.id)}>Follow</FollowButton>
                  ))}
              </SuggesstionUsername>
            )): usersNotFollowing.slice(0, initialUsersToDisplay).map((users) => (
              <SuggesstionUsername className="suggesstion__username" key={users.id}>
                  <UsernameLeft className="username__left">
                      <span className="avatar">
                        <img
                          className="w-10 h-10 rounded-full"
                          src={users.display_pic ? `${BASE_URL}${users.display_pic}` : DisplayPicture}
                          alt="user_image"
                        />
                      </span>
                      <UsernameInfo className="username__info m-2">
                          <Username className='username'>
                          <NavLink className='font-bold cursor-pointer leading-tight ' to={`/follow/${users.email}`}>
                              {users.username}
                            </NavLink>
                            
                          </Username>
                          <Relation className='relation'>New to Tribe_Tie</Relation>
                      </UsernameInfo>
                  </UsernameLeft>
                  {users.email !== user.email &&
                    (users.followers && users.followers.some(
                      (follower) => follower.follower === user.email
                    ) ? (
                          <FollowButton className="follow__button" title={`Unfollow ${users.username}`} onClick={() => handleToggleFollow(users.id)}>Unfollow</FollowButton>
                        ):(
                          <FollowButton className="follow__button" title={`Follow ${users.username}`} onClick={() => handleToggleFollow(users.id)}>Follow</FollowButton>
                  ))}
              </SuggesstionUsername>
            ))
            :(
              <SuggesstionUsername className="suggesstion__username">
                  {/* Render the first user here */}
              </SuggesstionUsername>
              )}
          </div>
          
         {/*{usersNotFollowing && usersNotFollowing.length > initialUsersToDisplay && (
              <button className='font-bold cursor-pointer' style={{ color: 'gray' }} onClick={toggleShowAllUsers}>
                {showAllUsers ? 'Show Less' : 'Show More'}
              </button>
          )}
           */} 
        </SuggessionsContainer>

      
    </div>
  )
}

export default Suggestionbar
