import { useNavigate } from "react-router-dom";
import { set_Authentication } from "../store/slice";
import { useDispatch, useSelector } from 'react-redux';





const Logout = ()=>{
    

  const navigate = useNavigate();
  const dispatch = useDispatch();
    localStorage.clear();
    dispatch(
      set_Authentication({
        name: null,
        isAuthenticated: false,
        isAdmin:false
      })
    );
    navigate('/')}


    export default Logout




    