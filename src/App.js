import './App.css';
import UserHomePage from './components/HomePage/UserHomePage';
import Login from './components/Login';
import Register from './components/Register';
import AuthGuard from './guards/AuthGuard';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
   BrowserRouter,
   Routes,
   Route, Navigate
} from "react-router-dom";
import Base from './components/basic/Base';

function App() {
   return (
      <>
         <BrowserRouter>
            <Base>
               <Routes>
                  <Route path="/" element={<Navigate to="/login" />}></Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element = {<Register/>}></Route>
                  <Route path="/userHome" element={<AuthGuard><UserHomePage /></AuthGuard>} />
               </Routes>
            </Base>
         </BrowserRouter>
      </>
   );
}

export default App;
