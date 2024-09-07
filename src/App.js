import './App.css';
import { lazy, Suspense } from 'react';
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
const  UserProfile = lazy(()=>import('./components/user/UserProfile'));
const  AllUsers =  lazy(()=>import('./components/user/AllUsers'));

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
                  <Route path="/userProfile" element={<AuthGuard>
                     <Suspense fallback={<div>Loading...</div>}>
                        <UserProfile />
                     </Suspense>
                     </AuthGuard>} />
                  <Route path="/allUsers" element={<AuthGuard>
                     <Suspense fallback={<div>Loading...</div>}>
                        <AllUsers />
                     </Suspense>
                     </AuthGuard>} />
               </Routes>
            </Base>
         </BrowserRouter>
      </>
   );
}

export default App;
