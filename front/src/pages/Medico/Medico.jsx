import { useState, useEffect } from 'react'
import axios from 'axios'
import { BiSolidCommentEdit } from "react-icons/bi"
import { FaDeleteLeft } from "react-icons/fa6"
import { IoIosAddCircle } from "react-icons/io"
import { FaArrowRight, FaArrowLeft } from "react-icons/fa"

import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import '../../styles/shared.css'

import GenericModal from '../../components/Modal/Modal'
import Input from '../../components/Input/Input'

function Medico() {

    const [medicos, setMedicos] = useState([])

    const [nome, setNome] = useState('')
    const [crm, setCrm] = useState('')
    const [estado, setEstado] = useState('')

    const [edit, setEdit] = useState({})
    const [modalShow, setModalShow] = useState(false)
    const [modalExcluir, setModalExcluir] = useState(false)


    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const [searchNome, setSearchNome] = useState('')
    const [searchCrm, setSearchCrm] = useState('')

    const limit = 5


    const getMedicos = async () => {
        try {

            const params = new URLSearchParams({
                nome: searchNome,
                crm: searchCrm,
                page,
                limit
            })

            const res = await axios.get(`http://localhost:8081/medicos?${params}`)
            setMedicos(res.data.data)
            setTotal(res.data.total)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getMedicos()
    }, [page, searchNome, searchCrm])


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

    const handleDelete = async (id) => {

        try {
            await axios.delete(`http://localhost:8081/medicos/${modalExcluir.id}`)
            toast.success('Médico removido com sucesso!')
            setModalExcluir(false)
            getMedicos()
        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = {
            nome: nome,
            crm: crm,
            estado: estado
        }

        if (edit.id) {
            try {
                await axios.put(`http://localhost:8081/medicos/${edit.id}`, data)
                toast.success('Médico atualizado com sucesso!')
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                axios.post(`http://localhost:8081/medicos`, data)
                toast.success('Médico criado com sucesso')
            } catch (err) {
                console.log(err)
            }
        }
        resetForm()
        getMedicos()
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
                                maxLength="20"
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
                                        <FaDeleteLeft onClick={() => setModalExcluir({ id: medico.id })} />
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

            {/* Modal delete */}
            <GenericModal
                show={modalExcluir}
                onClose={() => setModalExcluir(false)}
                title="Deseja realmente excluir este médico?"
            >
                <div className='container-button-modal'>
                    <button
                        className='btn-modal btn-cancelar'
                        onClick={() => setModalExcluir(false)}
                    >
                        Cancelar
                    </button>

                    <button
                        className='btn-modal btn-excluir'
                        onClick={handleDelete}
                    >
                        Excluir
                    </button>

                </div>
            </GenericModal>


            {/* Modal edit */}
            <GenericModal
                show={modalShow}
                onClose={resetForm}
                title={edit.id ? 'Editar médico' : 'Cadastrar médico'}
            >
                <form onSubmit={handleSubmit} className='container-modal-btn'>
                    <Input
                        type="text"
                        label="Nome"
                        required
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                    <Input
                        label="CRM"
                        type="text"
                        required
                        value={crm}
                        onChange={(e) => setCrm(e.target.value)}
                    />
                    <Input
                        type="text"
                        label="Estado"
                        required
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                    />
                    <div>
                        <button onClick={resetForm}>
                            Cancelar
                        </button>
                        <button type='submit'>
                            {edit.id ? 'Salvar' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </GenericModal>

            <ToastContainer />
        </div>
    )
}

export default Medico