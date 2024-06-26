import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createUser } from "../../services/AuthService";
import { useDispatch } from "react-redux";
import AuthContext from "../../guards/AuthProvider";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userLogin, userLogout } from "../../redux/slices/AuthSlice";
import Cookies from "js-cookie";

export default function Register() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { setStatus } = useContext(AuthContext);


    const [errorMsg, setErrorMsg] = useState(false);
    const [loader, setLoader] = useState(false);
    const [isError, setError] = useState(false);


    const { register, handleSubmit, formState: { errors }, getValues } = useForm();

    const matchPassword = (e) => {
        if ((e.target.value) === (getValues('password'))) {
            setErrorMsg(false);
        }
        else {
            setErrorMsg(true);
        }
    }

    const registerUser = async (data) => {
           setLoader(true);
           const response = await createUser(data);
           if (!response.hasError) {
            setStatus(true);
            dispatch(userLogin(response.data));
            Cookies.set('user' , JSON.stringify(response.data) , {expires : 1});
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
        setLoader(false);
    }

    return (
        <>

            <div className="login-page align bg-dark">

                <div className="grid">

                    <form className="login form" onSubmit={handleSubmit(registerUser)}>

                        <div>
                            <div className="form__field">
                                <label htmlFor="login__username"><span>Name</span></label>
                                <input id="login__username" type="text" name="name" className="form__input" placeholder="Fullname"

                                    {...register("name", {
                                        required: "Please enter your name !!",
                                        validate: (value) => {
                                            if (!(/^[a-zA-Z\s]+$/).test(value?.trim())) {
                                                return "Enter characters only";
                                            }
                                            return true;
                                        }
                                    })}
                                />
                            </div>
                            {errors.name && <p className="text-center text-danger p-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <div className="form__field">
                                <label htmlFor="login__email"><span>Email</span></label>
                                <input id="login__email" type="text" name="email" className="form__input" placeholder="Username"

                                    {...register("email", {
                                        required : "Email can't be empty !!",
                                        validate: (value) => {
                                            if (value == null || !value.includes('@')) {
                                                return "Enter valid email !!"
                                            }
                                            return true;
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && <p className="text-center text-danger p-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <div className="form__field">
                                <label htmlFor="login__password"><span>Password</span></label>
                                <input id="login__password" type="password" name="password" className="form__input" placeholder="Password"
                                    {
                                    ...register("password", {
                                        required: "Please Enter a password !!"
                                    })
                                    }
                                />
                            </div>
                            {errors.password && <p className="text-center text-danger p-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <div className="form__field">
                                <label htmlFor="login__confirmPassword"><span>Confirm Password</span></label>
                                <input id="login__confirmPassword" onChange={(e) => matchPassword(e)} type="password" name="confirmPassword" className="form__input" placeholder="Re-Enter" />
                            </div>
                            {errorMsg && <p className="text-center text-danger p-1">Password & Confirm Password should match !!</p>}
                        </div>

                        <div>
                            <div className="form__field">
                                <label htmlFor="login__age"><span>Age</span></label>
                                <input id="login__age" type="number" name="age" className="form__input" placeholder="Age"
                                    {
                                    ...register('age', {
                                        required: 'Please enter age',
                                        valueAsNumber : true,
                                        validate: (value) => {
                                            if (value < 1 || value > 150) {
                                                return "Please enter correct age";
                                            }
                                            return true;
                                        }
                                    })
                                    }
                                />
                            </div>
                            {errors.age && <p className="text-center text-danger p-1">{errors.age.message}</p>}
                        </div>

                        <div className="form__field mt-4">
                            <input disabled={errorMsg || loader} type="submit" value={loader ? "Loading..." : "Sign Up"} />
                        </div>

                    </form>

                    <p className="text-center text-white p-3 m-0">Already a member? <Link to={"/login"}><span>Log In</span></Link> <svg className="icon"><use href="#arrow-right"></use></svg></p>

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