import { Link } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react';
import {faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import '../css/accessibility.css'
import '../css/index.css'

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PHONE_REGEX = /^[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-/\s.]?[0-9]{4}$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function SignUp() {

    const userRef = useRef();
    const errRef = useRef();

    var firstName;
    var lastName;

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [phone, setPhone] = useState('');
    const [validPhone, setValidPhone] = useState(false);
    const [phoneFocus, setPhoneFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);
    }, [user])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
    }, [pwd])

    useEffect(() => {
        const result = PHONE_REGEX.test(phone);
        console.log(result);
        console.log(phone);
        setValidPhone(result);
    }, [phone])

    useEffect(() => {
        const result = EMAIL_REGEX.test(email);
        console.log(result);
        console.log(email);
        setValidEmail(result);
    }, [email])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, phone, email])

    

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Please enter a valid Username or Password");
            return;
        }

        var obj = { login: user, password: pwd, firstname: firstName, lastname: lastName,  phone: phone, email: email};
        var js = JSON.stringify(obj);
        
        try {
            const response = await fetch(buildPath("api/signup"),
            { method: 'POST', body: js, headers: { 'Content-Type': 'application/json' } });
        
            var res = JSON.parse(await response.text());

            console.log(res);
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setPwd('');
            //setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }
    const app_name = 'taskmanager-poosd-b45429dde588'
    function buildPath(route)
    {
    if (process.env.NODE_ENV === 'production')
    {
    return 'https://' + app_name + '.herokuapp.com/' + route;
    }
    else
    {
    return 'http://localhost:5000/' + route;
    }
    }

    return (

        <>
            {success ? (
                <div className='Composition'>

                    <div className="black_sideline">
                    </div>


                    <div className = "card">
                        <h1 className = "card-title">Email Verification</h1>
                        <h2>Please check your email to verify your account</h2>
                        <hr/>
                        <Link to ="/login"><button className="homeButton">LOGIN</button></Link>
                        <hr/>
                    </div>
                </div>
            ) : (

                <div className='Composition'>

                    <div className="black_sideline">
                    </div>

                    <div className = "card">
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1 className = "card-title">SIGN UP</h1>

                        <form onSubmit={handleSubmit}>
                            <hr/>
                                <label className='buttonHeader' >First Name:</label>
                                <input type = "text" id = "firstName"></input>
                            <hr/>
                                <label className='buttonHeader' >Last Name:</label>
                                <input type = "text" id = "lastName"></input>
                            <hr/>


                            <label  className='buttonHeader' htmlFor="username">
                                Username:
                                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="text"
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                            />
                            <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                4 to 24 characters.<br />
                                Must begin with a letter.<br />
                                Letters, numbers, underscores, hyphens allowed.
                            </p>


                            <hr/>

                            <label  className='buttonHeader' htmlFor="password">
                                Password:
                                <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="password"
                                id="password"
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                required
                                aria-invalid={validPwd ? "false" : "true"}
                                aria-describedby="pwdnote"
                                onFocus={() => setPwdFocus(true)}
                                onBlur={() => setPwdFocus(false)}
                            />
                            <p id="pwdnote" className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                8 to 24 characters.<br />
                                Must include uppercase and lowercase letters, a number and a special character.<br />
                                Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                            </p>

                            <hr/>
                                
                            <label className='buttonHeader' htmlFor="phone">
                                Phone:
                                <FontAwesomeIcon icon={faCheck} className={validPhone ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPhone || !phone ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="text"
                                id="phone"
                                autoComplete="off"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                                required
                                aria-invalid={validPhone ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setPhoneFocus(true)}
                                onBlur={() => setPhoneFocus(false)}
                            />
                            <p id="uidnote" className={phoneFocus && phone && !validPhone ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must follow format below<br />
                                XXX-XXX-XXXX
                            </p>


                            <hr/>

                            <label className='buttonHeader' htmlFor="email">
                                Email:
                                <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                            </label>
                            <input
                                type="text"
                                id="email"
                                autoComplete="off"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                                aria-invalid={validEmail ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setEmailFocus(true)}
                                onBlur={() => setEmailFocus(false)}
                            />
                            <p id="uidnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Must follow format below<br />
                                XXX@YYY.ZZZ
                            </p>

                            <hr/>

                            <button className="loginButton" disabled={!validName || !validPwd || !validPhone || !validEmail ? true : false}>SUBMIT</button>

                        </form>

                            <div className = "space"></div>

                            <div>Registered? Click below</div>
                        <hr/>
                            <Link to ="/login"><button className="loginButton">LOGIN</button></Link>


                            <div className = "space"></div>
                        <hr/>
                            <Link to ="/"><button className="loginButton">HOME</button></Link>

                    </div>
                </div>
            )}
        </>
    );
}

export default SignUp
