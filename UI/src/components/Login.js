import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import api from '../utils/api';
export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        await api.post('/auth/login', { username, password }).then((response) => {
            if (response.status == 200) {
                localStorage.setItem('userId', response.data?.Id);
                navigate('/');
            }
            else setError(response.data || 'Hata oluştu');
        }).catch((error) => {
            setError(error.response?.data || 'Hata oluştu');
        });
    };
    const handleRegister = async () => {
        await api.post('/auth/register', { username, password }).then((response) => {
            console.log(response);
            if (response.status == 201) {
                localStorage.setItem('userId', response.data?.user?.Id);
                navigate('/');
            }
            else setError(response.data || 'Hata oluştu');
        }).catch((error) => {
            setError(error.response?.data || 'Hata oluştu');
        });
    }
    useEffect(() => {
        setError('');
    }, [isRegister]);
    return (
        <div className="login-container">
            <h2>
                {isRegister ? 'Kayıt Ol' : 'Giriş Yap'}
            </h2>
            <form>
                <div className="form-group">
                    <label>Kullanıcı Adı</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Şifre</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button hidden={isRegister} type="button" onClick={handleLogin}>Giriş Yap</button>
                <button hidden={!isRegister} type="button" onClick={handleRegister}>Kayıt Ol</button>
                <p type="button" style={{ color: "green", textDecoration: "underline", cursor: "pointer" }} onClick={() => {setIsRegister(!isRegister)}}>
                    {isRegister ? 'Zaten bir hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
                </p>
            </form>
        </div>
    );
};
