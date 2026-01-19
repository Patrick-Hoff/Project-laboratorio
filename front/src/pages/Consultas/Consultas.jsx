import { useLocation, Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import axios from 'axios'
import { formatarData } from '../../utils/formatters'
import "./style.css";

export default function Consultas() {

    const [consultas, setConsultas] = useState([])
    const [selectedConsulta, setSelectedConsulta] = useState(null);

    const location = useLocation();
    const [mensagem, setMensagem] = useState("");

    const getConsultas = async () => {
        try {
            const res = await axios.get('http://localhost:8081/agendamento')
            setConsultas(res.data)
        } catch (error) {
            console.error("Erro ao buscar consultas: ", error)
        }
    }

    useEffect(() => {
        getConsultas()
    }, [])


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
        if(!texto) return "";
        return texto.length > limite
        ? texto.slice(0, limite) + "..."
        : texto
    }

    return (
        <div className="consultas-container">
            {mensagem && (
                <p style={{ color: "green" }}>
                    {mensagem}
                </p>
            )}
            <h1 className="consultas-title">Consultas Agendadas</h1>

            {/* GRID DE CONSULTAS */}
            <div className="consultas-grid">
                {consultas.map((consulta) => (
                    <div
                        key={consulta.id}
                        className="consultas-card"
                        onDoubleClick={() => setSelectedConsulta(consulta)}
                    >
                        <div className="consultas-card-header">
                            <h3>{limitarTexto(consulta.nome)}</h3>
                            <span className="consultas-tag">{consulta.tipo_consulta}</span>
                        </div>

                        <div className="consultas-card-info-block">
                            <p><strong>📅</strong> {consulta.data_consulta}</p>
                            <p><strong>⏰</strong> {consulta.horario}</p>
                            <p><strong>📍</strong> {consulta.cidade} - {consulta.estado}</p>
                            <p><strong>☎️</strong> {consulta.telefone}</p>
                        </div>

                        <div className="consultas-card-actions">
                            <Link to={`http://localhost:5173/agenda/${consulta.id}`}>
                                <button
                                    className="consultas-btn editar"
                                >
                                    Editar
                                </button>
                            </Link>
                            <button
                                className="consultas-btn detalhes"
                                onClick={() => setSelectedConsulta(consulta)}
                            >
                                Ver detalhes
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {selectedConsulta && (
                <div
                    className="consultas-modal-overlay"
                    onClick={(e) => {
                        // Fecha ao clicar fora do modal
                        if (e.target.classList.contains("consultas-modal-overlay")) {
                            setSelectedConsulta(null);
                        }
                    }}
                >
                    <div className="consultas-modal">
                        <h2 className="consultas-modal-title">Detalhes da Consulta</h2>

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

                        <button
                            className="consultas-btn fechar"
                            onClick={() => setSelectedConsulta(null)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
