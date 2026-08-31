import { useState, useEffect } from 'react';
import api from '../../services/api'
import { BiSolidCommentEdit } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import GenericModal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'

// Hooks
import { useUsuarios } from '../../hooks/usuarios/useUsuarios';
import { useCriarUsuario } from '../../hooks/usuarios/useCriarUsuario';
import { useEditarUsuario } from '../../hooks/usuarios/useEditarUsuario';

import { useDebounce } from 'use-debounce';

import '../../styles/shared.css'

function Usuarios() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isActive, setIsActive] = useState(false)
    const [profileImage, setProfileImage] = useState(false)
    const [edit, setEdit] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [page, setPage] = useState(1);

    // Search
    const [searchId, setSearchId] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchEmail, setSearchEmail] = useState('');

    // Debouced
    const [searchIdDebouced] = useDebounce(searchId, 600);
    const [searchNameDebouced] = useDebounce(searchName, 600);
    const [searchemailDebouced] = useDebounce(searchEmail, 600);

    // Listar usuários
    const {
        data,
        isLoading,
        error: errorBuscarUsuarios
    } = useUsuarios({
        searchId: searchIdDebouced,
        searchName: searchNameDebouced,
        searchEmail: searchemailDebouced
    })

    const usuarios = data?.data ?? [];
    const total = data?.total ?? [];

    // Criar usuário
    const {
        mutate: criarUsuario,
        error: errorCriarUsuario
    } = useCriarUsuario()

    // Editar usuário
    const {
        mutate: editarUsuario,
        error: errorEditarUsuario,
    } = useEditarUsuario();

    useEffect(() => {
        setPage(1);
    }, [searchId, searchName, searchEmail]);

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
            isAdmin: isAdmin ? 'S' : 'N',
            isActive: isActive ? 'S' : 'N'
        };

        if (edit.id) {

            editarUsuario({
                id: edit.id,
                usuario,
            }, {
                onSuccess: () => {
                    toast.success('Usuário editado com sucesso!')
                    resetForm()
                },

                onError: () => {
                    toast.error(
                        'Erro ao editar usuário!'
                    )
                }
            });
        } else {

            criarUsuario(usuario, {
                onSuccess: () => {
                    toast.success(
                        'Usuário cadastrado com sucesso!'
                    )
                    setModalShow(false)
                    resetForm();
                },

                onError: () => {
                    toast.error(
                        'Erro ao cadastrar usuário!'
                    )
                }

            });
        }
    }

    function resetForm() {
        setModalShow(false);
        setName('');
        setEmail('');
        setPassword('');
        setIsAdmin(false);
        setIsActive(false)
        setEdit({});
        setProfileImage('https://img.icons8.com/nolan/1200/user-default.jpg')
    }

    function handleEdit(id, name, email, isAdminValue, isActive, profileImage) {
        setEdit({ id, name, email, isAdmin: isAdminValue });
        setName(name);
        setEmail(email);
        setIsAdmin(isAdminValue === 'S'); // garante boolean
        setIsActive(isActive === 'S');
        if (profileImage) {
            setProfileImage(`http://3.235.18.237:8081/uploads/${profileImage}`)
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
                    {isLoading ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Carregando usuários...
                            </td>
                        </tr>
                    ) : errorBuscarUsuarios ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Erro ao carregar usuários: {error.message}
                            </td>
                        </tr>
                    ) : total > 0 ? (
                        usuarios.map((usuario) => (
                            <tr key={usuario.id} onDoubleClick={() => handleEdit(usuario.id, usuario.name, usuario.email, usuario.isAdmin, usuario.isActive, usuario.profileImage)}>
                                <td>{usuario.id}</td>
                                <td>{usuario.name}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.isAdmin === 'S' ? 'Sim' : 'Não'}</td>
                                <td className="icon">
                                    <span><BiSolidCommentEdit onClick={() => handleEdit(usuario.id, usuario.name, usuario.email, usuario.isAdmin, usuario.isActive, usuario.profileImage)} /></span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
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

                    <Input
                        type="checkbox"
                        label="Ativo"
                        checked={isActive}
                        onChange={() => setIsActive(!isActive)}
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