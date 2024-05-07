import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReportPostModal from './ReportPostModal';


const DropdownOptions = ({post,handleDeletePost, handleUpdatePost,handleReportPost}) => {


  const user=useSelector(state=>state.authentication_user.userProfile)

  const [show,setShow] = useState(false);
  
  
  
  //const { user } = useSelector(state=>state.user);



  

  const handleClick =()=>{
    setShow(!show);
  };

  

  const menuOpt = post?.author?.email === user?.email ? [{ label: 'Delete' }, { label: 'Update' }] : [{ label: 'Report' }];
 //const menuOpt = [{ label: 'Delete' }, { label: 'Update' }]

  return (
    <div className="   relative text-sm font-bold inline-block">

        <button
            type="button"
            className="rounded-full inline-block font-medium uppercase leading-normal focus:outline-none"
            data-te-ripple-init
            data-te-ripple-color="light"
            onClick={handleClick}
            >
            <MoreVertIcon />
        </button>
        
        
        

      {show && (
        <div className='absolute bg-white text-black rounded-md shadow-lg top-0 right-0 mt-8' style={{ zIndex: 9999 }}> 
        {menuOpt.map((menu)=>(
          <div
          key={menu.label}
          className='block cursor-pointer p-2 mt-2 hover:bg-gray-100'
          onClick={()=>{
            if(menu.label === 'Delete'){
              handleDeletePost(post.id);
              handleClick();
            }else if(menu.label === 'Update'){
              handleUpdatePost(post.id);
              handleClick();
            }
            else if( menu.label==='Report'){

              console.log('reportchecking',post.id)
              handleReportPost(post.id)
              handleClick();
              

              
            }
          }}>
              {menu.label}
          </div>

        ))}
        </div>
      )}
    </div>
  );
};

export default DropdownOptions
