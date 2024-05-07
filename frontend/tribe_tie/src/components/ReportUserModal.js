import  React ,{useState} from 'react'
import ReportUserApi from '../api/reportuserApi';
import { ToastContainer, toast } from 'react-toastify';










function ReportUserModal({isVisible,profileid,onClose,fetchData}) {
    
    
    const[show,setModal]=useState(isVisible)
    const [selectedOption, setSelectedOption] = useState('');
    const [customReason, setCustomReason] = useState('');
      
    if( !isVisible ) return null;


    const handleSubmit = async () => {
      const reason = customReason || selectedOption;
      // Perform any logic with the selected reason here
      console.log('Selected reason:', reason);
    try{   

          
          const reasons={'reason':reason}
          const response= await ReportUserApi(profileid,reasons,fetchData)
          if (response){
            console.log('final check',response)
            toast.success(response, {
              position: 'top-center',
            });
          }
        
     

    }
    catch(error){
      console.log(error)


    }


      closeModal();
      onClose();
    };





    const closeModal = () => {
      setModal(false); // Function to close the modal
      onClose()

  };


  


 
  
     

  return (
    
    
    <div className="z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
       <ToastContainer />
      <div className="m-2 w-3/5 flex flex-col rounded bg-white p-4">
        <button className="text-black  text-xl hover:after self-end" onClick={onClose}>
        <span className='font-extrabold ' >x</span>  
        </button>
        <ul className="text-black">
          <li 
            className={`block cursor-pointer p-2 mt-2 hover:bg-gray-300 ${selectedOption === 'Nudity' ? 'bg-gray-500' : ''}`}
            onClick={() => setSelectedOption(' Posting approprate content')}
          >
            Posting approprate content
          </li>
          <li
            className={`block cursor-pointer p-2 mt-2 hover:bg-gray-300 ${selectedOption === 'Violence' ? 'bg-gray-500' : ''}`}
            onClick={() => setSelectedOption('Fake Account ')}
          >
           Fake Account 
          </li>
        </ul>
        <input
          type="text"
          placeholder="Enter custom reason"
          className="border border-gray-300 p-2 mt-2"
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
        />
        <button className="w-20 bg-green-100 mt-2 px-4 py-2" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
  }  

export default ReportUserModal
