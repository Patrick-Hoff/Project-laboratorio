import { useState, useEffect } from 'react'
import axios from 'axios'
import { BiSolidCommentEdit } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import './styles.css'

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function Pacientes() {

    const [pacientes, setPacientes] = useState([])

    const [idade, setIdade] = useState('')
    const [nome, setNome] = useState('')
    const [edit, setEdit] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0);

    const [searchId, setSearchId] = useState('')
    const [searchNome, setSearchNome] = useState('')


    const getPacientes = async () => {
        try {
            const res = await axios.get('http://localhost:8081/pacientes', {
                params: {
                    page,
                    limit: 5,
                    searchId,
                    searchNome,
                }
            })
            setPacientes(res.data.data)
            setTotal(res.data.total)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setPage(1)
    }, [searchId, searchNome])

    useEffect(() => {
        getPacientes()
    }, [page, searchId, searchNome])


    function nextPage() {
        setPage(prev => prev + 1)
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1)
    }

    function handleSubmit(e) {
        e.preventDefault()

        const paciente = {
            nome: nome,
            idade: idade,
        }

        if (edit.id) {

            axios.put(`http://localhost:8081/pacientes/${edit.id}/edit`, paciente)
                .then(() => {
                    toast.success('Paciente editado com sucesso!')
                    resetForm()
                    getPacientes()
                })

        } else {

            axios.post('http://localhost:8081/pacientes', paciente)
                .then(() => {
                    toast.success('Paciente cadastrado com sucesso!')
                    getPacientes()
                    setModalShow(false)
                    resetForm()
                })

        }

    }

    function handleDelete(id) {

        axios.delete(`http://localhost:8081/pacientes/${id}/remove`)
            .then(() => {
                toast.success('Paciente deletado com sucesso!')
                getPacientes()
            })

    }

    function resetForm() {
        setModalShow(false)
        setNome('')
        setIdade('')
        setEdit({})
    }

    function handleEdit(id, nome, idade) {
        setEdit({ id, nome, idade })
        setNome(nome)
        setIdade(idade)
        setModalShow(true)
    }

    return (
        <div className="container">
            <div className="containerH1">
                <h1>Pacientes</h1>
                <button onClick={() => setModalShow(true)}><IoIosAddCircle /></button>
            </div>

            <table className="tabela-pacientes">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Idade</th>
                        <th>Edit</th>
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
                                className='input-tabela input-nome'
                                placeholder='Paciente'
                                onChange={(e) => setSearchNome(e.target.value)}
                            />
                        </th>
                        <th>
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {pacientes.length > 0 ? (
                        pacientes.map((paciente) => (
                            <tr key={paciente.id}>
                                <td>{paciente.id}</td>
                                <td>{paciente.nome}</td>
                                <td>
                                    {paciente.idade && !isNaN(new Date(paciente.idade))
                                        ? format(new Date(paciente.idade), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                        : 'Data inválida'}
                                </td>
                                <td className="icon">
                                    <span><BiSolidCommentEdit onClick={() => handleEdit(paciente.id, paciente.nome, paciente.idade)} /></span>
                                    <span><FaDeleteLeft onClick={() => handleDelete(paciente.id)} /></span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Nenhum paciente cadastrado.
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
                        {edit.id ? 'Editar paciente' : 'Cadastrar novo paciente'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formGroupName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                placeholder="Nome"
                                required
                                maxLength={50}
                                onChange={(e) => setNome(e.target.value)}
                                value={nome}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Data de nascimento</Form.Label>
                            <Form.Control
                                type="date"
                                name="nascimento"
                                placeholder="Data de nascimento"
                                required
                                onChange={(e) => setIdade(e.target.value)}
                                value={idade}
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


        </div >
    )
}

export default Pacientes