





import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import reportedPostDetailApi from '../../api/reportedPostDetailsApi'; 

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


export default function ReportedPostDetailModal({pk}) {
  const [open, setOpen] = React.useState(false);
  const [details,setDetails]= React.useState([])
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  

  React.useEffect(()=>{
    
    const fetchData = async () => {
        if (open) {
          try {
            const response = await reportedPostDetailApi(pk);
            console.log(response)
            setDetails(response);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }
      };
    if (open) {
      fetchData();
    }
      

  },[pk,open])

  return (
    <div>
      <Button onClick={handleOpen}>View Reasons</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} style={{ textAlign: 'center' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Details
          </Typography>


          <Stack spacing={2}>

{details && details.map((detail) => (
      <Item key={detail.id}>
       Reason: {detail.reason}

       
       

      </Item>
    ))}

</Stack>
          
        </Box>
      </Modal>
    </div>
  );
  
}
