import { useState, useEffect } from 'react'
import api from '../../services/api'
import { BiSolidCommentEdit } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import GenericModal from "../../components/Modal/Modal"
import Input from "../../components/Input/Input"

import { formatarDataBR } from '../../utils/formatters';

import { usePacientes } from '../../hooks/pacientes/usePacientes';
import { useCriarPaciente } from '../../hooks/pacientes/useCriarPaciente';
import { useEditarPaciente } from '../../hooks/pacientes/useEditarPaciente';
import { useDeletarPaciente } from '../../hooks/pacientes/useDeletarPaciente';

import { useDebounce } from 'use-debounce';

import '../../styles/shared.css'

function Pacientes() {

    const [idade, setIdade] = useState('')
    const [nome, setNome] = useState('')
    const [edit, setEdit] = useState([])
    const [modalShow, setModalShow] = useState(false)
    const [page, setPage] = useState(1)

    // Search
    const [searchId, setSearchId] = useState('')
    const [searchNome, setSearchNome] = useState('')

    // Debounced
    const [searchIdDebounced] = useDebounce(searchId, 600);
    const [searchNomeDebounced] = useDebounce(searchNome, 600);

    // Listar pacientes
    const {
        data,
        isLoading,
        error: errorBuscarPacientes
    } = usePacientes({
        page,
        searchId: searchIdDebounced,
        searchNome: searchNomeDebounced
    });

    const pacientes = data?.data ?? [];
    const total = data?.total ?? [];

    // Criar novo paciente
    const {
        mutate: criarPaciente,
        error: errorCriarPaciente
    } = useCriarPaciente();

    // Editar pacientes
    const {
        mutate: editarPaciente,
        error: errorEditarPaciente,
    } = useEditarPaciente();

    // Deletar Paciente
    const {
        mutate: deletarPaciente,
        error: errorDeletarPaciente,
    } = useDeletarPaciente();

    useEffect(() => {
        setPage(1)
    }, [searchId, searchNome])


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

            editarPaciente({
                id: edit.id,
                paciente,
            }, {
                onSuccess: () => {
                    toast.success('Paciente editado com sucesso!')
                    resetForm()
                },

                onError: () => {
                    toast.error(
                        'Erro ao editar paciente!'
                    )
                }
            });


        } else {

            criarPaciente(paciente, {
                onSuccess: () => {
                    toast.success(
                        'Paciente cadastrado com sucesso!'
                    )
                    setModalShow(false)
                    resetForm();
                },

                onError: () => {
                    toast.error(
                        'Erro ao cadastrar paciente!'
                    )
                }
            });
        }
    }

    function handleDelete(id) {

        deletarPaciente(id, {
            onSuccess: () => {
                toast.success('Paciente deletado com sucesso!')
            },
            onError: () => {
                toast.success('Erro ao deletar paciente!')
            }
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

            <table className="tabela-container">
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
                    {isLoading ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Carregando pacientes...
                            </td>
                        </tr>
                    ) : errorBuscarPacientes ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>
                                Erro ao carregar pacientes: {error.message}
                            </td>
                        </tr>
                    ) : total > 0 ? (
                        pacientes.map((paciente) => (
                            <tr
                                key={paciente.id}
                                onDoubleClick={() =>
                                    handleEdit(
                                        paciente.id,
                                        paciente.nome,
                                        paciente.idade
                                    )
                                }
                            >
                                <td>{paciente.id}</td>
                                <td>{paciente.nome}</td>
                                <td>{formatarDataBR(paciente.idade)}</td>
                                <td className="icon">
                                    <span>
                                        <BiSolidCommentEdit
                                            onClick={() =>
                                                handleEdit(
                                                    paciente.id,
                                                    paciente.nome,
                                                    paciente.idade
                                                )
                                            }
                                        />
                                    </span>

                                    <span>
                                        <FaDeleteLeft
                                            onClick={() => handleDelete(paciente.id)}
                                        />
                                    </span>
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


            <GenericModal
                title={edit.id ? 'Editar paciente' : 'Cadastrar novo paciente'}
                show={modalShow}
                onClose={resetForm}
            >
                <form onSubmit={handleSubmit} className='container-modal-btn'>
                    <Input
                        type="text"
                        label="Nome"
                        name="nome"
                        placeholder="Nome"
                        required
                        maxLength={50}
                        onChange={(e) => setNome(e.target.value)}
                        value={nome}
                    />

                    <Input
                        type="date"
                        label="Data de nascimento"
                        name="nascimento"
                        placeholder="Data de nascimento"
                        required
                        onChange={(e) => setIdade(e.target.value)}
                        value={idade}
                    />
                    <div>
                        <button onClick={resetForm}>
                            Fechar
                        </button>
                        <button type="submit">
                            {edit.id ? 'Salvar alterações' : 'Cadastrar'}
                        </button>
                    </div>
                </form>
            </GenericModal>

            <ToastContainer />

        </div >
    )
}

export default Pacientes