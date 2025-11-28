import './style.css'

import React, { useState } from "react";

export default function AgendamentoConsulta() {
    const [formData, setFormData] = useState({
        nome: "",
        sexo: "",
        cpf: "",
        rg: "",
        nascimento: "",
        telefone: "",
        email: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
        dataConsulta: "",
        horarioConsulta: "",
        tipoConsulta: "",
        observacoes: "",
        primeiraVez: ""
    });

    const [mensagemSucesso, setMensagemSucesso] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validar = () => {
        const obrigatorios = [
            "nome", "sexo", "cpf", "rg", "nascimento", "telefone",
            "email", "rua", "numero", "bairro", "cidade", "estado", "cep",
            "dataConsulta", "horarioConsulta", "tipoConsulta", "primeiraVez"
        ];
        for (let campo of obrigatorios) {
            if (!formData[campo]) return false;
        }
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validar()) {
            alert("Preencha todos os campos obrigatórios.");
            return;
        }
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
                            <input type="text" name="nome" value={formData.nome} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Sexo*</label>
                            <select name="sexo" value={formData.sexo} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                            </select>
                        </div>

                        <div className="ag-grupo">
                            <label>CPF*</label>
                            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>RG*</label>
                            <input type="text" name="rg" value={formData.rg} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Data de nascimento*</label>
                            <input type="date" name="nascimento" value={formData.nascimento} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Telefone*</label>
                            <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>E-mail*</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </div>

                    </div>
                </div>

                <div className="ag-section-block">
                    <h3>Endereço</h3>
                    <div className="ag-section-grid">

                        <div className="ag-grupo">
                            <label>Rua*</label>
                            <input type="text" name="rua" value={formData.rua} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Número*</label>
                            <input type="text" name="numero" value={formData.numero} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Bairro*</label>
                            <input type="text" name="bairro" value={formData.bairro} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Cidade*</label>
                            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Estado*</label>
                            <input type="text" name="estado" value={formData.estado} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>CEP*</label>
                            <input type="text" name="cep" value={formData.cep} onChange={handleChange} />
                        </div>

                    </div>
                </div>

                <div className="ag-section-block">
                    <h3>Consulta</h3>
                    <div className="ag-section-grid">

                        <div className="ag-grupo">
                            <label>Data da consulta*</label>
                            <input type="date" name="dataConsulta" value={formData.dataConsulta} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Horário da consulta*</label>
                            <input type="time" name="horarioConsulta" value={formData.horarioConsulta} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>Tipo de consulta*</label>
                            <input type="text" name="tipoConsulta" value={formData.tipoConsulta} onChange={handleChange} />
                        </div>

                        <div className="ag-grupo">
                            <label>É a primeira consulta?*</label>
                            <select name="primeiraVez" value={formData.primeiraVez} onChange={handleChange}>
                                <option value="">Selecione</option>
                                <option value="sim">Sim</option>
                                <option value="retorno">Retorno</option>
                            </select>
                        </div>

                        <div className="ag-grupo" style={{ gridColumn: "span 2" }}>
                            <label>Observações adicionais</label>
                            <textarea
                                name="observacoes"
                                value={formData.observacoes}
                                onChange={handleChange}
                            />
                        </div>

                    </div>
                </div>

                <button type="submit" className="ag-botao-agendar">Agendar Consulta</button>
            </form>

            {mensagemSucesso && <p className="ag-mensagem-sucesso">{mensagemSucesso}</p>}
        </div>
    );
}
