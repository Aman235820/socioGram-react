import { useDispatch } from "react-redux";
import AuthContext from "../guards/AuthProvider";
import { loginApi } from "../services/AuthService";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userLogin, userLogout } from "../redux/slices/AuthSlice";

export default function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { setStatus, setLoggedInUserId } = useContext(AuthContext);


    const [loginDetails, setLoginDetails] = useState({
        username: "aman@gmail",
        password: "123"
    });

    const [isError, setError] = useState(false);

    // useEffect(()=>{
    //     setStatus(false);
    //     console.log(status);
    // },[]);

    const handleUsername = (e) => {
        setLoginDetails(prev => {
            return ({ ...prev, username: e.target.value })
        });
    }

    const handlePassword = (e) => {
        setLoginDetails(prev => {
            return ({ ...prev, password: e.target.value })
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await loginApi(loginDetails);
        if (!response.hasError) {
            setStatus(true);
            dispatch(userLogin(response.data));
            setLoggedInUserId(response.data.id);
            navigate("/userHome");

            const timer = 4.5 * 60 * 60 * 1000;

            setTimeout(() => {
                dispatch(userLogout(response.data.id));
                navigate("/");
            }, timer);

        }
        else {
            setError(true);
            setStatus(false);
        }
    }





    return (
        <>

            <div className="login-page align bg-dark md-5">

                <div className="grid">

                    <form className="login form">

                        <div className="form__field">
                            <label htmlFor="login__username"><svg className="icon"><use href="#user"></use></svg><span className="hidden">Username</span></label>
                            <input id="login__username" type="email" defaultValue={"aman@gmail"} onChange={handleUsername} name="username" className="form__input" placeholder="Username" required />
                        </div>

                        <div className="form__field">
                            <label htmlFor="login__password"><svg className="icon"><use href="#lock"></use></svg><span className="hidden">Password</span></label>
                            <input id="login__password" type="password" defaultValue={"123"} onChange={handlePassword} name="password" className="form__input" placeholder="Password" required />
                        </div>
                        {isError && <span className="text-center text-white p-3 m-0" >Enter correct username or password !!</span>}
                        <div className="form__field mt-4">
                            <input type="submit" value="Sign In" onClick={handleSubmit} />
                        </div>

                    </form>

                    <p className="text-center text-white p-3 m-0">Not a member? <Link to={"/register"}><span>Sign up now</span></Link><svg className="icon"><use href="#arrow-right"></use></svg></p>

                </div>

                <svg xmlns="http://www.w3.org/2000/svg" className="icons">
                    <symbol id="arrow-right" viewBox="0 0 1792 1792"><path d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z" /></symbol>
                    <symbol id="lock" viewBox="0 0 1792 1792"><path d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z" /></symbol>
                    <symbol id="user" viewBox="0 0 1792 1792"><path d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z" /></symbol>
                </svg>
            </div>


        </>
    );

}