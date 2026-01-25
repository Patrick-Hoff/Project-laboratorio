import './style.css';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { InputMask } from 'primereact/inputmask';

export default function AgendamentoConsulta() {

    const { id } = useParams();
    const navigate = useNavigate();
    const [erros, setErros] = useState({});
    const [loading, setLoading] = useState(false);

    const formRef = useRef(null);

    // REFs individuais para envio
    const refs = {
        nome: useRef(""),
        sexo: useRef(""),
        cpf: useRef(""),
        rg: useRef(""),
        nascimento: useRef("2025-05-05"),
        telefone: useRef(""),
        email: useRef(""),
        rua: useRef(""),
        numero: useRef(""),
        bairro: useRef(""),
        cidade: useRef(""),
        estado: useRef(""),
        cep: useRef(""),
        dataConsulta: useRef(""),
        horarioConsulta: useRef(""),
        tipoConsulta: useRef(""),
        primeiraVez: useRef(""),
        observacoes: useRef("")
    };

    function formatToInputDate(dateStr) {
        if (!dateStr) return "";

        const separator = dateStr.includes("/") ? "/" : "-";
        const [dia, mes, ano] = dateStr.split(separator);
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }



    // Preenche automaticamente o formulário se houver id (edição)
    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:8081/agendamento?id=${id}`)
                .then(res => {
                    const consulta = res.data.data;
                    console.log(consulta);

                    const mapBackend = {
                        dataConsulta: "data_consulta",
                        tipoConsulta: "tipo_consulta",
                        primeiraVez: "retorno",
                        observacoes: "observacao",
                        horarioConsulta: "horario"
                    };

                    Object.keys(refs).forEach(key => {
                        const backendKey = mapBackend[key] || key;

                        if (consulta[backendKey] !== undefined && consulta[backendKey] !== null) {
                            let valor = consulta[backendKey];

                            if (key === "nascimento" || key === "dataConsulta") {
                                valor = formatToInputDate(valor);
                            }

                            refs[key].current = valor;

                            const input = formRef.current.querySelector(`[name="${key}"]`);
                            if (input) {
                                input.value = valor;
                            }
                        }
                    });
                })
                .catch(err => console.error(err));
        }
    }, [id]);


    // Validação
    const validar = () => {
        const obrigatorios = [
            "nome", "sexo", "nascimento", "telefone",
            "cep", "dataConsulta", "horarioConsulta",
            "tipoConsulta", "primeiraVez"
        ];

        const novosErros = {};
        obrigatorios.forEach(campo => {
            if (!refs[campo].current) {
                novosErros[campo] = "Campo obrigatório";
            }
        });

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    // Submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validar()) return;

        const data = {
            nome: refs.nome.current,
            sexo: refs.sexo.current,
            cpf: refs.cpf.current,
            rg: refs.rg.current,
            nascimento: refs.nascimento.current,
            telefone: refs.telefone.current,
            email: refs.email.current,
            rua: refs.rua.current,
            numero: refs.numero.current,
            bairro: refs.bairro.current,
            cidade: refs.cidade.current,
            estado: refs.estado.current,
            cep: refs.cep.current,
            data_consulta: refs.dataConsulta.current,
            horario: refs.horarioConsulta.current,
            tipo_consulta: refs.tipoConsulta.current,
            retorno: refs.primeiraVez.current,
            observacao: refs.observacoes.current
        };


        try {
            setLoading(true);
            if (id) {
                await axios.put(`http://localhost:8081/agendamento/${id}`, data);
            } else {
                await axios.post(`http://localhost:8081/agendamento`, data);
            }
            navigate("/consultas", {
                state: {
                    mensagem: id
                        ? "Consulta atualizada com sucesso!"
                        : "Consulta criada com sucesso!"
                }
            });
        } catch (err) {
            console.error(err);
            alert("Erro ao salvar a consulta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ag-form-container">
            <h1>{id ? "Editar Consulta" : "Agendamento de Consultas"}</h1>

            <form ref={formRef} onSubmit={handleSubmit}>

                {/* DADOS DO PACIENTE */}
                <div className="ag-section-block">
                    <h3>Dados do Paciente</h3>
                    <div className="ag-section-grid">
                        <div className="ag-grupo">
                            <label>Nome*</label>
                            <input
                                type="text"
                                name="nome"
                                className={erros.nome ? "erro" : ""}
                                onChange={e => refs.nome.current = e.target.value}
                            />
                            {erros.nome && <p className="msg-erro">{erros.nome}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>Sexo*</label>
                            <select
                                name="sexo"
                                className={erros.sexo ? "erro" : ""}
                                onChange={e => refs.sexo.current = e.target.value}
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
                                name="cpf"
                                type="text"
                                mask='999.999.999-99'
                                onChange={e => refs.cpf.current = e.target.value}
                            />
                        </div>

                        <div className="ag-grupo">
                            <label>RG</label>
                            <InputMask
                                name="rg"
                                type="text"
                                mask='99999999-9'
                                onChange={e => refs.rg.current = e.target.value}
                            />
                        </div>

                        <div className="ag-grupo">
                            <label>Data de nascimento*</label>
                            <input
                                type="date"
                                name="nascimento"
                                className={erros.nascimento ? "erro" : ""}
                                onChange={e => refs.nascimento.current = e.target.value}
                            />

                            {erros.nascimento && <p className="msg-erro">{erros.nascimento}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>Telefone*</label>
                            <InputMask
                                name="telefone"
                                type="text"
                                mask='(99) 99999-9999'
                                className={erros.telefone ? "erro" : ""}
                                onChange={e => refs.telefone.current = e.target.value}
                            />
                            {erros.telefone && <p className="msg-erro">{erros.telefone}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>E-mail</label>
                            <input
                                type="email"
                                name="email"
                                onChange={e => refs.email.current = e.target.value}
                            />
                        </div>
                    </div>
                </div>

                {/* ENDEREÇO */}
                <div className="ag-section-block">
                    <h3>Endereço</h3>
                    <div className="ag-section-grid">
                        {["rua", "numero", "bairro", "cidade", "estado", "cep"].map(campo => (
                            <div key={campo} className="ag-grupo">
                                <label>{campo.charAt(0).toUpperCase() + campo.slice(1)}{campo === "cep" ? "*" : ""}</label>
                                {campo === "cep" ? (
                                    <InputMask
                                        name="cep"
                                        mask="99999-999"
                                        className={erros.cep ? "erro" : ""}
                                        onChange={e => refs.cep.current = e.target.value}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        name={campo}
                                        onChange={e => refs[campo].current = e.target.value}
                                    />
                                )}
                                {erros[campo] && <p className="msg-erro">{erros[campo]}</p>}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CONSULTA */}
                <div className="ag-section-block">
                    <h3>Consulta</h3>
                    <div className="ag-section-grid">
                        <div className="ag-grupo">
                            <label>Data da consulta*</label>
                            <input
                                type="date"
                                name="dataConsulta"
                                className={erros.dataConsulta ? "erro" : ""}
                                onChange={e => refs.dataConsulta.current = e.target.value}
                            />

                            {erros.dataConsulta && <p className="msg-erro">{erros.dataConsulta}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>Horário da consulta*</label>
                            <input
                                type="time"
                                name="horarioConsulta"
                                className={erros.horarioConsulta ? "erro" : ""}
                                onChange={e => refs.horarioConsulta.current = e.target.value}
                            />
                            {erros.horarioConsulta && <p className="msg-erro">{erros.horarioConsulta}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>Tipo de consulta*</label>
                            <input
                                type="text"
                                name="tipoConsulta"
                                className={erros.tipoConsulta ? "erro" : ""}
                                onChange={e => refs.tipoConsulta.current = e.target.value}
                            />
                            {erros.tipoConsulta && <p className="msg-erro">{erros.tipoConsulta}</p>}
                        </div>

                        <div className="ag-grupo">
                            <label>É a primeira consulta?*</label>
                            <select
                                name="primeiraVez"
                                className={erros.primeiraVez ? "erro" : ""}
                                onChange={e => refs.primeiraVez.current = e.target.value}
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
                                name="observacoes"
                                onChange={e => refs.observacoes.current = e.target.value}
                            ></textarea>
                        </div>
                    </div>
                </div>

                <button type="submit" className="ag-botao-agendar" disabled={loading}>
                    {loading ? "Salvando" : id ? "Salvar Alterações" : "Agendar Consulta"}
                </button>
            </form>
        </div>
    );
}
