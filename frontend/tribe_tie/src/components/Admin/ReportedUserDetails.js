
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import reportedPostDetailApi from '../../api/reportedPostDetailsApi'; 
import axios from 'axios';
import { BASE_URL } from '../../constant/api_url';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  maxHeight: 800,
  overflowY: 'auto', // Adding scrollbar for the table body
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};



const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function ReportedUserDetailModal({pk}) {
  const [open, setOpen] = React.useState(false);
  const [details,setDetails]= React.useState([])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const fetchdata = async () => {
    try{
        const accessToken = localStorage.getItem('access')
        const response = await axios.get(`${BASE_URL}/api/reportuserdetails/${pk}`,{
            headers:{
                Accept:'application/json',
                'Content-Type':'application/json',
                Authorization:`Bearer ${accessToken}`

            }
        })

        if (response.status===200){
            
            console.log(response.data)
            setDetails(response.data)
             
        }
        


    }
    catch(error){
        console.error(error)
        return null

    }
  };
  

  React.useEffect(()=>{
    
    
    if (open) {
      fetchdata(pk);
    }
      

  },[pk,open])

  return (
    <div>
    <Button onClick={handleOpen}>View Details</Button>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography  variant="h5" component="h1" gutterBottom style={{ textAlign: 'center' }}>
          Details
        </Typography>


        <Stack spacing={2}>

        {details && details.map((detail) => (
              <Item key={detail.id}>
               Reason: {detail.reason}

               <br />
                Reported By:
                {detail.reported_user.username}

              </Item>
            ))}
  
</Stack>




       
      </Box>
    </Modal>
  </div>
);
  
}
