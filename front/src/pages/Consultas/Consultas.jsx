import { useLocation, Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import axios from 'axios'
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

import GenericModal from '../../components/Modal/Modal';
import "./style.css";

export default function Consultas() {

    const [consultas, setConsultas] = useState([])
    const [selectedConsulta, setSelectedConsulta] = useState(false);

    const [nome, setNome] = useState("")
    const [data, setData] = useState("")
    const [proximas, setProximas] = useState(false)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [modalExcluir, setModalExcluir] = useState(false)

    const location = useLocation();
    const [mensagem, setMensagem] = useState("");

    const getConsultas = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8081/agendamento?` +
                `orderDir=ASC` +
                `&nome=${nome}` +
                `&data=${data}` +
                `&proximos=${proximas}` +
                `&limit=${limit}` +
                `&page=${page}`
            )
            setConsultas(res.data.data)
            setTotal(res.data.total)
        } catch (error) {
            console.error("Erro ao buscar consultas: ", error)
        }
    }

    const removeConsulta = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:8081/agendamento/${id}`)
            setModalExcluir(false)
            setMensagem(res.data)
            getConsultas()
        } catch (error) {
            console.error("Erro ao excluir agendamento")
        }
    }

    useEffect(() => {
        if (mensagem.length > 0) {
            const timer = setTimeout(() => {
                setMensagem("")
            }, 3000)
        }
    }, [mensagem])

    const handleSubmit = (e) => {
        e.preventDefault()
        setPage(1)
        getConsultas();
    }

    useEffect(() => {
        getConsultas()
    }, [page, limit])


    useEffect(() => {
        if (location.state?.mensagem) {
            setMensagem(location.state.mensagem);

            window.history.replaceState({}, document.title);

            const timer = setTimeout(() => {
                setMensagem("")
            }, 3000);

            return () => clearTimeout(timer)
        }
    }, [location.state])


    const limitarTexto = (texto, limite = 20) => {
        if (!texto) return "";
        return texto.length > limite
            ? texto.slice(0, limite) + "..."
            : texto
    }

    function nextPage() {
        setPage(prev => prev + 1)
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1)
    }


    return (
        <div className="consultas-container">
            {mensagem && (
                <p style={{ color: "green" }}>
                    {mensagem}
                </p>
            )}
            <h1 className="consultas-title">Consultas Agendadas</h1>

            {/* FILTROS */}
            <div className="consultas-filtros">
                <div className="filtro-grupo">
                    <label>Pesquisar</label>
                    <input
                        type="text"
                        placeholder="Nome do paciente"
                        onChange={(e) => setNome(e.target.value)}
                        value={nome}
                    />
                </div>

                <div className="filtro-grupo">
                    <label>Data da consulta</label>
                    <input
                        type="date"
                        onChange={(e) => setData(e.target.value)}
                        value={data}
                    />
                </div>

                <div className="filtro-grupo checkbox">
                    <label>
                        <input
                            type="checkbox"
                            checked={proximas}
                            onChange={(e) => setProximas(e.target.checked)}
                        />
                        Próximas consultas do dia
                    </label>
                </div>

                <div className="filtro-grupo">
                    <label>Registros por página</label>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <button className="btn-filtrar" onClick={handleSubmit}>
                    Aplicar filtros
                </button>
            </div>

            {/* GRID DE CONSULTAS */}
            <div className="consultas-grid">
                {consultas.length > 0 ? (
                    consultas.map((consulta) => (
                        <div
                            key={consulta.id}
                            className="consultas-card"
                            onDoubleClick={() => setSelectedConsulta(consulta)}
                        >
                            <div className="consultas-card-header">
                                <h3>{limitarTexto(consulta.nome)}</h3>
                                <span className="consultas-tag">
                                    {consulta.tipo_consulta}
                                </span>
                            </div>

                            <div className="consultas-card-info-block">
                                <p><strong>📅</strong> {consulta.data_consulta}</p>
                                <p><strong>⏰</strong> {consulta.horario}</p>
                                <p><strong>📍</strong> {consulta.cidade} - {consulta.estado}</p>
                                <p><strong>☎️</strong> {consulta.telefone}</p>
                            </div>

                            <div className="consultas-card-actions">
                                <Link to={`/agenda/${consulta.id}`}>
                                    <button className="consultas-btn editar">
                                        Editar
                                    </button>
                                </Link>

                                <button
                                    className="consultas-btn detalhes"
                                    onClick={() => setSelectedConsulta(consulta)}
                                >
                                    Ver detalhes
                                </button>
                                <button
                                    className='consultas-btn remove'
                                    onClick={() => setModalExcluir({ id: consulta.id })}
                                >
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div colSpan="4" style={{ textAlign: 'center' }}>Nenhuma consulta encontrada</div>
                )}
            </div>

            <GenericModal
                show={modalExcluir}
                onClose={() => setModalExcluir(false)}
                title="Excluir Consulta"
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
                        onClick={() => removeConsulta(modalExcluir.id)}
                    >
                        Excluir
                    </button>
                </div>
            </GenericModal>

            <GenericModal
                show={selectedConsulta}
                onClose={() => setSelectedConsulta(false)}
                title="Detalhes da Consulta"
            >
                <div className="consultas-modal-body">
                    <p><strong>Nome:</strong> {selectedConsulta.nome}</p>
                    <p><strong>Sexo:</strong> {selectedConsulta.sexo}</p>
                    <p><strong>CPF:</strong> {selectedConsulta.cpf}</p>
                    <p><strong>RG:</strong> {selectedConsulta.rg}</p>
                    <p><strong>Nascimento:</strong> {selectedConsulta.nascimento}</p>
                    <p><strong>Telefone:</strong> {selectedConsulta.telefone}</p>
                    <p><strong>Email:</strong> {selectedConsulta.email}</p>
                    <p>
                        <strong>Endereço:</strong>{" "}
                        {selectedConsulta.rua}, {selectedConsulta.numero},{" "}
                        {selectedConsulta.bairro}, {selectedConsulta.cidade} -{" "}
                        {selectedConsulta.estado}, CEP {selectedConsulta.cep}
                    </p>
                    <p><strong>Data:</strong> {selectedConsulta.data_consulta}</p>
                    <p><strong>Horário:</strong> {selectedConsulta.horario}</p>
                    <p><strong>Tipo:</strong> {selectedConsulta.tipo_consulta}</p>
                    <p>
                        <strong>Retorno:</strong>{" "}
                        {selectedConsulta.retorno === "S" ? "Sim" : "Não"}
                    </p>
                    <p><strong>Observação:</strong> {selectedConsulta.observacao}</p>
                </div>
                <div>
                    <button
                        className="consultas-btn fechar"
                        onClick={() => setSelectedConsulta(false)}
                    >
                        Fechar
                    </button>
                </div>
            </GenericModal>
            
            <div className="pagination">
                <FaArrowLeft
                    className={`arrow ${page <= 1 ? 'disabled' : ''}`}
                    onClick={page <= 1 ? null : prevPage}
                />
                <span>Página {page} de {Math.ceil(total / limit)}</span>
                <FaArrowRight
                    className={`arrow ${page >= Math.ceil(total / limit) ? 'disabled' : ''}`}
                    onClick={page >= Math.ceil(total / limit) ? null : nextPage}
                />
            </div>
        </div>
    );
}
