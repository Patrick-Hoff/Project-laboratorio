import { useState, useEffect } from 'react';
import axios from 'axios';
import { BiSolidCommentEdit } from "react-icons/bi";
import { IoIosAddCircle } from "react-icons/io";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import '../../styles/shared.css'

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
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
    }

    function handleEdit(id, name, email, isAdminValue) {
        setEdit({ id, name, email, isAdmin: isAdminValue });
        setName(name);
        setEmail(email);
        setIsAdmin(isAdminValue === 'S'); // garante boolean
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
                            <tr key={usuario.id}>
                                <td>{usuario.id}</td>
                                <td>{usuario.name}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.isAdmin === 'S' ? 'Sim' : 'Não'}</td>
                                <td className="icon">
                                    <span><BiSolidCommentEdit onClick={() => handleEdit(usuario.id, usuario.name, usuario.email, usuario.isAdmin)} /></span>
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
            <Modal
                show={modalShow}
                onHide={resetForm}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {edit.id ? 'Editar usuário' : 'Cadastrar novo usuário'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formGroupName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome"
                                required
                                maxLength={50}
                                onChange={(e) => setName(e.target.value)}
                                value={name}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Senha</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Senha"
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupIsAdmin">
                            <Form.Check
                                type="checkbox"
                                label="Administrador"
                                checked={isAdmin}
                                onChange={() => setIsAdmin(!isAdmin)}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button onClick={resetForm}>Fechar</Button>
                            <Button type="submit">
                                {edit.id ? 'Salvar alterações' : 'Cadastrar'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </div>
    );
}

export default Usuarios;