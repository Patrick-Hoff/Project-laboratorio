import React, { useState, useEffect } from "react";
import "./Convenio.css";

// Import Hooks
import { useConvenios } from "../../hooks/convenios/useConvenios";
import { useCriarConvenio } from "../../hooks/convenios/useCriarConvenio";
import { useEditarConvenio } from "../../hooks/convenios/useEditarConvenio";
import { useDeletarConvenio } from "../../hooks/convenios/useDeletarConvenio";

export default function ConveniosPage() {

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
    const [limit] = useState(10)

    const [erro, setErro] = useState('')
    const [success, setSuccess] = useState('')

    // Listar convenios
    const {
        data,
        isLoading,
        error: errorBuscarConvenios
    } = useConvenios({
        cod: debouncedCod,
        nome: debouncedNome,
        page: page,
        limit: limit
    });

    const total = data?.total ?? 0;
    const convenios = data?.data ?? [];
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Criar convenio
    const { mutate: criarConvenio } = useCriarConvenio();

    // Editar convenio
    const { mutate: editarConvenio } = useEditarConvenio();

    // Deletar convenio
    const { mutate: deletarConvenio } = useDeletarConvenio();

    // Debounce da pesquisa
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCod(searchConvenioCod);
            setDebouncedNome(searchConvenio)
            setPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchConvenioCod, searchConvenio])

    // Limpa as mensagens depois de 9 segundos
    useEffect(() => {
        if (!erro && !success) return;

        const timer = setTimeout(() => {
            setErro('');
            setSuccess('')
        }, 9000);

        return () => clearTimeout(timer);
    }, [erro, success]);

    const handleAdd = () => {
        if (!novoConvenio.cod || !novoConvenio.nome) return;

        criarConvenio(novoConvenio, {
            onSuccess: () => {
                setErro('')
                setSuccess('Convênio criado com sucesso!')
                setNovoConvenio({ cod: "", nome: "" });
            },

            onError: (err) => {
                setSuccess('')
                setErro(err.response?.data?.error ?? 'Erro ao criar convênio')
            }
        })
    };

    const handleDelete = (id) => {
        if (!window.confirm('Deseja realmente excluir este convênio?')) return

        deletarConvenio(id, {
            onSuccess: (res) => {
                setErro('')
                setSuccess(res?.data?.mensagem ?? 'Convênio excluído com sucesso!')
            },

            onError: (err) => {
                setSuccess('')
                setErro(err.response?.data?.error ?? 'Erro ao excluir convênio')
            }
        })
    };

    const iniciarEdicao = (convenio) => {
        setEditandoId(convenio.id);
        setDadosEditados({
            cod: convenio.cod,
            nome: convenio.nome,
        });
    };

    const salvarEdicao = (id) => {
        editarConvenio({
            id,
            convenio: dadosEditados
        }, {
            onSuccess: (res) => {
                setErro('')
                setSuccess(res?.data?.mensagem ?? 'Convênio editado com sucesso!')
                setEditandoId(null);
            },

            onError: (err) => {
                setSuccess('')
                setErro(err.response?.data?.error ?? 'Erro ao editar convênio')
            }
        })
    };

    const cancelarEdicao = () => {
        setEditandoId(null);
    };

    function nextPage() {
        if (page < totalPages) setPage(prev => prev + 1)
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1)
    }

    return (
        <div className="page-container">
            <div className="card">
                <h1>Cadastro de Convênios</h1>

                {erro && <p className="error">{erro}</p>}
                {success && <p className="success">{success}</p>}

                {/* ===== FORMULÁRIO ===== */}
                <div className="form-section">
                    <input
                        type="text"
                        placeholder="Código do convênio"
                        maxLength="10"
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
                        maxLength="100"
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
                            value={searchConvenioCod}
                            onChange={(e) => setSearchConvenioCod(e.target.value)}
                        />
                    </div>

                    <div className="search-group">
                        <input
                            type="text"
                            placeholder="🔎 Pesquisar por nome..."
                            className="search-input"
                            value={searchConvenio}
                            onChange={(e) => setSearchConvenio(e.target.value)}
                        />
                    </div>
                </div>

                {/* ===== LISTA ===== */}
                <div className="lista">
                    {isLoading ? (
                        <p style={{ textAlign: 'center' }}>Carregando convênios...</p>
                    ) : errorBuscarConvenios ? (
                        <p style={{ textAlign: 'center' }}>
                            Erro ao carregar convênios: {errorBuscarConvenios.message}
                        </p>
                    ) : convenios.length === 0 ? (
                        <p style={{ textAlign: 'center' }}>Nenhum convênio cadastrado.</p>
                    ) : (
                        convenios.map((convenio) => (
                            <div key={convenio.id} className="convenio-item">
                                {editandoId === convenio.id ? (
                                    <>
                                        <div className="info edit-mode">
                                            <input
                                                className="edit-input"
                                                type="text"
                                                maxLength="10"
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
                                                maxLength="100"
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
                    <button onClick={prevPage} disabled={page <= 1}>
                        Anterior
                    </button>

                    <span>
                        Página {page} de {totalPages}
                    </span>

                    <button onClick={nextPage} disabled={page >= totalPages}>
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}