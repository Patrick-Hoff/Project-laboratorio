import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./AtendimentoFinanceiro.css";
import axios from "axios"

import { formatarData, formatarParaBRL, createCurrencyChangeHandler } from '../../utils/formatters';

export default function AtendimentoFinanceiro() {

    const [modalAjusteAberto, setModalAjusteAberto] = useState(null)
    const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

    const [atendimento, setAtendimento] = useState()
    const [pagamentos, setPagamentos] = useState([])
    const [valorPago, setValorPago] = useState()

    const [novoValor, setNovoValor] = useState(0)
    const [valorTexto, setValorTexto] = useState("")
    const [formaPagamento, setFormaPagamento] = useState("")

    const { id } = useParams();

    const getFinanceiro = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/pagamentos/info_pagamentos/${id}`)
            setAtendimento(res.data.resultAtendimento)
            setPagamentos(res.data.result)
            setValorPago(res.data.valorPago)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getFinanceiro()
    }, [id])

    // Cria o handler para atualizar valor com máscara
    const handleChange = createCurrencyChangeHandler(setNovoValor, setValorTexto);

    // Função para abrir modal de ajuste e preencher campos
    const abrirModalAjuste = (pagamento) => {
        setModalAjusteAberto(pagamento)
        setNovoValor(Number(pagamento.valor_pago))
        setValorTexto(formatarParaBRL(Number(pagamento.valor_pago)))
        setFormaPagamento(pagamento.metodo_pagamento)
    }

    // Função para salvar ajustes
    const salvarAjuste = async () => {
        try {
            await axios.put(`http://localhost:8081/pagamentos/atualizar_pagamento/${modalAjusteAberto.id}`, {
                valor_pago: novoValor,
                metodo_pagamento: formaPagamento
            });
            getFinanceiro()
            setModalAjusteAberto(null);
        } catch (err) {
            console.log(err);
        }
    }

    const deletePagamento = async () => {
        try {
            await axios.delete(`http://localhost:8081/pagamentos/deletar_pagamento/${modalExcluirAberto}`)
            getFinanceiro()
            setModalExcluirAberto(false)
            console.log('Pagamento excluido com sucesso!')
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="financeiro-container">
            <header className="financeiro-header">
                <h2>Resumo Financeiro do Atendimento</h2>
            </header>

            <div className="financeiro-paciente-card">
                <p><strong>Paciente:</strong> {atendimento?.[0].paciente_nome}</p>
                <p><strong>Data de Nascimento:</strong> {atendimento?.[0].paciente_idade}</p>
                <p><strong>ID Atendimento:</strong> {atendimento?.[0].atendimento_id}</p>
            </div>

            <div className="financeiro-pagamentos-card">
                <h3>Pagamentos</h3>

                <table className="financeiro-tabela">
                    <thead>
                        <tr>
                            <th>Método</th>
                            <th>Valor</th>
                            <th>Data</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pagamentos?.map((item) => (
                            <tr key={item.id}>
                                <td>{item.metodo_pagamento}</td>
                                <td>{formatarParaBRL(item.valor_pago)}</td>
                                <td>{formatarData(item.data_pagamento)}</td>
                                <td>
                                    <button
                                        className="financeiro-btn-azul"
                                        onClick={() => abrirModalAjuste(item)}
                                    >
                                        Ajustar
                                    </button>

                                    <button
                                        className="financeiro-btn-vermelho"
                                        onClick={() => setModalExcluirAberto(item.id)}
                                    >
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="financeiro-total">
                    <strong>Total Pago:</strong> {formatarParaBRL(valorPago?.[0]?.valor_pago || 0)}
                </div>
            </div>

            {/* MODAL AJUSTE */}
            {modalAjusteAberto && (
                <div
                    className="financeiro-modal-overlay"
                    onClick={(e) => {
                        if (e.target.classList.contains("financeiro-modal-overlay")) {
                            setModalAjusteAberto(null);
                        }
                    }}
                >
                    <div className="financeiro-modal">
                        <h2 className="financeiro-modal-titulo">Ajustar Pagamento</h2>

                        <input
                            className="financeiro-input"
                            type="text"
                            placeholder="Novo valor"
                            value={valorTexto}
                            onChange={handleChange}
                        />

                        <select
                            className="financeiro-input"
                            onChange={(e) => setFormaPagamento(e.target.value)}
                            value={formaPagamento}
                        >
                            <option value="" disabled>Selecione</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Cartao">Cartão</option>
                            <option value="Pix">Pix</option>
                            <option value="Boleto">Boleto</option>
                        </select>

                        <div className="financeiro-modal-acoes">
                            <button className="financeiro-btn-azul" onClick={salvarAjuste}>Salvar</button>
                            <button
                                className="financeiro-btn-cinza"
                                onClick={() => setModalAjusteAberto(null)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EXCLUIR */}
            {modalExcluirAberto && (
                <div
                    className="financeiro-modal-overlay"
                    onClick={(e) => {
                        if (e.target.classList.contains("financeiro-modal-overlay")) {
                            setModalExcluirAberto(false);
                        }
                    }}
                >
                    <div className="financeiro-modal">
                        <h2 className="financeiro-modal-titulo">
                            Deseja excluir este pagamento?
                        </h2>

                        <div className="financeiro-modal-acoes">
                            <button
                                className="financeiro-btn-cinza"
                                onClick={() => setModalExcluirAberto(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="financeiro-btn-vermelho"
                                onClick={deletePagamento}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
