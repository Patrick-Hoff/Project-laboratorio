import { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSolidCommentEdit } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import GenericModal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'

import '../../styles/shared.css'

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [profileImage, setProfileImage] = useState('')
    const [edit, setEdit] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');


    const getUsuarios = async () => {
        try {
            const res = await axios.get('http://localhost:8081/usuarios/searchUsers', {
                params: {
                    page,
                    limit: 5,
                    searchId,
                    searchName,
                    searchEmail
                },
            });
            setUsuarios(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setPage(1);
    }, [searchId, searchName, searchEmail]);

    useEffect(() => {
        getUsuarios();
    }, [page, searchId, searchName, searchEmail]);

    function nextPage() {
        setPage(prev => prev + 1);
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1);
    }

    function handleSubmit(e) {
        e.preventDefault();

        const usuario = {
            name,
            email,
            password: password || undefined, // não sobrescreve senha se vazio na edição
            isAdmin: isAdmin ? 'S' : 'N'
        };

        if (edit.id) {
            axios.put(`http://localhost:8081/usuarios/edit/${edit.id}`, usuario,
                { withCredentials: true }
            )
                .then(() => {
                    toast.success('Usuário editado com sucesso!');
                    resetForm();
                    getUsuarios();
                })
                .catch(error => {
                    toast.error('Erro ao editar usuário!');
                    console.error(error);
                });
        } else {
            axios.post('http://localhost:8081/usuarios/register', usuario,
                { withCredentials: true }
            )
                .then(() => {
                    toast.success('Usuário cadastrado com sucesso!');
                    getUsuarios();
                    setModalShow(false);
                    resetForm();
                })
                .catch(error => {
                    toast.error('Erro ao cadastrar usuário!');
                    console.error(error);
                });
        }
    }


    function resetForm() {
        setModalShow(false);
        setName('');
        setEmail('');
        setPassword('');
        setIsAdmin(false);
        setEdit({});
        setProfileImage('https://img.icons8.com/nolan/1200/user-default.jpg')
    }

    function handleEdit(id, name, email, isAdminValue, profileImage) {
        setEdit({ id, name, email, isAdmin: isAdminValue });
        setName(name);
        setEmail(email);
        setIsAdmin(isAdminValue === 'S'); // garante boolean
        if (profileImage) {
            setProfileImage(`http://localhost:8081/uploads/${profileImage}`)
        } else {
            setProfileImage("https://img.icons8.com/nolan/1200/user-default.jpg")
        }
        setModalShow(true);
    }

    return (
        <div className="container">
            <div className="containerH1">
                <h1>Usuários</h1>
                <button onClick={() => setModalShow(true)}><IoIosAddCircle /></button>
            </div>

            <table className="tabela-container">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th></th>
                    </tr>
                    <tr>
                        <th>
                            <input
                                type="text"
                                className='input-tabela input-id'
                                placeholder='ID'
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                        </th>
                        <th>
                            <input
                                type="text"
                                className='input-tabela input-name'
                                placeholder='Nome'
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                        </th>
                        <th>
                            <input
                                type="text"
                                className='input-tabela input-email'
                                placeholder='Email'
                                onChange={(e) => setSearchEmail(e.target.value)}
                            />
                        </th>
                        <th>
                            <span>Sim/Não</span>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.length > 0 ? (
                        usuarios.map((usuario) => (
                            <tr key={usuario.id} onDoubleClick={() => handleEdit(usuario.id, usuario.name, usuario.email, usuario.isAdmin, usuario.profileImage)}>
                                <td>{usuario.id}</td>
                                <td>{usuario.name}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.isAdmin === 'S' ? 'Sim' : 'Não'}</td>
                                <td className="icon">
                                    <span><BiSolidCommentEdit onClick={() => handleEdit(usuario.id, usuario.name, usuario.email, usuario.isAdmin, usuario.profileImage)} /></span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                Nenhum usuário cadastrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="pagination">
                <FaArrowLeft
                    className={`arrow ${page <= 1 ? 'disabled' : ''}`}
                    onClick={page <= 1 ? null : prevPage}
                />
                <span>Página {page} de {Math.ceil(total / 5)}</span>
                <FaArrowRight
                    className={`arrow ${page >= Math.ceil(total / 5) ? 'disabled' : ''}`}
                    onClick={page >= Math.ceil(total / 5) ? null : nextPage}
                />
            </div>

            {/* Modal */}

            <GenericModal
                title={edit.id ? 'Editar usuário' : 'Cadastrar novo usuário'}
                show={modalShow}
                onClose={resetForm}
            >

                <img
                    src={profileImage || 'https://img.icons8.com/nolan/1200/user-default.jpg'}
                    alt="Imagem de perfil"
                    className="profile-image"
                />
                <form onSubmit={handleSubmit} className="container-modal-btn">

                    <Input
                        type="text"
                        label="Nome"
                        placeholder="Nome"
                        required
                        maxLength={50}
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />

                    <Input
                        type="email"
                        label="Email"
                        placeholder="Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />

                    <Input
                        type="password"
                        label="Senha"
                        placeholder="Senha"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />

                    <Input
                        type="checkbox"
                        label="Administrador"
                        checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)}
                        style={{
                            width: "20px",
                            height: "20px"
                        }}
                    />

                    <div>
                        <button onClick={resetForm}>
                            Fechar
                        </button>
                        <button type='submit'>
                            {edit.id ? 'Salvar alterações' : 'Cadastrar'}
                        </button>
                    </div>

                </form>

            </GenericModal>

            <ToastContainer />
        </div>
    );
}

export default Usuarios;