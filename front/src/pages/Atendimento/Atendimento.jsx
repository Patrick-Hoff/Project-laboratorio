import { useEffect, useState, useContext, useRef } from 'react';
import { UserContext } from '../../routes/UserContext'

import GenericModal from "../../components/Modal/Modal";
import { Button } from "react-bootstrap";

import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import { FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { FaDeleteLeft, FaFileInvoiceDollar } from "react-icons/fa6";

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import { useDebounce } from 'use-debounce';

import { formatarParaBRL, createCurrencyChangeHandler, formatarDataBR } from '../../utils/formatters';


function Atendimento() {

    // =========================
    // ESTADOS DE ERRO
    // =========================
    const [errorPayment, setErrorPayment] = useState('');

    // =========================
    // CONTROLE DE UI
    // =========================
    const [modalShow, setModalShow] = useState(false);

    // =========================
    // VALORES / PAGAMENTO
    // =========================
    const [displayValor, setDisplayValor] = useState('R$ 0,00');
    const [valorTotal, setValorTotal] = useState(0);
    const [quantoPagar, setQuantoPagar] = useState(0);
    const [totalPago, setTotalPago] = useState(0);
    const [formaPagamento, setFormaPagamento] = useState('');

    const quantoFaltaPagar = valorTotal - totalPago;

    // =========================
    // PACIENTE
    // =========================
    const [pacienteOriginal, setPacienteOriginal] = useState(null);
    const [paciente, setPaciente] = useState({
        id: '',
        nome: '',
        idade: '',
        nascimento: ''
    });
    const [pacientes, setPacientes] = useState([]);
    const [searchPaciente, setSearchPaciente] = useState({
        id: '',
        nome: ''
    });

    // =========================
    // MÉDICO
    // =========================
    const [medicoBusca, setMedicoBusca] = useState({
        id: '',
        crm: '',
        medico: ''
    });
    const [medicoOriginal, setMedicoOriginal] = useState(null);

    const [sugestoesMedicos, setSugestoesMedicos] = useState([]);
    const [mostrarSugestoesMedicos, setMostrarSugestoesMedicos] = useState(false);
    const [digitandoMedico, setDigitandoMedico] = useState(false);

    // =========================
    // CONVÊNIO
    // =========================
    const [convenioBusca, setConvenioBusca] = useState({
        id: '',
        cod: '',
        convenio: ''
    });
    const [convenioOriginal, setConvenioOriginal] = useState(null);

    const [sugestoesConvenios, setSugestoesConvenios] = useState([]);
    const [mostrarSugestoesConvenios, setMostrarSugestoesConvenios] = useState(false);
    const [digitandoConvenio, setDigitandoConvenio] = useState(false);

    // =========================
    // EXAMES
    // =========================
    const [exameBusca, setExameBusca] = useState({
        cod: '',
        nome: ''
    });
    const [exameAdicionado, setExameAdicionado] = useState([]);

    const [sugestoesExames, setSugestoesExames] = useState([]);
    const [mostrarSugestoesExames, setMostrarSugestoesExames] = useState(false);

    // =========================
    // DEBOUNCE (BUSCAS)
    // =========================
    const [debouncedBusca] = useDebounce(exameBusca, 600);
    const [debouncedBuscaPaciente] = useDebounce(searchPaciente, 600);

    // =========================
    // CONTEXTO / ROTAS
    // =========================
    const { userData } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    // =========================
    // REFS (DOM)
    // =========================
    const convenioRef = useRef(null);
    const medicoRef = useRef(null);

    // =========================
    // OUTROS
    // =========================
    const [atendimentoId, setAtendimentoId] = useState();


    const carregarPacientes = async () => {
        try {
            const res = await axios.get('http://localhost:8081/pacientes', {
                params: {
                    page: 1,
                    limit: 10,
                    searchId: debouncedBuscaPaciente.id,
                    searchNome: debouncedBuscaPaciente.nome,
                }
            });
            setPacientes(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const carregarExamesPaciente = async () => {
        try {
            if (!id) return;

            const res = await axios.get(`http://localhost:8081/exames_atendimento?atendimento_id=${id}`);

            const pacienteData = res.data.paciente;
            const medico = res.data.medico
            const examesData = res.data.exames || [];
            const atendimentoData = res.data.atendimento;
            const convenioData = res.data.convenio

            if (pacienteData) {
                setPacienteOriginal({
                    id: pacienteData.id,
                    nome: pacienteData.nome,
                    idade: calcularIdade(pacienteData.idade),
                    nascimento: pacienteData.idade
                });

                setPaciente({
                    id: pacienteData.id,
                    nome: pacienteData.nome,
                    idade: calcularIdade(pacienteData.idade),
                    nascimento: pacienteData.idade
                });

                setAtendimentoId(atendimentoData.id);
            } else {
                setPaciente({ id: '', nome: '', idade: '', nascimento: '' });
                setAtendimentoId(undefined);
            }

            setMedicoBusca({ id: medico.id, crm: medico.crm, medico: medico.medico })
            setMedicoOriginal({ id: medico.id, crm: medico.crm, medico: medico.medico })
            setExameAdicionado(examesData);
            setValorTotal(atendimentoData?.valor_total ?? 0);
            setConvenioBusca(convenioData)
            setConvenioOriginal(convenioData)

        } catch (err) {
            console.error(err);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!id) {
                const res = await axios.post('http://localhost:8081/atendimentos/add', {
                    paciente_id: paciente.id,
                    user: userData,
                    medico_id: medicoBusca.id,
                    convenio_id: convenioBusca.id
                });

                setAtendimentoId(res.data.insertId);

                const novoId = res.data.insertId;

                toast.success('Atendimento salvo com sucesso!');

                navigate(`/atendimento/${novoId}`, { replace: true });

            } else {
                const edit = {
                    paciente_id: paciente.id,
                    user: userData,
                    medico_id: medicoBusca.id,
                    convenio_id: convenioBusca.id
                }

                const res = await axios.put(`http://localhost:8081/atendimentos/${id}/edit`, edit)
                toast.success('Atendimento Atualizado com sucesso!')
                carregarExamesPaciente()
            }

        } catch (err) {
            toast.error('Erro ao salvar atendimento!');
            console.log(err)
        }
    };

    const handleSelecionarPaciente = (p) => {
        console.log(p)
        setPaciente({
            id: p.id,
            nome: p.nome,
            idade: calcularIdade(p.idade),
            nascimento: p.idade,
        });
        setModalShow(false);
    };

    const calcularIdade = (data) => {
        const hoje = new Date();

        const dataStr = formatarDataBR(data)

        // Converter "dd/mm/yyyy" para Date
        const [dia, mes, ano] = dataStr.split('/');
        const nascimento = new Date(ano, mes - 1, dia);

        let anos = hoje.getFullYear() - nascimento.getFullYear();
        let meses = hoje.getMonth() - nascimento.getMonth();
        let dias = hoje.getDate() - nascimento.getDate();

        // Ajustar dias negativos
        if (dias < 0) {
            meses--;
            const ultimoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
            dias += ultimoMes.getDate();
        }

        // Ajustar meses negativos
        if (meses < 0) {
            anos--;
            meses += 12;
        }

        return {
            anos,
            meses,
            dias
        };
    };


    const getExame = async () => {
        try {
            const cod = debouncedBusca.cod.trim();
            const nome = debouncedBusca.nome.trim();

            if (!cod && !nome) {
                setMostrarSugestoesExames(false);
                return;
            }

            const res = await axios.get('http://localhost:8081/exames', {
                params: {
                    searchCod: cod,
                    searchNome: nome,
                    limit: 5
                }
            });

            if (res.data.total < 1) {
                console.log('Nenhum exame encontrado!');
                setMostrarSugestoesExames(false);
                return;
            }

            setMostrarSugestoesExames(true);
            setSugestoesExames(res.data.data);

        } catch (err) {
            console.log(err);
        }
    };


    useEffect(() => {
        carregarExamesPaciente();
    }, [id]);

    useEffect(() => {
        getExame();
    }, [debouncedBusca]);

    const addExames = async (item) => {
        try {

            const data = {
                atendimento_id: id,
                exames_id: item.id,
                resultado: "Pendente"
            }

            await axios.post('http://localhost:8081/exames_atendimento/add', data)

            toast.success("Exame adicionado com sucesso!")
            await carregarExamesPaciente()

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {

        const fetchSugestoesMedicos = async () => {

            if (!digitandoMedico) return;

            if (!medicoBusca.crm && !medicoBusca.medico) {
                setSugestoesMedicos([])
                setMostrarSugestoesMedicos(false)
                return;
            }

            const params = new URLSearchParams({
                nome: medicoBusca.medico,
                crm: medicoBusca.crm,
                page: 1,
                limit: 5
            })

            try {
                const res = await axios.get(`http://localhost:8081/medicos?${params}`)

                if (
                    res.data.data.length === 1 &&
                    res.data.data[0].crm === medicoBusca.crm &&
                    res.data.data[0].nome === medicoBusca.medico
                ) {
                    setMostrarSugestoesMedicos(false)
                    return
                }

                setSugestoesMedicos(res.data.data)
                setMostrarSugestoesMedicos(true)

            } catch (err) {
                console.log(err)
            }
        }

        const timeout = setTimeout(fetchSugestoesMedicos, 600)
        return () => clearTimeout(timeout)

    }, [medicoBusca.crm, medicoBusca.medico, digitandoMedico])


    const getConvenio = async () => {

        if (!digitandoConvenio) return;

        if (!convenioBusca.cod && !convenioBusca.convenio) {
            setSugestoesConvenios([])
            setMostrarSugestoesConvenios(false)
            return;
        }
        try {

            const res = await axios.get(`http://localhost:8081/convenio`, {
                params: {
                    cod: convenioBusca.cod,
                    nome: convenioBusca.convenio,
                    limit: 5
                }
            })


            if (
                res.data.data.length === 1 &&
                res.data.data[0].cod === convenioBusca.cod &&
                res.data.data[0].convenio === convenioBusca.convenio
            ) {
                setMostrarSugestoesConvenios(false)
                return
            }

            setSugestoesConvenios(res.data.data)
            setMostrarSugestoesConvenios(true)


        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const timeout = setTimeout(getConvenio, 600)
        return () => clearTimeout(timeout)
    }, [convenioBusca.cod, convenioBusca.convenio])


    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                medicoRef.current &&
                !medicoRef.current.contains(event.target)
            ) {
                setMostrarSugestoesMedicos(false);
            }

            if (
                convenioRef.current &&
                !convenioRef.current.contains(event.target)
            ) {
                setMostrarSugestoesConvenios(false);
            }

        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };

    }, []);


    function handleDelete(id_primary) {
        axios.delete(`http://localhost:8081/exames_atendimento/${id_primary}/atendimento/${id}`)
            .then(() => {
                toast.success('Exame deletado com sucesso!')
                carregarExamesPaciente()
            }).catch((error) => {
                toast.error('Não foi possivel excluir o exame!')
                console.log(error)
            })
    }

    function handleDeleteAtendimento(id_att) {
        axios.delete(`http://localhost:8081/atendimentos/${id_att}/remove`)
            .then(() => {
                navigate('/')
            }).catch((error) => {
                if (error.response.status == 500) {
                    toast.info('Não é possivel deletar atendimento que contenha exames cadastrados.')
                }
            })
    }


    useEffect(() => {
        if (modalShow) carregarPacientes();
    }, [modalShow, debouncedBuscaPaciente]);



    // Pagamento
    const handlePayment = async () => {
        try {
            const values = {
                metodo: formaPagamento,
                valor: quantoPagar
            };

            setErrorPayment('')
            const res = await axios.post(
                `http://localhost:8081/pagamentos/realizar_pagamento/atendimentoid/${id}`,
                values
            );
            getPayment();
            setFormaPagamento("");
            setQuantoPagar("");
            setDisplayValor("R$ 0,00")
            toast.success('Pagamento realizado com sucesso!')

        } catch (err) {
            setErrorPayment(err.response.data.erro)
        }
    };

    const getPayment = async () => {
        await axios.get(`http://localhost:8081/pagamentos/info_pagamentos/${id}`)
            .then((res) => {
                setTotalPago(res.data.valorPago[0].valor_pago || '0.00');
            }).catch((err) => {
                console.log(err)
            })
    }


    useEffect(() => {
        getPayment()
    }, [])


    // Função exportada para realizar o pagamento do atendimento
    const handleChange = createCurrencyChangeHandler(setQuantoPagar, setDisplayValor);


    return (
        <div className="container container-atendimento">

            <div className='lado-esquerdo'>

                <div className='title-btn'>
                    <h1 className="titulo">

                        {atendimentoId ? 'Atendimento' : 'Cadastro de Atendimento'}

                    </h1>

                    <button disabled={!id} className='remove' onClick={() => handleDeleteAtendimento(id)}>Apagar atendimento</button>
                </div>

                <form className="form-atendimento" onSubmit={handleSubmit}>
                    <div className="linha-nome-id">
                        <input
                            type="text"
                            name="id"
                            placeholder="ID do Atendimento"
                            className="input-id"
                            readOnly
                            value={atendimentoId || ''}
                        />
                        <input
                            type="text"
                            name="nomePaciente"
                            placeholder="Nome do Paciente"
                            className="input-nome"
                            value={paciente.nome}
                            readOnly
                        />
                        <FaSearch className="search" onClick={() => setModalShow(true)} />
                    </div>
                    <div className="linha-idade-data">
                        <div className='container-data'>
                            <label>Data Nasc</label>
                            <input
                                type="text"
                                className="input-padrao input-data"
                                value={formatarDataBR(paciente.nascimento)}
                                readOnly
                            />
                        </div>

                        <div className='container-idade'>
                            <div>
                                <label>Anos</label>
                                <input
                                    type="number"
                                    className="input-padrao input-idade"
                                    value={paciente.idade.anos}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label>Meses</label>
                                <input
                                    type="number"
                                    className="input-padrao input-idade"
                                    value={paciente.idade.meses}
                                    readOnly
                                />
                            </div>

                            <div>
                                <label>Dias</label>
                                <input
                                    type="number"
                                    className="input-padrao input-idade"
                                    value={paciente.idade.dias}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div ref={medicoRef} className='linha-medico-button'>
                        <div className='container-input container-autocomplete'>
                            <label
                                htmlFor="medico"
                                className='label-medico'
                            >Médico</label>
                            <input
                                type="text"
                                className='input-medico input-crm'
                                placeholder='CRM'
                                value={medicoBusca.crm}
                                onFocus={() => setDigitandoMedico(true)}
                                onChange={(e) => setMedicoBusca({ ...medicoBusca, crm: e.target.value })}
                                style={{ width: '130px' }}
                            />
                            <input
                                type="text"
                                className='input-medico'
                                placeholder='Nome'
                                value={medicoBusca.medico}
                                onChange={(e) => setMedicoBusca({ ...medicoBusca, medico: e.target.value })}
                                style={{ width: '190px' }}
                            />

                            {mostrarSugestoesMedicos && sugestoesMedicos.length > 0 && (
                                <div className="dropdown-sugestoes">
                                    {sugestoesMedicos.map((med) => (
                                        <div
                                            key={med.id}
                                            className="item-sugestao"
                                            onClick={() => {
                                                setSugestoesMedicos([]);
                                                setMedicoBusca({ id: med.id, crm: med.crm, medico: med.nome })
                                                setMostrarSugestoesMedicos(false)
                                                setDigitandoMedico(false)
                                            }}
                                        >
                                            {med.crm} - {med.nome}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                        <div ref={convenioRef} className='container-input container-autocomplete'>
                            <label htmlFor="convenio">Convênio</label>
                            <input
                                type="text"
                                placeholder='Cód'
                                value={convenioBusca.cod}
                                style={{ width: '130px' }}
                                onChange={(e) => setConvenioBusca({ ...convenioBusca, cod: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder='Convênio'
                                value={convenioBusca.convenio}
                                style={{ width: '190px' }}
                                onFocus={() => setDigitandoConvenio(true)}
                                onChange={(e) => setConvenioBusca({ ...convenioBusca, convenio: e.target.value })}
                            />

                            {mostrarSugestoesConvenios && sugestoesConvenios.length > 0 && (
                                <div className="dropdown-sugestoes">
                                    {sugestoesConvenios.map((conv) => (
                                        <div
                                            key={conv.id}
                                            className="item-sugestao"
                                            onClick={() => {
                                                setSugestoesConvenios([])
                                                setConvenioBusca({ id: conv.id, cod: conv.cod, convenio: conv.nome })
                                                setMostrarSugestoesConvenios(false)
                                                setDigitandoConvenio(false)
                                            }}
                                        >
                                            {conv.cod} - {conv.nome}
                                        </div>
                                    ))}
                                </div>
                            )
                            }

                        </div>
                        <div>
                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={
                                    (!atendimentoId && !paciente.id) ||
                                    (atendimentoId &&
                                        JSON.stringify(paciente) === JSON.stringify(pacienteOriginal) &&
                                        JSON.stringify(medicoBusca) === JSON.stringify(medicoOriginal) &&
                                        JSON.stringify(convenioBusca) === JSON.stringify(convenioOriginal)
                                    )
                                }
                            >
                                {atendimentoId ? 'Atualizar atendimento' : 'Criar atendimento'}
                            </button>
                        </div>
                    </div>
                </form>


                <div className="container-headbar">
                    <h2 className="subtitulo">Adicionar Exame</h2>
                    <div className="listbar">
                        <Link to={`/financeiro/${id}`}>
                            <FaFileInvoiceDollar id="icon-dolar" />
                        </Link>
                    </div>
                </div>
                <form className="filtro-exames">
                    <div className='container-input container-autocomplete' style={{ width: '100%' }}>

                        <input
                            type="text"
                            disabled={!id}
                            placeholder="Código do exame"
                            value={exameBusca.cod}
                            onChange={(e) => setExameBusca(prev => ({
                                ...prev,
                                cod: e.target.value
                            }))}
                            className="input-filtro-codigo"
                        />
                        <input
                            type="text"
                            disabled={!id}
                            placeholder="Nome do exame"
                            value={exameBusca.nome}
                            onChange={(e) => setExameBusca(prev => ({
                                ...prev,
                                nome: e.target.value
                            }))}
                            className="input-filtro-nome"
                        />
                        {mostrarSugestoesExames && sugestoesExames.length > 0 && (
                            <div className="dropdown-sugestoes">
                                {sugestoesExames.map((sugestao) => (
                                    <div
                                        key={sugestao.id}
                                        className="item-sugestao"
                                        onClick={() => {
                                            setExameBusca({ cod: sugestao.cod, nome: sugestao.nome });
                                            addExames(sugestao);
                                            setMostrarSugestoesExames(false);
                                            setExameBusca({ cod: '', nome: '' })
                                            setSugestoesExames([])
                                        }}
                                    >
                                        {sugestao.cod} - {sugestao.nome}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </form>

                <div>
                    <table className="tabela-exames">
                        <thead>
                            <tr>
                                <th>Código</th>
                                <th>Nome do Exame</th>
                                <th>Valor</th>
                                <th>Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exameAdicionado.map((exame) => (
                                <tr key={exame.id_primary}>
                                    <td>{exame.cod_exame}</td>
                                    <td>{exame.nome_exame}</td>
                                    <td>{formatarParaBRL(exame.valor)}</td>
                                    <td className='icon iconRemove'>
                                        <span>
                                            <FaDeleteLeft onClick={() => handleDelete(exame.id_primary)} />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="pagamento-container">
                <h2>Pagamento</h2>

                <div className="form-group">
                    <label htmlFor="valorTotal">Valor Total</label>
                    <input
                        type="text"
                        id="valorTotal"
                        value={formatarParaBRL(valorTotal)}
                        readOnly
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='A pagar'>Valor pago</label>
                    <input
                        type="text"
                        id="A pagar"
                        value={formatarParaBRL(totalPago)}
                        readOnly
                    />
                </div>

                {/* Valor a Pagar Até o Momento */}
                <div className="form-group">
                    <label htmlFor="valorPago">Valor a Pagar Até o Momento</label>
                    <input
                        type="text"
                        id="valorPago"
                        value={formatarParaBRL(quantoFaltaPagar)}
                        readOnly
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="quantoPagar">Quanto Irá Pagar</label>
                    <input
                        type="text"
                        id="quantoPagar"
                        placeholder="Digite o valor a pagar"
                        value={displayValor}
                        onChange={handleChange}
                    />
                    <span id="error">{errorPayment}</span>
                </div>

                {/* Forma de Pagamento */}
                <div className="form-group">
                    <label htmlFor="formaPagamento">Forma de Pagamento</label>
                    <select
                        id="formaPagamento"
                        onChange={(e) => setFormaPagamento(e.target.value)}
                        value={formaPagamento}
                    >
                        <option value="" disabled>Selecione</option>
                        <option value="dinheiro">Dinheiro</option>
                        <option value="cartao">Cartão</option>
                        <option value="pix">Pix</option>
                        <option value="boleto">Boleto</option>
                    </select>
                </div>
                <div className="botao-baixa">
                    <button
                        className="btn-baixa"
                        disabled={!formaPagamento || exameAdicionado.length === 0 || quantoPagar <= 0}
                        onClick={() => handlePayment()}
                    >
                        Dar Baixa no Pagamento
                    </button>
                </div>
            </div>


            <GenericModal
                show={modalShow}
                onClose={() => setModalShow(false)}
                title="Selecionar Paciente"
            >
                <div className="mb-3 d-flex gap-3">
                    <input
                        type="text"
                        placeholder="ID"
                        className="form-control"
                        onChange={(e) => setSearchPaciente(prev => ({
                            ...prev,
                            id: e.target.value
                        }))}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por Nome"
                        className="form-control"
                        onChange={(e) => setSearchPaciente(prev => ({
                            ...prev,
                            nome: e.target.value
                        }))}
                    />
                </div>

                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Data Nasc.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nome}</td>
                                <td>{formatarDataBR(p.idade)}</td>
                                <td>
                                    <Button
                                        variant="success"
                                        onClick={() => handleSelecionarPaciente(p)}
                                    >
                                        Selecionar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </GenericModal>

            <ToastContainer
                autoClose={3000}
                hideProgressBar={true}
                closeOnClick={true}
                pauseOnHover={true}
                draggable={true}
                limit={3}
            />
        </div>
    );
}

export default Atendimento;