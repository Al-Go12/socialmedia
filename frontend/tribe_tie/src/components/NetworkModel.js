import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import {Tab,initTWE} from "tw-elements";
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { BASE_URL } from '../constant/api_url';
import styled, { createGlobalStyle } from 'styled-components';
import { NavLink } from 'react-router-dom';
import myNetworkApi from '../api/NetworkApi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';



const Networkmodal = ({ isVisible, onClose }) => {

  if(isVisible){
    console.log("yes network modal is true")
  }


  const [followers,setfollowers] =useState([])
  const [following,setfollowing] = useState([])
  const user=useSelector(state=>state.authentication_user.userProfile)
  const [activeTab, setActiveTab] = useState('following')

  const access_token = localStorage.getItem('access')
  useEffect(() => {
    console.log('before networkapi working')
    const fetchData = async () => {
      try {
        console.log('before networkapi working')
        const data = await myNetworkApi(access_token)
        console.log('after networkapi working')
        setfollowers(data.followers)
        setfollowing(data.following)
      } catch (error) {
        console.error(error)
      }
      
    }
    if (user) {
      fetchData()
    }
  },[user])

  if (!isVisible) return null

  const handleModalClose = (e) => {
    onClose()
  };


  return (
    <div className="z-10 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center "
    id="wrapper">
      {/* Button to open/close the modal */}
      <h1>hai</h1>
  
      {/* Modal */}
      { following.length > 0 && (
        <table>
          <tbody>
            {following.map((item, index) => (
              <tr key={index}>
                <td>
                  <NavLink to={`/profile/${item.email}`} style={{ textDecoration: 'none' }}>
                    <div className='d-flex align-items-center'>
                      <img
                        src={item.display_pic ? `${BASE_URL}${item.display_pic}` : '../images/default_picture.png' }
                        alt={item.username}
                        style={{ width: '45px', height: '45px' }}
                        className='rounded-circle'
                      />
                      <div className='ms-3'>
                        <p className='fw-bold mb-0 text-black'>{item.username}</p>                            
                        <p className='text-muted mb-1'>{item.first_name} {item.last_name}</p>
                      </div>
                    </div>
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );}
  

export default Networkmodal;
