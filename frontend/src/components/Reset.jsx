import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function ResetPassword() {
    const { resetToken } = useParams();
    console.log(resetToken);
    console.log(`api/reset-password/${resetToken}`);
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const path = `api/reset-password/${resetToken}`;
    console.log(path);
    
    const handleResetPassword = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch(buildPath(path), {
                method: 'POST',
                body: JSON.stringify({ newPassword: password }),
                headers: { 'Content-Type': 'application/json' }
            });

            const res = await response.json();
            if (response.ok) {
                setMessage('Password reset successful. You can now log in with your new password.');
            } else {
                setMessage(res.error || 'Failed to reset password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error);
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
                <h1 className='card-title'>Reset Password</h1>
                <hr />
                <form onSubmit={handleResetPassword}>
                    <label htmlFor='password' className='buttonHeader'>
                        New Password:
                    </label>
                    <input
                        type='password'
                        id='password'
                        // placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                <hr />
                    <label htmlFor='confirmPassword' className='buttonHeader'>
                        Confirm New Password:
                    </label>
                    <input
                        type='password'
                        id='confirmPassword'
                        // placeholder='Confirm New Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <hr />
                    <input type='submit' className='loginButton' value='Reset Password' />
                    {message && <p className='message'>{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
