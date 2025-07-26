import { useEffect, useState } from "react";
import axios from 'axios';
import { BiSolidCommentEdit } from "react-icons/bi";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { ToastContainer, toast } from 'react-toastify';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function Exames() {
    const [exames, setExames] = useState([]);
    const [modalShow, setModalShow] = useState(false); // 👈 controla visibilidade do modal
    const [cod, setCod] = useState('')
    const [nome, setNome] = useState('')
    const [edit, setEdit] = useState([])

    const [searchId, setSearchId] = useState('')
    const [searchCod, setSearchCod] = useState('')
    const [searchNome, setSearchNome] = useState('')

    const [page, setPage] = useState(1)

    const [total, setTotal] = useState(0);

    const getExames = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/exames`, {
                params: {
                    page,
                    limit: 5,
                    searchId,
                    searchCod,
                    searchNome
                }
            });

            setExames(res.data.data);
            setTotal(res.data.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [searchId, searchCod, searchNome]);

    useEffect(() => {
        getExames();
    }, [page, searchId, searchCod, searchNome]);




    function nextPage() {
        setPage(prev => prev + 1)
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1)
    }

    function handleSubmit(e) {
        e.preventDefault()

        const exame = {
            cod: cod,
            nome: nome
        }
        console.log(exame)

        if (edit.id) {

            axios.put(`http://localhost:8081/exames/${edit.id}/edit`, exame)
                .then(() => {
                    toast.success('Exame editado com sucesso!')
                    resetForm()
                    getExames()
                })

        } else {
            axios.post('http://localhost:8081/exames', exame)
                .then(() => {
                    console.log()
                    setModalShow(false)
                    setCod('')
                    setNome('')
                    getExames()
                    exame()
                    toast.success('Exame criado com sucesso!')
                }).catch((err) => {
                    if (err.response && err.response.status === 500) {
                        toast.error('O código do exame deve ser unico.')
                    }
                })
        }


    }

    function handleDelete(id) {
        axios.delete(`http://localhost:8081/exames/${id}/remove`)
            .then(() => {
                toast.success('Exame deletado com sucesso!')
                getExames()
            }).catch((error) => {
                toast.error('Erro ao deletar exame!', error)
            })
    }

    function resetForm() {
        setModalShow(false)
        setCod('')
        setNome('')
        setEdit({})
    }

    function handleEdit(id, cod, nome) {
        setEdit({ id, cod, nome });
        setCod(cod);
        setNome(nome);
        setModalShow(true);
    }


    const listaParaMostrar = exames;


    return (
        <section className="container">
            <div className="containerH1">
                <h1>Exames</h1>
                <button onClick={() => setModalShow(true)}><IoIosAddCircle /></button>
            </div>

            <div className="grid">
                <table className="tabela-atendimento">
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
                        {exames.length === 0 ? (
                            <tr>
                                <td colSpan="4">Nenhum exame registrado...</td>
                            </tr>
                        ) : listaParaMostrar.length > 0 ? (
                            listaParaMostrar.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.id}</td>
                                    <td>{item.cod}</td>
                                    <td>{item.nome}</td>
                                    <td className="icon">
                                        <span>
                                            <BiSolidCommentEdit onClick={() => handleEdit(item.id, item.cod, item.nome)} />
                                        </span>
                                        <span>
                                            <FaDeleteLeft onClick={() => handleDelete(item.id)} />
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Nenhum exame encontrado...</td>
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
                        {edit.id ? 'Editar exame' : 'Cadastrar novo exame'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formGroupName">
                            <Form.Label>Código</Form.Label>
                            <Form.Control
                                type="text"
                                name="cod"
                                maxLength="5"
                                placeholder="Cód"
                                required
                                onChange={(e) => setCod(e.target.value)}
                                value={cod}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="nome"
                                placeholder="Exame"
                                required
                                onChange={(e) => setNome(e.target.value)}
                                value={nome}
                            />
                        </Form.Group>
                        <Modal.Footer>
                            <Button onClick={() => setModalShow(false)}>Fechar</Button>
                            <Button type="submit">
                                {edit.id ? 'Salvar alterações' : 'Cadastrar'}
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>

            </Modal>
            <ToastContainer />
        </section>
    );
}

export default Exames;
