import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../constant/api_url'
import styled from 'styled-components';
import {useParams, useNavigate  } from 'react-router-dom';
import PostDetailModal from './PostDetailsModal';
import notificationSeenApi from '../api/notificationSeenApi';
import { useDispatch, useSelector } from 'react-redux';

import removeNotificationById from '../store/slice';
const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png";





const Container = styled.div`
  background-color: #f9f9f9;
  padding: 20px;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  background-color: #fafafa;

  &:hover {
    background-color: #fafafa;
  }
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const NotificationText = styled.p`
  
  margin: 0;
  flex: 1;
`;

// Function to generate notification message


 








  const getNotificationMessage = (notification) => {
   
    const { notification_type, post, comment } = notification;
    if (post) {
      if (notification_type === 'comment') {
        return 'commented on your post';
      } else if (notification_type === 'like') {
        return 'liked your post';
      } else if (notification_type === 'post') {
        return 'created a new post';
      } else if (notification_type === 'blocked') {
        return 'blocked your post';
      }
    } else if (comment) {
      if (notification_type === 'comment') {
        return 'replied to your comment';
      }
    }
    return 'started following you';
  };
  
  const seenNotifications = {};

  const Notifications = () => {
    
    

  
  const notifications = useSelector(state => state.authentication_user.notifications.flat());
  

  const [showPostDetailModal, setShowPostDetailModal] = useState(false);
  const [postId, setPostId] = useState(null);
  const dispatch = useDispatch()
  const navigate=useNavigate()

  const removeNotification = (notificationIdToRemove) => {
    
    dispatch(removeNotificationById(notificationIdToRemove));
  };
    const onClick = async (notificationId, email, notificationType, postId) => {
      try {

        console.log(notificationType)
        if (notificationType === 'like' || notificationType === 'comment' || notificationType === 'post') {
          // Check if the notification has been seen already
          if (!seenNotifications[notificationId]) {
            seenNotifications[notificationId] = true; // Mark the notification as seen
            setPostId(postId);
            setShowPostDetailModal(true);
          }
        } else if (notificationType === 'blocked') {
          console.log('blocked');
        } else {
          navigate(`/follow/${email}`);
        }
        await notificationSeenApi(notificationId);
        removeNotification(notificationId)

        // removeNotification(notificationId);
       
      
        console.log('Notification id:', notificationId);
        console.log('Email:', email);
        console.log('Notification type id:', notificationType);
        console.log('post id:', postId);

      } catch (error) {
        console.log(error);
      }
    };

    const goBack = () => {
      
        window.history.back(); 
  };
  
    return (
      <div
      className="z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center "
      id="wrapper"
    >
      <div className="m-2 w-3/5 flex flex-col p-2 rounded">
        <button className="text-white text-xl place-self-end"  onClick={goBack}>
          x
        </button>
      <div className="text-white text-center"><p>NOTIFICATIONS</p></div>
        
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <NotificationItem key={index} onClick={() => onClick(notification.id, notification.from_user.email, notification.notification_type, notification.post)}>
             <Avatar 
  src={notification.from_user.display_pic ? `${notification.from_user.display_pic}` : DisplayPicture} 
  alt="User Avatar" 
/>

              <NotificationText>
                
                {notification.notification_type === 'blocked'
                  ? 'Admin blocked your post'
                  : `${notification.from_user.first_name} ${notification.from_user.last_name} ${getNotificationMessage(notification)}`}
              </NotificationText>
            </NotificationItem>
          ))
        ) : (
          <p  className='text-white mt-10'>No Notifications</p>
        )}
        </div>
     </div>
    );
  };
  
  export default Notifications;
