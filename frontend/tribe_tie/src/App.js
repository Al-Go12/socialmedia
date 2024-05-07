import { Provider } from 'react-redux';
import  User_registration  from './pages/User/user_registration';
import  User_login  from './pages/User/user_login';
import AdminLogin from './pages/admin/AdminLogin';
import { store } from './store/store';
import { BrowserRouter as Router , Routes, Route } from 'react-router-dom';

import UserWrapper from './wrapper/UserWrapper';
import AdminWrapper from './wrapper/AdminWrapper';
import { ToastContainer } from 'react-toastify';




function App() {
  document.title = "Tribe Tie"; // Set the new tab title
  return (
    <div>
      <Provider store={store}>
        <ToastContainer/>
        <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminWrapper/>}/>
          <Route path='/*' element={<UserWrapper/>}/>
        </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
