import { useEffect, useState } from "react";
import api from '../../services/api'

import { BiSolidCommentEdit } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import { ToastContainer, toast } from 'react-toastify';

import '../../styles/shared.css'

import GenericModal from "../../components/Modal/Modal";
import Input from "../../components/Input/Input";

// Import Hooks
import { useExames } from "../../hooks/exames/useExames";
import { useCriarExame } from "../../hooks/exames/useCriarExame";
import { useEditarExame } from "../../hooks/exames/useEditarExame"
import { useDeletarExame } from "../../hooks/exames/useDeletarExame";

import { useDebounce } from "use-debounce";

function Exames() {
    // const [exames, setExames] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [cod, setCod] = useState('')
    const [nome, setNome] = useState('')
    const [dupExame, setDupExame] = useState(false)
    const [edit, setEdit] = useState([])

    const [page, setPage] = useState(1)

    // Search
    const [searchId, setSearchId] = useState('')
    const [searchCod, setSearchCod] = useState('')
    const [searchNome, setSearchNome] = useState('')

    // Debounced
    const [searchIdDebouced] = useDebounce(searchId, 600)
    const [searchCodDebouced] = useDebounce(searchCod, 600)
    const [searchNomeDebouced] = useDebounce(searchNome, 600)

    // Listar exames
    const {
        data,
        isLoading,
        error: errorBuscarExames
    } = useExames({
        page,
        searchId: searchIdDebouced,
        searchCod: searchCodDebouced,
        searchNome: searchNomeDebouced
    });

    const total = data?.total ?? [];
    const exames = data?.data ?? [];

    // Criar novo exame
    const {
        mutate: criarExame,
        error: errorCriarExame
    } = useCriarExame();

    // Editar exame
    const {
        mutate: editarExame,
        error: errorEditarExame
    } = useEditarExame()

    // Deletar exame
    const {
        mutate: deletarExame,
        error: errorDeletarExame,
    } = useDeletarExame();

    useEffect(() => {
        setPage(1);
    }, [searchId, searchCod, searchNome]);

    function resetForm() {
        setModalShow(false)
        setCod('')
        setNome('')
        setEdit({})
        setCod('')
        setNome('')
        setDupExame(true)
    }


    function nextPage() {
        setPage(prev => prev + 1)
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1)
    }

    function handleSubmit(e) {
        e.preventDefault()

        const exame = {
            cod,
            nome,
            dupExame: dupExame ? 'S' : 'N'
        }

        if (edit?.id) {

            editarExame({
                id: edit.id,
                exame,
            }, {
                onSuccess: () => {
                    toast.success('Exame editado com sucesso!')
                    resetForm()
                },

                onError: (err) => {
                    if (err.response?.status === 500) {
                        toast.error('O código do exame deve ser único.')
                    } else {
                        toast.error('Erro ao editar exame')
                    }
                }
            })

        } else {

            criarExame(exame, {
                onSuccess: () => {
                    toast.success('Exame criado com sucesso!')
                    resetForm()
                },

                onError: (err) => {
                    if (err.response?.status === 500) {
                        toast.error('O código do exame deve ser único.')
                    } else {
                        toast.error('Erro ao criar exame')
                    }
                }
            })
        }
    }

    function handleDelete(id) {

        deletarExame(id, {
            onSuccess: () => {
                toast.success('Exame deletado com sucesso!')
            },

            onError: () => {
                toast.error('Erro ao deletar exame!')
            }
        })

    }


    function handleEdit(id, cod, nome, dupExame) {
        setEdit({ id, cod, nome, dupExame });
        setCod(cod);
        setNome(nome);
        setDupExame(dupExame === 'S')
        setModalShow(true);
    }

    return (
        <section className="container">
            <div className="containerH1">
                <h1>Exames</h1>
                <button onClick={() => setModalShow(true)}><IoIosAddCircle /></button>
            </div>

            <div className="grid">
                <table className="tabela-container">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cod</th>
                            <th>Nome</th>
                            <th>Edit</th>
                        </tr>
                        <tr>
                            <th>
                                <input
                                    className="input-tabela input-id"
                                    placeholder="ID"
                                    onChange={(e) => setSearchId(e.target.value)}
                                />
                            </th>
                            <th>
                                <input
                                    className="input-tabela input-cod"
                                    placeholder="Código"
                                    onChange={(e) => setSearchCod(e.target.value)}
                                />
                            </th>
                            <th>
                                <input
                                    className="input-tabela input-nome"
                                    placeholder="Nome"
                                    onChange={(e) => setSearchNome(e.target.value)}
                                />
                            </th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    Carregando exames...
                                </td>
                            </tr>
                        ) : errorBuscarExames ? (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    Erro ao carregar exames: {error.message}
                                </td>
                            </tr>
                        ) : total > 0 ? (
                            exames.map((item, index) => (
                                <tr key={index} onDoubleClick={() => handleEdit(item.id, item.cod, item.nome, item.dupExame)}>
                                    <td>{item.id}</td>
                                    <td>{item.cod}</td>
                                    <td>{item.nome}</td>
                                    <td className="icon">
                                        <span>
                                            <BiSolidCommentEdit onClick={() => handleEdit(item.id, item.cod, item.nome, item.dupExame)} />
                                        </span>
                                        <span>
                                            <FaDeleteLeft onClick={() => handleDelete(item.id)} />
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    Nenhum exame cadastrado.
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
            </div>


            <GenericModal
                show={modalShow}
                onClose={() => {
                    setModalShow(false)
                    resetForm()
                }}
                title="Exame"
            >

                <form onSubmit={handleSubmit} className="container-modal-btn">

                    <Input
                        label="Cód"
                        type="text"
                        name="cod"
                        maxLength="5"
                        placeholder="Cód"
                        required
                        onChange={(e) => setCod(e.target.value)}
                        value={cod}
                    />

                    <Input
                        label="Nome"
                        type="text"
                        name="nome"
                        placeholder="Exame"
                        required
                        onChange={(e) => setNome(e.target.value)}
                        value={nome}
                    />

                    <Input
                        type="checkbox"
                        label="Duplicar exame no atendimento"
                        checked={dupExame}
                        onChange={() => setDupExame(!dupExame)}
                        style={{
                            width: "20px",
                            height: "20px"
                        }}
                    />
                    <div>
                        <button onClick={() => {
                            setModalShow(false)
                            resetForm()
                        }}>Fechar</button>
                        <button type="submit">
                            {edit.id ? 'Salvar alterações' : 'Cadastrar'}
                        </button>
                    </div>
                </form>

            </GenericModal>
            <ToastContainer limit={3}/>
        </section>
    );
}

export default Exames;
