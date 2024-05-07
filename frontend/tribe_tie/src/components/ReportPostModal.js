import  React ,{useState} from 'react'
import ReportedPostApi from '../api/ReportPostApi';
import { ToastContainer, toast } from 'react-toastify';










function ReportPostModal({isVisible,postID,onClose,fetchData}) {
    
    console.log(isVisible,postID)
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
          const response= await ReportedPostApi(postID,reasons,fetchData)
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
        <div className='text-center'>
          <h1> What do you want to report</h1>
        </div>
        <ul className="text-black">
          <li 
            className={`block cursor-pointer p-2 mt-2 hover:bg-gray-300 ${selectedOption === 'Nudity' ? 'bg-gray-500' : ''}`}
            onClick={() => setSelectedOption('Nudity')}
          >
            Nudity
          </li>
          <li
            className={`block cursor-pointer p-2 mt-2 hover:bg-gray-300 ${selectedOption === 'Violence' ? 'bg-gray-500' : ''}`}
            onClick={() => setSelectedOption('I just dont like it ')}
          >
            I just dont't like it 
          </li>


          <li
            className={`block cursor-pointer p-2 mt-2 hover:bg-gray-300 ${selectedOption === 'Violence' ? 'bg-gray-500' : ''}`}
            onClick={() => setSelectedOption('False Information')}
          >
            False Information
          </li>
          <li
            className={`block cursor-pointer p-2 mt-2 hover:bg-gray-300 ${selectedOption === 'Violence' ? 'bg-gray-500' : ''}`}
            onClick={() => setSelectedOption('Violence')}
          >
            Violence
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

export default ReportPostModal
