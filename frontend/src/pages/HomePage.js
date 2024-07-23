import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/index.css';

function HomePage() {
    const navigate = useNavigate();

    const goToLogin= () => {
        navigate('/login');
    };

    const goToSignUp= () => {
        navigate('/signup');
    };

    return (
        <div className='Composition'>

            <div className="black_sideline">
            </div>


            <div className = "card">
                <h1 className = "card-title">Task Manager</h1>
                <hr/>
                <button onClick={goToLogin}  className="homeButton">LOGIN</button>
                <hr/>
                <button onClick={goToSignUp} className="homeButton">SIGN UP</button>
                <hr/>
                <a href="https://github.com/vOzzT/taskmanager"><button className="homeButton">GITHUB</button></a>
                <hr/>
            </div>
        </div>
    );
}

export default HomePage;
