import React, { useState, useEffect } from "react";
import { formatarParaBRL, createCurrencyChangeHandler, formatCurrency } from '../../utils/formatters'
import axios from 'axios'
import "./ExameConvenio.css";

export default function ConsultaValoresPage() {

    const [exames, setExames] = useState([])
    const [convenios, setConvenios] = useState([])
    const [tabelaValores, setTabelaValores] = useState([])

    const [buscaExame, setBuscaExame] = useState("");
    const [buscaConvenio, setBuscaConvenio] = useState("");
    const [exameSelecionado, setExameSelecionado] = useState("");
    const [convenioSelecionado, setConvenioSelecionado] = useState("");

    const [debouncedCodConvenio, setDebouncedCodConvenio] = useState("")
    const [debouncedCodExame, setDebouncedCodExame] = useState("")

    const [editandoLinha, setEditandoLinha] = useState(null);
    const [valorEditado, setValorEditado] = useState()
    const [valorEditadoTexto, setValorEditadoTexto] = useState('R$ 0,00')

    const [valorAnterior, setValorAnterior] = useState();

    const [sucess, setSucess] = useState("")

    const convenio = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/convenio`, {
                params: {
                    cod: debouncedCodConvenio,
                    page: 1,
                    limit: 5
                }
            })
            setConvenios(res.data.data)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!debouncedCodConvenio || debouncedCodConvenio.length < 2) return
        convenio()
    }, [debouncedCodConvenio])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCodConvenio(buscaConvenio)
        }, 500)

        return () => clearTimeout(timer)
    }, [buscaConvenio])


    const getExames = async () => {
        try {

            const res = await axios.get(`http://localhost:8081/exames`, {
                params: {
                    page: 1,
                    limit: 5,
                    searchCod: buscaExame
                }
            })
            setExames(res.data.data)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!debouncedCodExame || debouncedCodExame.length < 2) return
        getExames()
    }, [debouncedCodExame])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedCodExame(buscaExame)
        }, 500)

        return () => clearTimeout(timer)
    }, [buscaExame])

    const valorExame = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/exame_convenios`, {
                params: {
                    cod: exameSelecionado.cod,
                    convenio: convenioSelecionado.cod,
                }
            })
            setTabelaValores(res.data)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!exameSelecionado) return
        valorExame()
    }, [exameSelecionado, convenioSelecionado])


    const handleUpdate = async (id) => {
        try {

            if (valorEditado === valorAnterior) {
                setEditandoLinha(null)
                return;
            }

            const valor = {
                valor: valorEditado
            }

            const res = await axios.put(`http://localhost:8081/exame_convenios/${id}`, valor)

            await valorExame()
            setSucess(res.data.mensagem)
            setEditandoLinha(null)

        } catch (err) {
            console.log(err)
        }
    }

    const createValue = async () => {
        try {

            if (!exameSelecionado || !convenioSelecionado) return;

            const values = {
                convenio_id: convenioSelecionado.id,
                exame_id: exameSelecionado.id,
                valor: valorEditado
            }

            const res = await axios.post('http://localhost:8081/exame_convenios', values)

            await valorExame()

            setSucess(res.data.mensagem)

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (!sucess) return;

        const timer = setTimeout(() => {
            setSucess("");
        }, 6000);

        return () => clearTimeout(timer);
    }, [sucess]);

    useEffect(() => {
        setValorEditado(0);
        setValorEditadoTexto('R$ 0,00');
        setValorAnterior(undefined);
        setEditandoLinha(null);
    }, [exameSelecionado, convenioSelecionado]);

    const [item] = tabelaValores;
    const handleChange = createCurrencyChangeHandler(setValorEditado, setValorEditadoTexto)

    return (
        <div className="page-container">
            <div className="card">
                <div>
                    <span className="sucess">
                        {sucess}
                    </span>
                </div>
                <h1>Consulta de Valores</h1>

                <div className="buscas">
                    <div className="campo-busca">
                        <label>Pesquisar Exame</label>
                        <input
                            type="text"
                            placeholder="Digite o código do exame..."
                            value={buscaExame}
                            onChange={(e) => {
                                setBuscaExame(e.target.value);
                                setExameSelecionado("");
                            }}
                        />

                        {buscaExame && !exameSelecionado && (
                            <div className="lista-sugestoes">
                                {exames.map((item) => (
                                    <div
                                        key={item.id}
                                        className="item-sugestao"
                                        onClick={() => {
                                            setExameSelecionado(item);
                                            setBuscaExame(item.cod);
                                            setExames([]);
                                        }}
                                    >
                                        <strong>{item.cod}</strong> - {item.nome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="campo-busca">
                        <label>Pesquisar Convênio</label>
                        <input
                            type="text"
                            placeholder="Digite o código do convênio..."
                            value={buscaConvenio}
                            onChange={(e) => {
                                setBuscaConvenio(e.target.value);
                                setConvenioSelecionado("");
                            }}
                        />
                        {buscaConvenio && !convenioSelecionado && (
                            <div className="lista-sugestoes">
                                {convenios.map((item) => (
                                    <div
                                        key={item.id}
                                        className="item-sugestao"
                                        onClick={() => {
                                            setConvenioSelecionado(item);
                                            setBuscaConvenio(item.cod);
                                            setConvenios([]);
                                        }}
                                    >
                                        <strong>{item.cod}</strong> - {item.nome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {item && tabelaValores.length === 1 && (
                    <div className="resultado">
                        {item.valor == null ? (
                            <p className="sem-valor">
                                ⚠️ Este exame está sem valor para este convênio.
                            </p>
                        ) : (
                            <div className="valor">
                                💰 Valor: <strong>{formatarParaBRL(item.valor)}</strong>
                            </div>
                        )}
                    </div>
                )}

                {exameSelecionado && (
                    <div className="lista-exame">
                        {tabelaValores.length > 0 ? (
                            tabelaValores.map((item) => (
                                <div key={item.convenio_cod} className="linha-valor">
                                    <span>{item.convenio}</span>

                                    {editandoLinha === item.convenio_cod ? (
                                        <div className="editar-valor">
                                            <input
                                                type="text"
                                                value={valorEditadoTexto}
                                                onChange={
                                                    handleChange
                                                }
                                            />
                                            <button
                                                onClick={() =>
                                                    handleUpdate(item.id)
                                                }
                                            >
                                                Salvar
                                            </button>
                                            <button
                                                className="cancelar-btn"
                                                onClick={() => setEditandoLinha(null)}
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="acoes-linha">
                                            <strong>{formatarParaBRL(item.valor)}</strong>
                                            <button
                                                className="edit-valor-btn"
                                                onClick={() => {
                                                    setEditandoLinha(item.convenio_cod);

                                                    const numero = Number(item.valor || 0);

                                                    setValorEditado(numero);
                                                    setValorAnterior(numero);

                                                    const { texto } = formatCurrency(String(numero * 100))
                                                    setValorEditadoTexto(texto)
                                                }}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div>
                                <p className="sem-valor">
                                    Não possui valor cadastrado.
                                </p>
                                <div>
                                    <input
                                        type="text"
                                        className="input_cadastrar_valor"
                                        value={valorEditadoTexto}
                                        onChange={
                                            handleChange
                                        }
                                    />
                                    <button
                                        type="submit"
                                        className="cadastrar_valor"
                                        onClick={createValue}
                                    >
                                        Cadastrar valor
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}