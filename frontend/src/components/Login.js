import { Link } from 'react-router-dom';
import React, { useState } from 'react';



function Login() {
    

    var loginName;
    var loginPassword;
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const doLogin = async event =>
    {
        event.preventDefault();
        var obj = {login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);
        setError('');
        
        try
        {
            const response = await fetch(buildPath('api/login'),{method:'POST',body:js,headers:{'Content-Type':'application/json'}});

            if( !response.ok )
            {
                //console.log('User/Password combination incorrect');
                setError('Login failed. Please try again.');
                return;
            }
            
            const data = await response.json();
            const token = data.token;
            console.log(token);
            const dataLen = data.length;
            console.log(dataLen);
            //var user = {firstName:res.firstName,lastName:res.lastName,id:res.id} 
            //const data = await response.json();
            //console.log(data);
            //const token = data.token;
           // console.log(res.token);
            localStorage.setItem('authToken', token);
            console.log("Token added to local storage");
        
            setMessage('');
            window.location.href = '/calendar';
        }
        catch(e)
        {
            console.log("Something went sour...");
            console.log(loginName.value);
            //console.log(res.id);
            alert(e.toString());
            return;
        }
    };

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
        
        <div className='Composition'>

            <div className="black_sideline">
            </div>

            <div className = "card">
                <h1 className = "card-title">LOGIN</h1>
                <hr/>
                    <label className='buttonHeader' for = "username" id = "user" >Username:</label>
                    <input type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c} />
                <hr/>
                    <label className='buttonHeader' for = "password">Password:</label>
                    <input type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} />
                <hr/>
                <input type="submit" id="loginButton" className="loginButton" value="LOGIN"
                onClick={doLogin} />
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className = "space"></div>
                <div>Forgot Password? Click below</div>
                <hr/>
                    <Link to ="/forgot"><button className="loginButton">FORGOT PASSWORD?</button></Link>

                    <div className = "space"></div>

                    <div>Not registered? Click below</div>
                <hr/>
                    <Link to ="/signup"><button className="loginButton">SIGN UP</button></Link>

                    <div className = "space"></div>
                <hr/>
                    <Link to ="/"><button className="loginButton">HOME</button></Link>
            </div>
        </div>
    );
}

export default Login
