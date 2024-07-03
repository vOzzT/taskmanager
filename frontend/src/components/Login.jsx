import { Link } from 'react-router-dom';
import React, { useState } from 'react';

function Login() {


    var loginName;
    var loginPassword;
    const [message,setMessage] = useState('');
    
    const doLogin = async event =>
    {
        event.preventDefault();
        var obj = {login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);
        
        try
        {
            const response = await fetch('http://localhost:5173/api/login',{method:'POST',body:js,headers:{'Content-Type':'application/json'}});
        
            var res = JSON.parse(await response.text());
            console.log(res.id);
            if( res.id <= 0 )
            {
                console.log('User/Password combination incorrect');
            }
            else
            {
            var user = {firstName:res.firstName,lastName:res.lastName,id:res.id} 
            localStorage.setItem('user_data', JSON.stringify(user));
        
            setMessage('');
            window.location.href = '/calendar';
            }
        }
        catch(e)
        {
            console.log("Something went sour...");
            console.log(loginName.value);
            console.log(res.id);
            alert(e.toString());
            return;
        }
    };


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
                    <button className="loginButton" onClick={doLogin}>SUBMIT</button>

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