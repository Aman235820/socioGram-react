import './App.css';
import UserHomePage from './components/HomePage/UserHomePage';
import AuthGuard from './guards/AuthGuard';
import Login from './components/user/Login';
import Register from './components/user/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
   BrowserRouter,
   Routes,
   Route, Navigate
} from "react-router-dom";
import Base from './components/basic/Base';
import UserProfile from './components/user/UserProfile';
import AllUsers from './components/user/AllUsers';

function App() {
   return (
      <>
         <BrowserRouter>
            <Base>
               <Routes>
                  <Route path="/" element={<Navigate to="/login" />}></Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />}></Route>
                  <Route path="/userHome" element={<AuthGuard><UserHomePage /></AuthGuard>} />
                  <Route path="/userProfile" element={<AuthGuard><UserProfile /></AuthGuard>} />
                  <Route path="/allUsers" element={<AuthGuard><AllUsers /></AuthGuard>} />
               </Routes>
            </Base>
         </BrowserRouter>
      </>
   );
}

export default App;
