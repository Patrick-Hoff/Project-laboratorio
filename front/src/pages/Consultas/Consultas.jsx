import React, { useState, useEffect } from "react";
import axios from 'axios'
import { formatarData } from '../../utils/formatters'
import "./style.css";

export default function Consultas() {
    // const [consultas, setConsultas] = useState([
    //     {
    //         id: 1,
    //         nome: "João Silva",
    //         sexo: "Masculino",
    //         cpf: "12345678901",
    //         rg: "MG123456",
    //         nascimento: "1980-05-10",
    //         telefone: "(31) 99999-9999",
    //         email: "joao@email.com",
    //         rua: "Rua A",
    //         numero: 123,
    //         bairro: "Centro",
    //         cidade: "Belo Horizonte",
    //         estado: "MG",
    //         cep: 30123456,
    //         data_consulta: "2025-12-01",
    //         horario: "14:00",
    //         tipo_consulta: "Retorno",
    //         retorno: "S",
    //         observacao: "Trazer exames anteriores"
    //     },
    //     {
    //         id: 2,
    //         nome: "Maria Souza",
    //         sexo: "Feminino",
    //         cpf: "98765432100",
    //         rg: "SP987654",
    //         nascimento: "1990-09-15",
    //         telefone: "(11) 98888-8888",
    //         email: "maria@email.com",
    //         rua: "Avenida B",
    //         numero: 456,
    //         bairro: "Jardim",
    //         cidade: "São Paulo",
    //         estado: "SP",
    //         cep: 12345678,
    //         data_consulta: "2025-12-02",
    //         horario: "09:30",
    //         tipo_consulta: "Primeira consulta",
    //         retorno: "N",
    //         observacao: "Chegar 15 minutos antes"
    //     },
    //     {
    //         id: 3,
    //         nome: "João Silva",
    //         sexo: "Masculino",
    //         cpf: "12345678901",
    //         rg: "MG123456",
    //         nascimento: "1980-05-10",
    //         telefone: "(31) 99999-9999",
    //         email: "joao@email.com",
    //         rua: "Rua A",
    //         numero: 123,
    //         bairro: "Centro",
    //         cidade: "Belo Horizonte",
    //         estado: "MG",
    //         cep: 30123456,
    //         data_consulta: "2025-12-01",
    //         horario: "14:00",
    //         tipo_consulta: "Retorno",
    //         retorno: "S",
    //         observacao: "Trazer exames anteriores"
    //     },
    //     {
    //         id: 4,
    //         nome: "Maria Souza",
    //         sexo: "Feminino",
    //         cpf: "98765432100",
    //         rg: "SP987654",
    //         nascimento: "1990-09-15",
    //         telefone: "(11) 98888-8888",
    //         email: "maria@email.com",
    //         rua: "Avenida B",
    //         numero: 456,
    //         bairro: "Jardim",
    //         cidade: "São Paulo",
    //         estado: "SP",
    //         cep: 12345678,
    //         data_consulta: "2025-12-02",
    //         horario: "09:30",
    //         tipo_consulta: "Primeira consulta",
    //         retorno: "N",
    //         observacao: "Chegar 15 minutos antes"
    //     },
    //     {
    //         id: 5,
    //         nome: "João Silva",
    //         sexo: "Masculino",
    //         cpf: "12345678901",
    //         rg: "MG123456",
    //         nascimento: "1980-05-10",
    //         telefone: "(31) 99999-9999",
    //         email: "joao@email.com",
    //         rua: "Rua A",
    //         numero: 123,
    //         bairro: "Centro",
    //         cidade: "Belo Horizonte",
    //         estado: "MG",
    //         cep: 30123456,
    //         data_consulta: "2025-12-01",
    //         horario: "14:00",
    //         tipo_consulta: "Retorno",
    //         retorno: "S",
    //         observacao: "Trazer exames anteriores"
    //     },
    //     {
    //         id: 6,
    //         nome: "Maria Souza",
    //         sexo: "Feminino",
    //         cpf: "98765432100",
    //         rg: "SP987654",
    //         nascimento: "1990-09-15",
    //         telefone: "(11) 98888-8888",
    //         email: "maria@email.com",
    //         rua: "Avenida B",
    //         numero: 456,
    //         bairro: "Jardim",
    //         cidade: "São Paulo",
    //         estado: "SP",
    //         cep: 12345678,
    //         data_consulta: "2025-12-02",
    //         horario: "09:30",
    //         tipo_consulta: "Primeira consulta",
    //         retorno: "N",
    //         observacao: "Chegar 15 minutos antes"
    //     }
    // ]);
    const [consultas, setConsultas] = useState([])
    const [selectedConsulta, setSelectedConsulta] = useState(null);

    // Função para edição
    function editarConsulta(id) {
        alert("Função de edição ainda não implementada. ID: " + id);
    }


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



    return (
        <div className="consultas-container">
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
                            <h3>{consulta.nome}</h3>
                            <span className="consultas-tag">{consulta.tipo_consulta}</span>
                        </div>

                        <div className="consultas-card-info-block">
                            <p><strong>📅</strong> {consulta.data_consulta}</p>
                            <p><strong>⏰</strong> {consulta.horario}</p>
                            <p><strong>📍</strong> {consulta.cidade} - {consulta.estado}</p>
                            <p><strong>☎️</strong> {consulta.telefone}</p>
                        </div>

                        <div className="consultas-card-actions">
                            <button
                                className="consultas-btn editar"
                                onClick={() => editarConsulta(consulta.id)}
                            >
                                Editar
                            </button>

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
