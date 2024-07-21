import React, { useState } from 'react';

function Forgot() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetRequest = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch(buildPath('api/reset-password-request'), {
                method: 'POST',
                body: JSON.stringify({ email }),
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();
            if (response.ok) {
                setMessage('Password reset email sent. Please check your inbox.');
            } else {
                setMessage(res.error || 'Failed to send reset email.');
            }
        } catch (error) {
            console.error('Error sending reset email:', error);
            setMessage('Something went wrong. Please try again later.');
        }
    };

    const app_name = 'taskmanager-poosd-b45429dde588';
    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return 'https://' + app_name + '.herokuapp.com/' + route;
        } else {
            return 'http://localhost:5000/' + route;
        }
    }

    return (
        <div className='Composition'>
            <div className='black_sideline'></div>
            <div className='card'>
                <h1 className='card-title'>Password Reset</h1>
                <hr />
                <form onSubmit={handleResetRequest}>
                    <label htmlFor='email' className='buttonHeader'>
                        Enter your email address:
                    </label>
                    <input
                        type='password'
                        id='email'
                        // placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <hr />
                    <input type='submit' className='loginButton' value='Send Reset Email' />
                    {message && <p className='message'>{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default Forgot;