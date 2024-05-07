import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../constant/api_url';
 // You can define your own CSS for styling

const Call = ({ show, handleClose, isOutgoing, callerInfo, videoCall ,calltype,AudioCall }) => {
  console.log(show) 
  const calltypes=calltype
  console.log(callerInfo) 
  const [isVisible, setIsVisible] = useState(false);
  const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"
  
  // Hide modal when close button is clicked
  const handleCloseModal = () => {
    setIsVisible(false);
    handleClose();
};

  const handleAccept=()=>{
    if (calltypes=='videocall'){
      videoCall()
    }
    else{
      AudioCall()
    }
    
    setIsVisible(false);

  }
  useEffect(() => {
    setIsVisible(show)
  },[])

  // Customize modal style based on incoming/outgoing call
 

  if (show===false){
    return null
  }
console.log('rendering modal')
  return (
<div className="z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center" id="wrapper">
  <div className="modal-content bg-gray-800 rounded-lg p-8 w-96 flex flex-col items-center">
    {/* Picture of the user calling */}
    <div className='w-20 h-20'>
      <img src={callerInfo?.display_pic ? `${BASE_URL}${callerInfo?.display_pic}` : DisplayPicture} alt="Caller" className="caller-picture rounded-full" />
    </div>
    {/* Additional caller info */}
    <div className="text-white text-center mt-4">
      <h2 className="text-lg font-bold">{callerInfo?.username} is calling</h2>
      <p className="text-sm">Requesting for {calltypes}</p>
    </div>
    {/* Buttons for incoming call */}
    <div className="mt-6 flex gap-4">
      <button className="text-white px-4 py-2 bg-green-500 rounded-md hover:bg-green-600" onClick={handleAccept}>Accept</button>
      <button className="text-white px-4 py-2 bg-red-500 rounded-md hover:bg-red-600" onClick={handleCloseModal}>Decline</button>
    </div>
    {/* Close button */}
    <button className="text-white text-sm mt-4" onClick={handleCloseModal}>Close</button>
  </div>
</div>

    
  );
};

export default Call;
