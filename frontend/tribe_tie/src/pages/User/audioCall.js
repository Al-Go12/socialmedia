import React, { useRef,useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';





const AudioCall=()=>{
    let { roomId } = useParams();
    const navigate=useNavigate()
    const containerRef = useRef(null);
    
    const user=useSelector(state=>state.authentication_user.userProfile)
    const handleLeaveRoom = () => {
        navigate('/messages');
    }
    
    
    useEffect(()=>{
    

        const myMeeting= async (element)=>{
            const userID = user.id.toString();
    
            const userName =user.username ;
          
            const roomID=roomId
            const appID=1407489276;
            const serverSecret="d7fcf37d3b945ec7f887333a29e73cd9";
            const kitToken=ZegoUIKitPrebuilt.generateKitTokenForTest(appID,
              
                
                
                serverSecret,
                roomID,
                userID, 
                userName
                
                )
            
    
            const zc =ZegoUIKitPrebuilt.create(kitToken)
    
            zc.joinRoom({
                container:containerRef.current,
                scenario:{
                    mode:ZegoUIKitPrebuilt.OneONoneCall,
                },
                turnOnCameraWhenJoining: false,
                showMyCameraToggleButton: false,
                showPreJoinView: false,
                turnOnMicrophoneWhenJoining: true,
              onLeaveRoom:handleLeaveRoom,
        }) }  


 myMeeting()


    },[])
 
    


    
    
    
     return <div>
           <div className="w-full h-full"ref={containerRef} />
         </div>

    }
    


  




export default AudioCall