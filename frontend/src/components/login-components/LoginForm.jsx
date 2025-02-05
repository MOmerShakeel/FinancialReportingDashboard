import { useNavigate } from "react-router-dom";
import "./LoginForm.css"
import LogoFull from "../../assets/primafull.jpg";
import { FaGithub, FaGoogle, FaFacebookF, FaChevronRight  } from "react-icons/fa6";
import { FaUser, FaLock } from "react-icons/fa";

function LoginForm() {
    //useNavigate Hook
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate("/dashboard");
    };

    return <>
        <div className="container">
            <div className="screen">
                <div className="screen__content">
                    <img src={LogoFull} alt="logo" className="logo__full" />
                    <form className="login">
                        <div className="login__field">
                            <i className="login__icon"><FaUser/></i>
                            <input type="text" className="login__input" placeholder="User name / Email" />
                        </div>
                        <div className="login__field">
                            <i className="login__icon"><FaLock/></i>
                            <input type="password" className="login__input" placeholder="Password" />
                        </div>
                        <button className="button login__submit" onClick={handleLogin}>
                            <span className="button__text">Log In</span>
                            <i className="button__icon"><FaChevronRight /></i>
                        </button>
                    </form>
                    <div className="social-login">
                        <h3>Log in via</h3>
                        <div className="social-icons">
                            <a href="#" className="social-login__icon"><FaGoogle/></a>
                            <a href="#" className="social-login__icon"><FaGithub/></a>
                            <a href="#" className="social-login__icon"><FaFacebookF/></a>
                        </div>
                    </div>  
                </div>
                <div className="screen__background">
                    <span className="screen__background__shape screen__background__shape4"></span>
                    <span className="screen__background__shape screen__background__shape3"></span>
                    <span className="screen__background__shape screen__background__shape2"></span>
                    <span className="screen__background__shape screen__background__shape1"></span>
                </div>
            </div>
        </div>
    </>
}

export default LoginForm;