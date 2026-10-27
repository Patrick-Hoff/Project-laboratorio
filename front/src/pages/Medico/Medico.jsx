import { useState, useEffect } from 'react'
import api from '../../services/api'
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

import { useDebounce } from 'use-debounce';

// Hooks
import { useMedicos } from '../../hooks/medicos/useMedicos'
import { useCriarMedico } from '../../hooks/medicos/useCriarMedico'
import { useEditarMedico } from '../../hooks/medicos/useEditarMedico'
import { useDeletarMedico } from '../../hooks/medicos/useDeletarMedico'

function Medico() {


    const [nome, setNome] = useState('')
    const [crm, setCrm] = useState('')
    const [estado, setEstado] = useState('')

    const [edit, setEdit] = useState({})
    const [modalShow, setModalShow] = useState(false)
    const [modalExcluir, setModalExcluir] = useState(null)

    const [page, setPage] = useState(1)

    // Search
    const [searchNome, setSearchNome] = useState('')
    const [searchCrm, setSearchCrm] = useState('')

    // Debouced
    const [searchNomeDebouced] = useDebounce(searchNome, 600)
    const [searchCrmDebouced] = useDebounce(searchCrm, 600)


    const limit = 5

    // Listar medicos
    const {
        data,
        isLoading,
        error: errorBuscarMedicos
    } = useMedicos({
        page,
        nome: searchNomeDebouced,
        crm: searchCrmDebouced
    });

    const medicos = data?.data ?? [];
    const total = data?.total ?? [];

    // Criar medico
    const {
        mutate: criarMedico,
        error: errorCriarMedico
    } = useCriarMedico();

    // Editar medico
    const {
        mutate: editarMedico,
        error: errorEditarMedico,
    } = useEditarMedico();

    // Deletar Medico
    const {
        mutate: deletarMedico,
        error: errorDeletarMedico,
    } = useDeletarMedico();

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
        deletarMedico(id, {
            onSuccess: () => {
                toast.success('Médico removido com sucesso!')
                setModalExcluir(null)
            },
            onError: (err) => {
                toast.error(err.response?.data?.message ?? 'Erro ao deletar médico!')
                setModalExcluir(null)
            }
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const medico = {
            nome: nome,
            crm: crm,
            estado: estado
        }

        if (edit.id) {
            editarMedico({
                id: edit.id,
                medico,
            }, {
                onSuccess: () => {
                    toast.success('Médico editado com sucesso!')
                    resetForm()
                },

                onError: () => {
                    toast.error(
                        'Erro ao editar médico!'
                    )
                }
            });
        } else {
            criarMedico(medico, {
                onSuccess: () => {
                    toast.success(
                        'Médico cadastrado com sucesso!'
                    )
                    setModalShow(false)
                    resetForm();
                },

                onError: () => {
                    toast.error(
                        'Erro ao cadastrar médico!'
                    )
                }
            });
        }
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

                    {isLoading ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Carregando medicos...
                            </td>
                        </tr>
                    ) : errorBuscarMedicos ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Erro ao carregar medicos: {error.message}
                            </td>
                        </tr>
                    ) : total > 0 ? (
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
                                        <FaDeleteLeft onClick={() => setModalExcluir(medico.id)} />
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Nenhum medico cadastrado.
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
                show={modalExcluir !== null}
                onClose={() => setModalExcluir(null)}
                title="Deseja realmente excluir este médico?"
            >
                <div className='container-button-modal'>
                    <button
                        className='btn-modal btn-cancelar'
                        onClick={() => setModalExcluir(null)}
                    >
                        Cancelar
                    </button>

                    <button
                        className='btn-modal btn-excluir'
                        onClick={() => handleDelete(modalExcluir)}
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