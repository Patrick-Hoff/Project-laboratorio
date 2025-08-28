import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'
import './myUser.css';

function myUser() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [id, setId] = useState()
    const [changePassword, setChangePassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState()
    const [avatar, setAvatar] = useState('')

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('imagem', file); // Nome do campo esperado no backend

        axios.post('http://localhost:8081/usuarios/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        })
            .then((res) => {
                const newAvatarUrl = res.data.avatarUrl;

                if (newAvatarUrl) {
                    setAvatar(newAvatarUrl); // Atualiza imediatamente a imagem
                } else {
                    alert('Upload feito, mas sem URL da imagem.');
                }
            })
            .catch((err) => {
                toast.info('Erro ao enviar imagem');
                console.error(err);
            });
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        const values = {
            name: name,
            email: email,
            password: password || undefined,
            isAdmin: isAdmin,
        };

        axios.put(`http://localhost:8081/usuarios/edit/${id}`, values, {
            withCredentials: true,
        })
            .then(() => {
                setChangePassword(false)
                setPassword('')
                toast.success('Alteração salva com sucesso!')

            })
            .catch((err) => {
                toast.alert('erro');
                console.log(err)

            });
    };



    useEffect(() => {
        axios.get('http://localhost:8081/usuarios/me', { withCredentials: true })
            .then((res) => {
                setName(res.data.name)
                setEmail(res.data.email)
                setId(res.data.id)
                setIsAdmin(res.data.isAdmin)
                setAvatar(res.data.avatar)
            })
    }, [])

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Meu Perfil</h2>
                <div className="image-section">
                    <label htmlFor="imageUpload" className="image-label">
                        <img
                            src={avatar || 'https://via.placeholder.com/150'}
                            alt="Imagem de perfil"
                            className="profile-image"
                        />
                    </label>
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Nome:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-password'>
                        <label htmlFor="password">Alterar senha ?</label>
                        <input
                            type='checkbox'
                            name='password'
                            checked={changePassword}
                            onChange={(e) => setChangePassword(e.target.checked)}
                        />
                    </div>

                    {changePassword && (
                        <div className="form-group">
                            <label>Nova Senha:</label>
                            <input
                                type="password"
                                placeholder="Digite sua nova senha"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-btn">Salvar Alterações</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default myUser;
