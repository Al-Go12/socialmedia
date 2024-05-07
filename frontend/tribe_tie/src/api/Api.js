import axios from 'axios'
import React from 'react'
import { BASE_URL } from '../constant/api_url'



 export const AuthAxios = axios.create({
   baseURL: `${BASE_URL}/auth`,
   // timeout: 3000,
 });


 AdminAxios.interceptors.request.use(
   config => {
     const token = localStorage.getItem('access');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   },
   error => {
     return Promise.reject(error);
   }
 );





