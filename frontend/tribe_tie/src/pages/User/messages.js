import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import { BASE_URL } from '../../constant/api_url'
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Call from '../../components/Call';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import contactListApi from '../../api/ContactListApi';
import getChatMessageApi from '../../api/getChatMessageApi';
import messageSeenApi from '../../api/MessageSeenApi';
import SideBar from '../../components/SideBar';
import { VideoCall } from '@mui/icons-material';
import CallIcon from '@mui/icons-material/Call';
const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"


const MessagePage = styled.div`
  display: flex;
  height: 100vh;
`;

const NavContainer = styled.div`
  width: 16.5%;
  background-color:#181818;
  top:0;
  bottom:0;
  position:fixed;
  border-right:double
`;

const MessageContentWrapper = styled.div`
  width:100%;
  display: flex;
  flex-direction: column; /* Display children in a column */
  padding-left: 16.5%;
  background-color:#181818
`;

const MessageContainer = styled.div`
  margin: 0;
  flex: 0.8;
  display: grid;
  grid-template-columns: 1fr 2fr;
  font-family: Arial, Helvetica, sans-serif;
  padding: 0em 0em 2em 5em;
  margin-top: 4em;
  margin-bottom: 2em;
`;



const ProfileInfo = styled.div`
.name {
  font-size: 1.5em;
  margin-bottom: 0;
  font-weight: 600
}

.about {
  font-size: 1em;
  color: #545454;
}



.stats {
  margin-left: -17px;
}

.profile-content {
  margin-left: 1rem; /* Adjust the margin as needed */
}
`;

const ChatInput = styled.div`

  position: fixed;
  bottom: 25px;
  width: 44%;
  background-color: #c2c2c2;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 1000;
`;


const Messages = () => {

  const user =useSelector(state => state.authentication_user.userProfile)
  console.log(user)
  const [profiles, setProfiles] = useState([])
  const [ws,setWs] = useState(null)
  const [messages , setMessages] = useState([])
  const [inputMessage , setInputMessage] = useState('')
  const [bg,setBg] = useState(false)
  const [dpChat , setDpChat] = useState(null)
  const[show,showCall]=useState(false)
  const[isOutgoing,setOutgoing]=useState(false)
  const [room_id, setRoom_id] = useState(null)
  const[callerInfo,setCallerInfo]=useState({})
  const[calltype,setCallType]=useState('')
  
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await contactListApi()
        setProfiles(result)
       
      } catch (error) {
        console.error(error)
      }
    }
    
    if (user) {
      fetchData()
    }

  },[user])


  
  useEffect(() =>{
    if (ws) {
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log("Received message:", message); 
        if (message.type==="videocall"){
          const  link =message.link
          const caller=message.sender
          setCallerInfo(caller)
          setCallType('videoCall')
          setRoom_id(link)
          console.log("checking if condition")
          showCall(true)
          setOutgoing(false) }

          if (message.type==="audiocall"){
            const  link =message.link
            const caller=message.sender
            setCallerInfo(caller)
             setCallType('audioCall')
            setRoom_id(link)
            console.log("checking if of audiocall condition")
            showCall(true)
            setOutgoing(false) }
            
     
        setMessages((prevMessage) => [...prevMessage,message])}


      }
  },[ws])

  const ref = useChatScroll(messages)

  function useChatScroll(dep) {
    const ref = useRef()
    useEffect(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight
      }
    }, [dep])
    return ref
  }


 

  const closecall=()=>{
    showCall(false)
  }

 
   
   


  const handleSendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN && inputMessage.trim() !== "") {
      ws.send(JSON.stringify({ message: inputMessage,Type:"text_message" }));
     
      setInputMessage("");
    } else {
      console.error("WebSocket connection is not open or input message is empty.");
    }
  };
  



  const joinChatroom = async (chatroomId, userId , dp_image) => {
    try {
      setBg(true);
      setDpChat(dp_image);
      // await createChatRoomApi(userId);
     
      const accessToken = localStorage.getItem("access");
      const websocketProtocol =  window.location.protocol === "http:" ? "ws://" : "ws://";
      //const wsUrl = `${websocketProtocol}${window.location.host}/ws/chat/${chatroomId}/?token=${accessToken}`;
      
       const wsUrl = `${websocketProtocol}127.0.0.1:8000/ws/chat/${chatroomId}/?token=${accessToken}`;
      const newChatWs = new WebSocket(wsUrl);
      console.log('checking websocket')

      newChatWs.onopen = async () => {
        console.log("Chatroom WebSocket connection opened.");
        // Fetch previous messages when the WebSocket connection is opened
        const previousMessages = await getChatMessageApi(chatroomId);
        setMessages(previousMessages);
        await messageSeenApi(userId);
        setProfiles((prevProfiles) => {
            return prevProfiles.map((profile) => {
              if (profile.id === chatroomId) {
                // Set unseen_message_count to zero
                return { ...profile, unseen_message_count: 0 };
              }
              return profile;
            });
          });
        };
        // newChatWs.onerror = (event) => {
        //   console.error('WebSocket error:', event);
        // };
        
        newChatWs.onclose = (event) => {
          if (event.wasClean) {
            console.log(`WebSocket connection closed cleanly, code: ${event.code}, reason: ${event.reason}`);
          } else {
            console.error(`WebSocket connection closed abruptly, code: ${event.code}, reason: ${event.reason}`);
          }
        };
        newChatWs.onmessage = (event) => {
          const message = JSON.parse(event.data)

            if (message.type==="videocall"){
              const  link =message.link
              setRoom_id(link)
              setCallType('videoCall')
              console.log("checking if condition")
              showCall(true)
              setOutgoing(false) }  
            
            console.log(message);
            // Handle incoming messages from the chatroom WebSocket
          };

        setWs(newChatWs);
    } catch (error) {
      console.error(error);
    }
  }

  function randomID(len) {
    let result = '';
    if (result) return result;
    var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
      maxPos = chars.length,
      i;
    len = len || 5;
    for (i = 0; i < len; i++) {
      result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
  }


  const handlevideoCall = () => {
    if (ws && ws.readyState === WebSocket.OPEN ) {

      const roomId=randomID(10)
      ws.send(JSON.stringify({ message: "videoCall",Type:"videocall",link:roomId }));
      navigate(`/RoomPage/${roomId}`)
      setInputMessage("");
    } else {
      console.error("WebSocket connection is not open or input message is empty.");
    }
  }; 

  const handleaudioCall=()=>{
    if (ws && ws.readyState === WebSocket.OPEN ) {

      const roomId=randomID(10)
      ws.send(JSON.stringify({ message: "audioCall",Type:"audiocall",link:roomId }));
      navigate(`/AudioCall/${roomId}`)
      setInputMessage("");
    } else {
      console.error("WebSocket connection is not open or input message is empty.");
    }
   

  }




  const videoCall=()=>{
    const roomId=room_id
    navigate(`/RoomPage/${roomId}`)
      
  }



  const AudioCall=()=>{
    const roomId=room_id
    navigate(`/AudioCall/${roomId}`)
      
  }


  return (
    <MessagePage>
      <NavContainer>
      <SideBar/>
      </NavContainer>
      <MessageContentWrapper>

      <Call callerInfo={callerInfo} show={show} handleClose={closecall} isOutgoing={isOutgoing} videoCall={videoCall} calltype={calltype} AudioCall={AudioCall} />  
      <div className="flex h-screen  p-2">
        <div className="flex flex-col flex-grow w-3/5 mt-10 p-1 m-20z   rounded-lg overflow-hidden" style={{backgroundColor:'rgb(38,38,38)'}}>
       
          {bg ? (
            <div ref={ref} className="flex flex-col flex-grow  h-0  overflow-auto  mb-5  relative">
            <div className='bg-white max-w-full h-10 ' style={{position:"fixed",width:'53%',display: 'flex', justifyContent: 'flex-end'}}> 
            <div className='text-black text-lg mr-2'>
              
             <button className='text-lg mr-3' onClick={handleaudioCall} >
              <CallIcon/>

              </button> 
             

              <button className='text-lg' onClick={handlevideoCall}>

              <VideoCall/>
              </button>
            
            
            </div>
            </div>
              {messages?.map((message, index) =>
                message?.sender_email === user.email ? (
                  <div
                    key={index}
                    className="flex w-full mt-10 space-x-3 max-w-xs ml-auto justify-end"
                  >
                    <div>
                      <div className="bg-green-500 text-white p-1 rounded-l-lg rounded-br-lg">
                        <p className="text-sm m-1">
                          {message.message ? message.message : message.text}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 leading-none">
                        {message.created} ago
                      </span>
                    </div>
                    <img
                      className="flex-shrink-0 h-10 w-10 rounded-full"
                      
                      src={user?.display_pic ? `${BASE_URL}${user?.display_pic}` : DisplayPicture}
                      alt="user"
                    />
                  </div>
                ) : (
                  <div key={index} className="flex w-full mt-2 space-x-3 max-w-xs">
                    <img
                      className="flex-shrink-0 h-10 w-10 rounded-full"
                      src={`${BASE_URL}`+dpChat}
                      alt="user"
                    />
                    <div>
                      <div className="bg-gray-300 p-1 rounded-r-lg rounded-bl-lg">
                        <p className="text-sm m-1">
                          {message.message ? message.message : message.text}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 leading-none">
                        {message.created} ago
                      </span>
                    </div>
                  </div>
                )
              )}
              <div className="my-7 flex-grow"></div>
              
                <ChatInput>
                  <div className=" relative flex w-full flex-wrap items-stretch">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="relative m-0 -mr-0.5 block w-[1px] min-w-0 flex-auto rounded-l border border-solid border-[#4b2848] bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                      aria-describedby="button-addon1"
                    />
                    <button
                      className="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase leading-tight text-[#4b2848] shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                      type="button"
                      onClick={handleSendMessage}
                      id="button-addon1"
                      data-te-ripple-init
                      data-te-ripple-color="light"
                    >
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </ChatInput>
              
            </div>
          ) : (
            <div className="flex flex-col flex-grow p-4 overflow-auto">
              <p className="mx-auto my-auto text-white">Select person to start messaging</p>
            </div>
          )}
        </div>
        <div className="w-2/6 mt-10 p-1 m-2 overflow-y-auto"style={{backgroundColor:'rgb(38,38,38)'}}>
          {profiles ? (
            profiles.map((profile) => (
              <div
                key={profile.id}
                onClick={() => joinChatroom(profile.id, profile.members[0].id, profile.members[0].display_pic)}
                className="flex items-center rounded-lg m-1 cursor-pointer bg-gray-300 p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
              >
                {profile.unseen_message_count > 0 && (
                  <div className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 rounded-full w-6 h-6 flex items-center justify-center">
                    {profile.unseen_message_count}
                  </div>
                )}

                <img
                  className="w-14 rounded-full h-14  mr-2"
                  src={profile.members[0].display_pic?BASE_URL + profile.members[0].display_pic:DisplayPicture}
                  alt="profile"
                />
                <div className="flex-grow">
                  <h5 className="mb-1 text-sm font-medium leading-tight text-neutral-800 text-start">
                    {profile.members[0].username}
                  </h5>
                </div>
              </div>
            ))
          ) : null}
        </div>
      </div>
      </MessageContentWrapper>
    </MessagePage>
  )
}

export default Messages
