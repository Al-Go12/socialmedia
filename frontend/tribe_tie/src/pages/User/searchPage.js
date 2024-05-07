import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal';
import { MDBTable, MDBTableBody } from 'mdb-react-ui-kit';
import { BASE_URL } from '../../constant/api_url';
import styled, { createGlobalStyle } from 'styled-components';
import { NavLink } from 'react-router-dom';
import SearchApi from '../../api/SearchApi';
import SearchIcon from '@mui/icons-material/Search';
const DisplayPicture = "https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"




const GlobalStyle = createGlobalStyle`
  .scrollbar {
    margin-left: 30px;
    float: left;
    height: 20px;
    width: 65px;
    background: #fff;
    overflow-y: scroll;
    margin-bottom: 25px;
  }
  
  .scrollbar-ripe-malinka {
    scrollbar-color: #f5576c #f5f5f5;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #f5f5f5;
    border-radius: 10px;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }
  
  .scrollbar-ripe-malinka::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-image: -webkit-linear-gradient(330deg, #f093fb 0%, #f5576c 100%);
    background-image: linear-gradient(120deg, #f093fb 0%, #f5576c 100%);
  }
`;

const CenteredTable = styled(MDBTable)`
  width: 80%;
  margin: 0 auto;
  margin-top:30px;
`;

const modalBodyStyle = {
    maxHeight: '650px',
};

const contentStyle = {
    maxHeight: '450px',
};

const StyledTableRow = styled.tr`
  border-width:0px;
  td {
    border-bottom: 0px none rgb(254, 254, 254);
    border-width:0;
    width:32%;
    &:hover {
      cursor: pointer;
      background-color: #EBEAEA !important;
    }
  }
`;








function SearchPage() {
    const isVisible = true
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [searchData, setSearchData] = useState([])
    const [postId, setPostId] = useState(null)
    const [showPostDetailModal, setShowPostDetailModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("");

    const handleInputChange = async (e) => {
        const value = e.target.value
        setInputValue(value);

    };

    const handleInputFocus = () => {
        setIsFocused(true);
    };

    const handleInputBlur = () => {
        setIsFocused(false);
    };



    const handleSearch = async (query) => {
        setSearchQuery(query);
        const value = query

        try {
            const data = await SearchApi(value)
            setSearchData(data)
            const usersData = data?.user_data?.users
            const postsData = data?.post_data?.posts
            console.log('users:', usersData)
            console.log('posts:', postsData)
            console.log('searchData', searchData)
        } catch (error) {
            console.error(error)
        }




    };


    const handleClose = () => {
        window.history.back(); 

    };

    const handleViewPost = (postId) => {
        setPostId(postId)
        setShowPostDetailModal(true)
    }

    return (

        <div
            className="z-50 fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
            id="wrapper"
            
        >


            <div
                style={{ backgroundColor: 'rgb(38,38,38)' }}
                className="m-2 w-[800px] flex flex-col">
                <button className="text-white text-xl place-self-end" onClick={handleClose}>
                    x
                </button>
           


            <div className='m-2 w-[800px] flex flex-col '>
              <div className="input-group mb-3" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        className="form-control"
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                  
                    <button className="text-white ml-2" type="button">  <SearchIcon/></button>
                </div>






                <div>
                    {searchData?.user_data?.users?.length > 0 && (
                        <table>
                            <tbody>
                                {searchData.user_data.users.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <NavLink to={`/follow/${item.email}`} style={{ textDecoration: 'none' }}>
                                                <div className='my-5 flex flex-row border-2 border-gray-300 rounded-md'>
                                                    <img
                                                        src={item.display_pic ? `${BASE_URL}${item.display_pic}` : DisplayPicture}
                                                        alt={item.username}
                                                        style={{ width: '45px', height: '45px', borderRadius: '20px' }}
                                                        className='rounded-circle'
                                                    />
                                                    <div className='ms-3'>
                                                        <p className='fw-bold mb-0'>{item.username}</p>
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
            </div>

            </div>

        </div>

    );
};

export default SearchPage
