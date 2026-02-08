import { useState, useEffect } from 'react'
import axios from 'axios'
import { BiSolidCommentEdit } from "react-icons/bi"
import { FaDeleteLeft } from "react-icons/fa6"
import { IoIosAddCircle } from "react-icons/io"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"

import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import '../../styles/shared.css'

function Medico() {

    // ================= STATES =================
    const [medicos, setMedicos] = useState([])

    const [nome, setNome] = useState('')
    const [crm, setCrm] = useState('')
    const [estado, setEstado] = useState('')

    const [edit, setEdit] = useState({})
    const [modalShow, setModalShow] = useState(false)

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const [searchNome, setSearchNome] = useState('')
    const [searchCrm, setSearchCrm] = useState('')

    const limit = 5

    // ================= FUNÇÕES =================

    const resetForm = () => {
        setModalShow(false)
        setNome('')
        setCrm('')
        setEstado('')
        setEdit({})
    }

    const handleEdit = (medico) => {
        setEdit(medico)
        setNome(medico.nome)
        setCrm(medico.crm)
        setEstado(medico.estado)
        setModalShow(true)
    }

    const handleDelete = (id) => {
        if (!window.confirm('Deseja realmente excluir este médico?')) return

        // Aqui depois entra o axios.delete
        toast.success('Médico removido com sucesso!')
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (edit.id) {
            // axios.put(...)
            toast.success('Médico atualizado com sucesso!')
        } else {
            // axios.post(...)
            toast.success('Médico cadastrado com sucesso!')
        }

        resetForm()
    }

    const nextPage = () => {
        if (page < Math.ceil(total / limit)) {
            setPage(page + 1)
        }
    }

    const prevPage = () => {
        if (page > 1) {
            setPage(page - 1)
        }
    }

    // ================= MOCK (TEMPORÁRIO) =================
    useEffect(() => {
        const dadosMock = [
            { id: 1, nome: 'Flávio Santos', crm: '12345', estado: 'SP' },
            { id: 2, nome: 'Ana Paula', crm: '67890', estado: 'RJ' }
        ]

        setMedicos(dadosMock)
        setTotal(dadosMock.length)
    }, [page, searchNome, searchCrm])

    // ================= RENDER =================
    return (
        <div className="container">
            <div className="containerH1">
                <h1>Médicos</h1>
                <button onClick={() => setModalShow(true)}>
                    <IoIosAddCircle />
                </button>
            </div>

            <table className="tabela-container">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>CRM</th>
                        <th>Estado</th>
                        <th>Ações</th>
                    </tr>
                    <tr>
                        <th></th>
                        <th>
                            <input
                                type="text"
                                className="input-tabela"
                                placeholder="Nome"
                                value={searchNome}
                                onChange={(e) => setSearchNome(e.target.value)}
                            />
                        </th>
                        <th>
                            <input
                                type="text"
                                className="input-tabela"
                                placeholder="CRM"
                                value={searchCrm}
                                onChange={(e) => setSearchCrm(e.target.value)}
                            />
                        </th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {medicos.length > 0 ? (
                        medicos.map((medico) => (
                            <tr key={medico.id}>
                                <td>{medico.id}</td>
                                <td>{medico.nome}</td>
                                <td>{medico.crm}</td>
                                <td>{medico.estado}</td>
                                <td className="icon">
                                    <span>
                                        <BiSolidCommentEdit onClick={() => handleEdit(medico)} />
                                    </span>
                                    <span>
                                        <FaDeleteLeft onClick={() => handleDelete(medico.id)} />
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                Nenhum médico cadastrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* PAGINAÇÃO */}
            <div className="pagination">
                <FaArrowLeft
                    className={`arrow ${page <= 1 ? 'disabled' : ''}`}
                    onClick={prevPage}
                />
                <span>
                    Página {page} de {Math.max(1, Math.ceil(total / limit))}
                </span>
                <FaArrowRight
                    className={`arrow ${page >= Math.ceil(total / limit) ? 'disabled' : ''}`}
                    onClick={nextPage}
                />
            </div>

            {/* MODAL */}
            <Modal
                show={modalShow}
                onHide={resetForm}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {edit.id ? 'Editar médico' : 'Cadastrar médico'}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>CRM</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={crm}
                                onChange={(e) => setCrm(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                value={estado}
                                onChange={(e) => setEstado(e.target.value)}
                            />
                        </Form.Group>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={resetForm}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                {edit.id ? 'Salvar' : 'Cadastrar'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer />
        </div>
    )
}

export default Medico
