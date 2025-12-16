import './style.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { InputMask } from 'primereact/inputmask';

export default function AgendamentoConsulta() {

    const nomeRef = useRef("");
    const sexoRef = useRef("");
    const cpfRef = useRef("");
    const rgRef = useRef("");
    const nascimentoRef = useRef("");
    const telefoneRef = useRef("");
    const emailRef = useRef("");
    const ruaRef = useRef("");
    const numeroRef = useRef("");
    const bairroRef = useRef("");
    const cidadeRef = useRef("");
    const estadoRef = useRef("");
    const cepRef = useRef("");
    const dataConsultaRef = useRef("");
    const horarioConsultaRef = useRef("");
    const tipoConsultaRef = useRef("");
    const primeiraVezRef = useRef("");
    const observacoesRef = useRef("");

    const [erros, setErros] = useState({});
    const [mensagemSucesso, setMensagemSucesso] = useState("");


    const validar = () => {
        const obrigatorios = {
            nome: nomeRef.current,
            sexo: sexoRef.current,
            nascimento: nascimentoRef.current,
            telefone: telefoneRef.current,
            cep: cepRef.current,
            dataConsulta: dataConsultaRef.current,
            horarioConsulta: horarioConsultaRef.current,
            tipoConsulta: tipoConsultaRef.current,
            primeiraVez: primeiraVezRef.current
        };

        const novosErros = {};

        Object.keys(obrigatorios).forEach(campo => {
            if (!obrigatorios[campo]) {
                novosErros[campo] = "Campo obrigatório";
            }
        });

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validar()) {
            setMensagemSucesso("");
            return;
        }

        const data = {
            nome: nomeRef.current,
            sexo: sexoRef.current,
            cpf: cpfRef.current,
            rg: rgRef.current,
            nascimento: nascimentoRef.current,
            telefone: telefoneRef.current,
            email: emailRef.current,
            rua: ruaRef.current,
            numero: numeroRef.current,
            bairro: bairroRef.current,
            cidade: cidadeRef.current,
            estado: estadoRef.current,
            cep: cepRef.current,
            data_consulta: dataConsultaRef.current,
            horario: horarioConsultaRef.current,
            tipo_consulta: tipoConsultaRef.current,
            retorno: primeiraVezRef.current,
            observacao: observacoesRef.current
        };



        await axios.post("http://localhost:8081/agendamento", data);
        setMensagemSucesso("Consulta agendada com sucesso!");

    };


    return (
        <div className="ag-form-container">
            <h1>Agendamento de Consultas</h1>

            <form onSubmit={handleSubmit}>

                <div className="ag-section-block">
                    <h3>Dados do Paciente</h3>
                    <div className="ag-section-grid">

                        <div className="ag-grupo">
                            <label>Nome*</label>
                            <input
                                type="text"
                                className={erros.nome ? "erro" : ""}
                                onChange={e => nomeRef.current = e.target.value}
                            />
                            {erros.nome && <p className="msg-erro">{erros.nome}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>Sexo*</label>
                            <select
                                className={erros.sexo ? "erro" : ""}
                                onChange={e => sexoRef.current = e.target.value}
                            >
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                            {erros.sexo && <p className="msg-erro">{erros.sexo}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>CPF</label>
                            <InputMask
                                type="text"
                                onChange={e => cpfRef.current = e.target.value}
                                mask='999.999.999-99'
                            />
                        </div>

                        <div className="ag-grupo">
                            <label>RG</label>
                            <InputMask
                                type="text"
                                onChange={e => rgRef.current = e.target.value}
                                mask='99999999-9'
                            />
                        </div>

                        <div className="ag-grupo">
                            <label>Data de nascimento*</label>
                            <input
                                type="date"
                                className={erros.nascimento ? "erro" : ""}
                                onChange={e => nascimentoRef.current = e.target.value}
                            />
                            {erros.nascimento && <p className="msg-erro">{erros.nascimento}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>Telefone*</label>
                            <InputMask
                                type="text"
                                className={erros.telefone ? "erro" : ""}
                                onChange={e => telefoneRef.current = e.target.value}
                                mask='(99) 99999-9999'
                            />
                            {erros.telefone && <p className="msg-erro">{erros.telefone}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>E-mail</label>
                            <input type="email" onChange={e => emailRef.current = e.target.value} />
                        </div>

                    </div>
                </div>

                <div className="ag-section-block">
                    <h3>Endereço</h3>
                    <div className="ag-section-grid">

                        <div className="ag-grupo">
                            <label>Rua</label>
                            <input type="text" onChange={e => ruaRef.current = e.target.value} />
                        </div>

                        <div className="ag-grupo">
                            <label>Número</label>
                            <input type="text" onChange={e => numeroRef.current = e.target.value} />
                        </div>

                        <div className="ag-grupo">
                            <label>Bairro</label>
                            <input type="text" onChange={e => bairroRef.current = e.target.value} />
                        </div>

                        <div className="ag-grupo">
                            <label>Cidade</label>
                            <input type="text" onChange={e => cidadeRef.current = e.target.value} />
                        </div>

                        <div className="ag-grupo">
                            <label>Estado</label>
                            <input type="text" onChange={e => estadoRef.current = e.target.value} />
                        </div>

                        <div className="ag-grupo">
                            <label>CEP*</label>
                            <InputMask
                                type="text"
                                className={erros.cep ? "erro" : ""}
                                onChange={e => cepRef.current = e.target.value}
                                mask='99999-999'
                            />
                            {erros.cep && <p className="msg-erro">{erros.cep}</p>}
                        </div>

                    </div>
                </div>

                <div className="ag-section-block">
                    <h3>Consulta</h3>
                    <div className="ag-section-grid">

                        <div className="ag-grupo">
                            <label>Data da consulta*</label>
                            <input
                                type="date"
                                className={erros.dataConsulta ? "erro" : ""}
                                onChange={e => dataConsultaRef.current = e.target.value}
                            />
                            {erros.dataConsulta && <p className="msg-erro">{erros.dataConsulta}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>Horário da consulta*</label>
                            <input
                                type="time"
                                className={erros.horarioConsulta ? "erro" : ""}
                                onChange={e => horarioConsultaRef.current = e.target.value}
                            />
                            {erros.horarioConsulta && <p className="msg-erro">{erros.horarioConsulta}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>Tipo de consulta*</label>
                            <input
                                type="text"
                                className={erros.tipoConsulta ? "erro" : ""}
                                onChange={e => tipoConsultaRef.current = e.target.value}
                            />
                            {erros.tipoConsulta && <p className="msg-erro">{erros.tipoConsulta}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>É a primeira consulta?*</label>
                            <select
                                className={erros.primeiraVez ? "erro" : ""}
                                onChange={e => primeiraVezRef.current = e.target.value}
                            >
                                <option value="">Selecione</option>
                                <option value="S">Sim</option>
                                <option value="N">Retorno</option>
                            </select>
                            {erros.primeiraVez && <p className="msg-erro">{erros.primeiraVez}</p>}
                        </div>

                        <div className="ag-grupo" style={{ gridColumn: "span 2" }}>
                            <label>Observações adicionais</label>
                            <textarea
                                onChange={e => observacoesRef.current = e.target.value}
                            ></textarea>
                        </div>

                    </div>
                </div>

                <button type="submit" className="ag-botao-agendar">Agendar Consulta</button>
            </form>

            {mensagemSucesso && (
                <p className="ag-mensagem-sucesso">{mensagemSucesso}</p>
            )}
        </div>
    );
}
