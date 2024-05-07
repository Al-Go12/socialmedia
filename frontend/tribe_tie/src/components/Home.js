import React, { useState, useEffect } from 'react'
import postListApi from '../api/postListApi'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';


import styled from 'styled-components';
import PostModal from './postModal'
import { Navigate, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { BASE_URL } from '../constant/api_url'
import ProfilePage from '../pages/User/UserProfile'
import userDetailsApi from '../api/Userdetail'
import { addNotification, clearNotifications, updateUserProfile } from '../store/slice'
import { NavLink } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import createChatRoomApi from '../api/CreateChatRoomApi'
import followUserApi from '../api/followUserApi'
import PostDetailModal from './PostDetailsModal';
import likePostApi from '../api/likePostApi';
import DropdownOptions from './DropdownOptions';
import ReportedPostApi from '../api/ReportPostApi';
import ReportPostModal from './ReportPostModal';
import getNotificationApi from '../api/getNotification';






const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"




const initialPostsToDisplay = 2; // Number of posts to display initially
  


function Home() {



  const Navigate = useNavigate()
  
  
  
  const user=useSelector(state=>state.authentication_user.userProfile)
 
const dispatch=useDispatch()
  
  const [posts, setPosts] = useState([])
  const [usersNotFollowing, setUsersNotFollowing] = useState([])
  const [showAllUsers, setShowAllUsers] = useState(false)
  const [postId, setPostId] = useState(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showPostDetailModal, setShowPostDetailModal] = useState(false)
  const [initialCaption, setInitialCaption] = useState('');
  const [initialImage, setInitialImage] = useState(null);
  const [userdetails,setUser] = useState(null)
  const[showReportedPostModal,setShowModal]=useState(false)

  const [showAllPosts, setShowAllPosts] = useState(false); 

  const access_token = localStorage.getItem('access')

  const createPost = () => {
    if (showPostModal === true) {
      setShowPostModal(false)
    } else {
      setShowPostModal(true)
    }
  }




  const fetchData = async () =>{
    try {
      const data =await postListApi(access_token)
      
      setPosts(data.posts);
      setUsersNotFollowing(data.users_not_following);

      console.log('Posts inside home page fetchData', data.users_not_following)
      
    } catch (error) {
      console.error(error)
    }
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
  
  useEffect(() => {
    const fetchData = async () => {
      try {

        const data = await postListApi()
       
        const notification=await getNotificationApi()
        dispatch(clearNotifications())
        dispatch(addNotification(notification))
        setPosts(data.posts)
        setUsersNotFollowing(data.users_not_following);
        

        handleuserUpdate()
        console.log('posts inside home page useEffect',data)
      } catch (error) {
        console.error(error)
      }
    }
    
    if(user){
    fetchData()}

  }, [])



  const handleUpdatePost = (postId) => {
    setPostId(postId)

    const postToUpdate = posts.find((post) => post.id === postId)
    if (postToUpdate) {
      setInitialCaption(postToUpdate.body)
      setInitialImage(postToUpdate.img)
    }
    setShowPostModal(true)
  }



  const updateCaption = (postId, newCaption) => {
    console.log('Updating caption:', postId, newCaption);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, body: newCaption } : post
      )
    );
  };



  const toggleLikePost = async (postId) => {
    try {
      await likePostApi(postId, fetchData);
    } catch (error) {
      toast.error("Failure, Post not Liked!", {
        position: "top-center",
      });
    }
  };

  const updatePostList = async (newPostData) => {
    try {
      console.log('updatepostlist is working')
      const data = await postListApi(access_token);
      setPosts((prevPosts) => [data.newPost, ...prevPosts]); // Add the new post at the beginning
      setUsersNotFollowing(data.users_not_following);
      console.log('Posts inside home page updatePostList', data.newPost);
    } catch (error) {

      console.error(error);
    }
  };




  if (user === null) {
    return <Navigate to='/login' />
  }

  const closePostModal = () => {
    setShowPostModal(false)
    setShowPostDetailModal(false)
  }

  const showPostDetail = (postId) => {
    setPostId(postId)
    setShowPostDetailModal(true)
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



  const handleReportPost=async(postId)=>{
    try{

      console.log('before api',postId)
      setPostId(postId)
      
      setShowModal(true)
      

      

       

    }
    catch(error){
      toast.error('Failure,post not Resported!',{
        position:'top-center'
       })
    }
  }

 const closereportModal=()=>{
  setShowModal(false)
 }



 



 
  return (


    <>
      <ToastContainer />
      <PostModal isVisible={showPostModal} onClose={closePostModal} postID={postId} initialCaption={initialCaption} initialImage={initialImage} updateCaption={updateCaption} updatePostList={updatePostList} />
      <PostDetailModal isVisible={showPostDetailModal} onClose={closePostModal} postID={postId} />
      <ReportPostModal onClose={closereportModal} isVisible={showReportedPostModal} postID={postId} fetchData={fetchData}/>

      <button onClick={createPost} style={{ backgroundColor: '#B9933C', marginTop: '10px' }} >Add Post</button>

      {posts.length === 0 ? (
  <p className="text-white ">No posts found.</p>
) : (
  posts.slice(0, initialPostsToDisplay).map(post => (
    <div key={post.id} style={{ backgroundColor: 'rgb(38,38,38)', width: '55vw' }} className="text-white my-10 rounded-2xl p-5">
      <div className="flex flex-col mb-2">
        <div className="flex items-center mb-2">
          <img
            src={post.author.display_pic ? `${BASE_URL}${post.author.display_pic}` : DisplayPicture}
            alt="profile_pic"
            className="rounded-full w-12 h-12 mr-2"
          />
          <div className="flex flex-row justify-evenly">
            <div className="text-sm font-semibold">
              <NavLink to={`/follow/${post?.author?.email}`}>
                {post?.author?.username}
              </NavLink>
            </div>
          
            
          </div>
          
        </div>
        <div className="bottom-0 left-0 bg-opacity-50 p-2 flex justify-between">
          <h4 className="text-md text-white">{post.body}</h4>
          <div className='text-white'>
            <DropdownOptions post={post}  handleUpdatePost={handleUpdatePost} handleReportPost={handleReportPost} />
            </div>
        </div>
        <div className="h-96">
          <img src={BASE_URL + post.img} alt="post_image" className="rounded-xl h-full w-full object-contain" />
        </div>
        <div className="p-6">
          <div className="flex flex-row gap-4">
            {post.likes.includes(user.id) ? (
              
              <button
                className='inline-block p-0 text-xs font-medium leading-normal'
                type='button'
                data-te-ripple-init
                data-te-ripple-color='light'
                onClick={() => { toggleLikePost(post.id, true) }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28"><path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" style={{ fill: 'red' }} /></svg>
              </button>
            ) : (
              <button
                className='inline-block p-0 text-xs font-medium leading-normal'
                type='button'
                data-te-ripple-init
                data-te-ripple-color='light'
                onClick={() => { toggleLikePost(post.id, true) }}>
                <span className="material-symbols-outlined" ><FavoriteBorderIcon /></span>
              </button>
            )}
            <button
              className='inline-block p-0 text-xs font-medium leading-normal'
              type='button'
              data-te-ripple-init
              data-te-ripple-color='light'
              onClick={() => { showPostDetail(post.id) }}>
              <ChatBubbleOutlineIcon />
            </button>
            
          </div>
          <p>{post.likes_count ?? 0}&nbsp;likes
          &nbsp;
          {post.comments_count??0}&nbsp;comments
          </p>
         
        </div>
      </div>
    </div>
  ))
)}

{/* Button to show all posts */}
{posts.length > initialPostsToDisplay && !showAllPosts && (
      <button className='text-yellow-300' onClick={() => setShowAllPosts(true)}>Show More Posts</button>
    )}


    {/* Displaying rest of the posts if showAllPosts is true */}
    {showAllPosts && posts.slice(initialPostsToDisplay).map(post => (
      <div key={post.id} style={{ backgroundColor: 'rgb(38,38,38)', width: '55vw' }} className="text-white my-10 rounded-2xl p-5">
       <div className="flex flex-col mb-2">
        <div className="flex items-center mb-2">
          <img
            src={post.author.display_pic ? `${BASE_URL}${post.author.display_pic}` : DisplayPicture}
            alt="profile_pic"
            className="rounded-full w-12 h-12 mr-2"
          />
          <div className="flex flex-row justify-evenly">
            <div className="text-sm font-semibold">
              <NavLink to={`/follow/${post?.author?.email}`}>
                {post?.author?.username}
              </NavLink>
            </div>
          
            
          </div>
          
        </div>
        <div className="bottom-0 left-0 bg-opacity-50 p-2 flex justify-between">
          <h4 className="text-md text-white">{post.body}</h4>
          <div className='text-white'>
            <DropdownOptions post={post}  handleUpdatePost={handleUpdatePost} handleReportPost={handleReportPost} />
            </div>
        </div>
        <div className="h-96">
          <img src={BASE_URL + post.img} alt="post_image" className="rounded-xl h-full w-full object-contain" />
        </div>
        <div className="p-6">
          <div className="flex flex-row gap-4">
            {post.likes.includes(user.id) ? (
              
              <button
                className='inline-block p-0 text-xs font-medium leading-normal'
                type='button'
                data-te-ripple-init
                data-te-ripple-color='light'
                onClick={() => { toggleLikePost(post.id, true) }}>
                <svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="28"><path d="m480-121-41-37q-106-97-175-167.5t-110-126Q113-507 96.5-552T80-643q0-90 60.5-150.5T290-854q57 0 105.5 27t84.5 78q42-54 89-79.5T670-854q89 0 149.5 60.5T880-643q0 46-16.5 91T806-451.5q-41 55.5-110 126T521-158l-41 37Z" style={{ fill: 'red' }} /></svg>
              </button>
            ) : (
              <button
                className='inline-block p-0 text-xs font-medium leading-normal'
                type='button'
                data-te-ripple-init
                data-te-ripple-color='light'
                onClick={() => { toggleLikePost(post.id, true) }}>
                <span className="material-symbols-outlined" ><FavoriteBorderIcon /></span>
              </button>
            )}
            <button
              className='inline-block p-0 text-xs font-medium leading-normal'
              type='button'
              data-te-ripple-init
              data-te-ripple-color='light'
              onClick={() => { showPostDetail(post.id) }}>
              <ChatBubbleOutlineIcon />
            </button>
            
          </div>
          <p>{post.likes_count ?? 0}&nbsp;likes&nbsp;&nbsp;
          {post.comments_count??0}&nbsp;comments
          </p>
          <p></p>
         
        </div>
       
        
          
        
      </div>
    </div>
      
    ))}
    </>
  );



}

export default Home
