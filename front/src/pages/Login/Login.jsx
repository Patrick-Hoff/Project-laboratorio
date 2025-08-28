import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import './Login.css';

function Form() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('http://localhost:8081/usuarios/login', {
                email,
                password
            }, {
                withCredentials: true
            });

            navigate('/')

            window.dispatchEvent(new Event('tokenChanged'))

        } catch (err) {
            toast.info('E-mail ou senha inválidos !')
            console.log('Usuario ou senha incorretos!', err)
        }
    }


    return (
        <div className="form-wrapper">
            <img src="src/assets/login_lab.png" alt="" className='img_lab' />
            <div className="form-container">
                <p className="title">Login</p>
                <form className="form" onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">E-mail</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder=""
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder=""
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                        <div className="forgot">
                            <a href="#" rel="noopener noreferrer">Esqueceu a senha ?</a>
                        </div>
                    </div>
                    <button className="sign">Entrar</button>
                </form>

            </div>
            <ToastContainer />
        </div>
    );
};

export default Form;
