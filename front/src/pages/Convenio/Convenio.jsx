import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import axios from 'axios'
import "./Convenio.css";

export default function ConveniosPage() {
    const [convenios, setConvenios] = useState([]);

    const [novoConvenio, setNovoConvenio] = useState({
        cod: "",
        nome: "",
    });

    const [editandoId, setEditandoId] = useState(null);
    const [dadosEditados, setDadosEditados] = useState({
        cod: "",
        nome: "",
    });

    const [debouncedCod, setDebouncedCod] = useState('');
    const [debouncedNome, setDebouncedNome] = useState('');
    const [searchConvenioCod, setSearchConvenioCod] = useState('')
    const [searchConvenio, setSearchConvenio] = useState('')
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [total, setTotal] = useState(10)

    const [erro, setErro] = useState('')
    const [sucess, setSucess] = useState('')

    const getConvenio = async () => {
        try {
            const res = await axios.get('http://localhost:8081/convenio', {
                params: {
                    cod: debouncedCod,
                    nome: debouncedNome,
                    page: page,
                    limit: limit
                }
            })
            setConvenios(res.data.data)
            setTotal(res.data.total)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getConvenio()
    }, [page, limit, debouncedCod, debouncedNome])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCod(searchConvenioCod);
            setDebouncedNome(searchConvenio)
            setPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchConvenioCod, searchConvenio])

    const handleAdd = async () => {
        try {

            if (!novoConvenio.cod || !novoConvenio.nome) return;

            await axios.post('http://localhost:8081/convenio', novoConvenio)
            getConvenio()
            setSucess('Convênio criado com sucesso!')

        } catch (err) {
            setErro(err.response.data.error)
        }
        setNovoConvenio({ cod: "", nome: "" });
    };

    const handleDelete = async (id) => {
        try {

            const res = await axios.delete(`http://localhost:8081/convenio/${id}`)
            setSucess(res.data.mensagem)
            getConvenio()
            setErro('')

        } catch (err) {
            setErro(err.response.data.error)
        }
    };

    const iniciarEdicao = (convenio) => {
        setEditandoId(convenio.id);
        setDadosEditados({
            cod: convenio.cod,
            nome: convenio.nome,
        });
    };

    const salvarEdicao = async (id) => {

        try {

            const res = await axios.put(`http://localhost:8081/convenio/${id}`, dadosEditados)
            setSucess(res.data.mensagem)
            setEditandoId(null);
            getConvenio()
        } catch (err) {
            console.log(err)
        }
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
    };

    useEffect(() => {
        if (!erro && !sucess) return;

        const timer = setTimeout(() => {
            setErro('');
            setSucess('')
        }, 9000);

        return () => clearTimeout(timer);
    }, [erro, sucess]);

    function nextPage() {
        setPage(prev => prev + 1)
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1)
    }

    return (
        <div className="page-container">
            <div className="card">
                <h1>Cadastro de Convênios</h1>

                {erro && <p className="error">{error}</p>}
                {sucess && <p className="sucess">{sucess}</p>}

                {/* ===== FORMULÁRIO ===== */}
                <div className="form-section">
                    <input
                        type="text"
                        placeholder="Código do convênio"
                        value={novoConvenio.cod}
                        onChange={(e) =>
                            setNovoConvenio({
                                ...novoConvenio,
                                cod: e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Nome do convênio"
                        value={novoConvenio.nome}
                        onChange={(e) =>
                            setNovoConvenio({
                                ...novoConvenio,
                                nome: e.target.value
                            })
                        }
                    />

                    <button onClick={handleAdd}>Cadastrar</button>
                </div>

                {/* ===== PESQUISA ===== */}
                <div className="search-section">
                    <div className="search-group">
                        <input
                            type="text"
                            placeholder="🔎 Pesquisar por código..."
                            className="search-input"
                            onChange={(e) => setSearchConvenioCod(e.target.value)}
                        />
                    </div>

                    <div className="search-group">
                        <input
                            type="text"
                            placeholder="🔎 Pesquisar por nome..."
                            className="search-input"
                            onChange={(e) => setSearchConvenio(e.target.value)}
                        />
                    </div>
                </div>

                {/* ===== LISTA ===== */}
                <div className="lista">
                    {convenios.length === 0 ? (
                        <p style={{ textAlign: "center", color: "#777" }}>
                            Nenhum convênio encontrado.
                        </p>
                    ) : (
                        convenios.map((convenio) => (
                            <div key={convenio.id} className="convenio-item">
                                {editandoId === convenio.id ? (
                                    <>
                                        <div className="info edit-mode">
                                            <input
                                                className="edit-input"
                                                type="text"
                                                value={dadosEditados.cod}
                                                onChange={(e) =>
                                                    setDadosEditados({
                                                        ...dadosEditados,
                                                        cod: e.target.value,
                                                    })
                                                }
                                            />

                                            <input
                                                className="edit-input"
                                                type="text"
                                                value={dadosEditados.nome}
                                                onChange={(e) =>
                                                    setDadosEditados({
                                                        ...dadosEditados,
                                                        nome: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="actions">
                                            <button
                                                className="save-btn"
                                                onClick={() => salvarEdicao(convenio.id)}
                                            >
                                                Salvar
                                            </button>
                                            <button
                                                className="cancel-btn"
                                                onClick={cancelarEdicao}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="info">
                                            <strong>{convenio.cod}</strong>
                                            <span>{convenio.nome}</span>
                                        </div>

                                        <div className="actions">
                                            <button
                                                className="edit-btn"
                                                onClick={() => iniciarEdicao(convenio)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => handleDelete(convenio.id)}
                                            >
                                                Excluir
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* ===== PAGINAÇÃO ===== */}
                <div className="pagination">
                    <button
                        onClick={page > 1 ? prevPage : null}
                    >
                        Anterior
                    </button>

                    <span>
                        Página {page} de {Math.ceil(total / limit)}
                    </span>

                    <button
                        onClick={page >= Math.ceil(total / limit) ? null : nextPage}
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}