import { useEffect, useState } from 'react'
import axios from 'axios'
import { BiSolidCommentEdit } from "react-icons/bi";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';

import '../../styles/shared.css'

function Home() {
    const [atendimento, setAtendimento] = useState([])
    const [searchId, setSearchId] = useState('')
    const [searchNome, setSearchNome] = useState('')

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const navigate = useNavigate();


    const getAtendimento = async () => {
        try {
            const res = await axios.get('http://localhost:8081/atendimentos', {
                params: {
                    page,
                    limit: 5,
                    searchId,
                    searchNome,
                }
            })
            setAtendimento(res.data.data)
            setTotal(res.data.total)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        setPage(1);
    }, [searchId, searchId, searchNome]);


    useEffect(() => {
        getAtendimento()
    }, [page, searchId, searchNome])

    function nextPage() {
        setPage(prev => prev + 1)
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1)
    }

    return (
        <section className="container">
            <h1>Atendimentos</h1>
            <span>
                Total {total}
            </span>
            <div className="grid">
                <table className="tabela-container">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Data do Atendimento</th>
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
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {atendimento.length > 0 ? (
                            atendimento.map((item, index) => (
                                <tr
                                    key={index}
                                    onDoubleClick={() => navigate(`/atendimento/${item.atendimento_id}`)}
                                >
                                    <td>{item.atendimento_id}</td>
                                    <td>{item.nome}</td>
                                    <td>{item.data_atendimento}</td>
                                    <td className="btnEdit">
                                        <span onClick={() => navigate(`/atendimento/${item.atendimento_id}`)}>
                                            <BiSolidCommentEdit />
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center' }}>
                                    Nenhum atendimento registrado...
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
        </section>
    )
}

export default Home
