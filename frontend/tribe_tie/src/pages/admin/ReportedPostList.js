import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import ReportedPostListApi from '../../api/reportpostlistApi';
import { BASE_URL } from '../../constant/api_url';
import { toFormData } from 'axios';
import reortedPostDetailApi from '../../api/reportedPostDetailsApi';
import ReportedPostDetailModal from '../../components/Admin/ReportedPostDetailModal';

function ReportedPostList() {
  const [posts, setPost] = useState([]);
  const [postId, setPostId] = useState('');

  const reportpostlist = async () => {
    try {
      const response = await ReportedPostListApi();
      if (response) {
        const uniquePosts = response.filter((post, index, self) => 
        index === self.findIndex((p) => (
          p.id === post.id
        ))
      );
      setPost(uniquePosts);
      }
    } catch (error) {
      // Handle any errors here
      console.error('Error fetching reported post list:', error);
    }
  };

  const blockPost = async (id) => {
    const accessToken = localStorage.getItem('access');
    try {
      const response = await fetch(`${BASE_URL}/api/blockpost/${id}/`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      setPost((prevPosts) =>
        prevPosts.map((post) =>
          post.id === id ? { ...post, is_blocked: !post.is_blocked } : post
        )
      );
      toast.success('Blocked/unblocked a user', {
        position: 'top-center',
      });
    } catch {
      console.log('error');
    }
  };

  useEffect(() => {
    reportpostlist();
  }, []);



  

  return (
    <div style={{ backgroundColor: 'rgb(38, 38, 38)' }} className="w-full h-screen p-10 rounded-2xl text-white flex flex-col">
      <ToastContainer />
      <table className="w-full">
        <thead>
          <tr>
            <th>User</th>
            <th></th>
            <th>Caption</th>
            <th>Details</th>
            <th>Posted At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 && <tr><td colSpan="6">No Reported posts Found</td></tr>}
          {posts.map((post) => (
            <tr key={post.id}>
              <td style={{ textAlign: 'center' }}>{post.author.username}</td>
              <td style={{ textAlign: 'center' }}>
  <img
    src={`${BASE_URL}${post?.img}`}
    alt="post image"
    style={{ width: '140px', height: '100px', margin: '5px' }}
  />
</td>

              <td style={{ textAlign: 'center' }}>{post.body}</td>

              <td style={{ textAlign: 'center'  }}>
                < ReportedPostDetailModal pk={post.id}/>
              </td>
              
              
             
              <td style={{ textAlign: 'center' }}>
                <p className='fw-bold mb-0'>{post.first_name} {post.last_name}</p>
                <p className='text-muted mb-0'>{post.created_time} ago</p>
              </td>
              <td>
                <div style={{ textAlign: 'center' }}>
                  <button
                    className={`rounded-md p-2 text-white font-bold relative ${
                      post.is_blocked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                    onClick={() => blockPost(post.id)}
                  >
                    {post.is_blocked ? 'Unblock' : 'block'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReportedPostList;
