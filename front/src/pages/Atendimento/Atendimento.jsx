import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

import { formatarParaBRL, createCurrencyChangeHandler } from '../../utils/formatters';


function Atendimento() {
    const [errorPayment, setErrorPayment] = useState('')

    const [displayValor, setDisplayValor] = useState('' || 'R$ 0,00')

    const [pacienteOriginal, setPacienteOriginal] = useState(null)
    const [paciente, setPaciente] = useState({ id: '', nome: '', idade: '', nascimento: '' });
    const [pacientes, setPacientes] = useState([]);
    const [modalShow, setModalShow] = useState(false);
    const [atendimentoId, setAtendimentoId] = useState();
    const [exameBusca, setExameBusca] = useState({ cod: '', nome: '' });
    const [exameAdicionado, setExameAdicionado] = useState([])

    const [formaPagamento, setFormaPagamento] = useState('');
    const [valorTotal, setValorTotal] = useState(0);
    const [quantoPagar, setQuantoPagar] = useState(0)
    const [totalPago, setTotalPago] = useState(0)
    const quantoFaltaPagar = valorTotal - totalPago;


    const [searchId, setSearchId] = useState('')
    const [searchNome, setSearchNome] = useState('')

    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)

    const [sugestoes, setSugestoes] = useState([])
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false)



    const { id } = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        const infoAtendimento = async (p) => {
            try {
                const res = await axios.get(`http://localhost:8081/atendimentos/${id}/exames`);
                // Checagem extra se data[0] existe
                if (res.data && res.data.length > 0) {
                    const dados = res.data[0];

                    setPacienteOriginal({
                        id: id,
                        nome: dados.nome_paciente,
                        idade: calcularIdade(dados.idade),
                        nascimento: dados.idade || '',
                    });

                    setPaciente({
                        id: id,
                        nome: dados.nome_paciente,
                        idade: calcularIdade(dados.idade),
                        nascimento: dados.idade || '',
                    });
                    setAtendimentoId(id);
                } else {
                    setPaciente({ id: '', nome: '', idade: '', nascimento: '' });
                    setAtendimentoId(undefined);
                }
            } catch (err) {
                console.error(err);
            }
        };

        if (id) {
            infoAtendimento();
        } else {
            // Resetar tudo ao criar novo atendimento
            setPaciente({ id: '', nome: '', idade: '', nascimento: '' });
            setAtendimentoId(undefined);
            setExameAdicionado([]);
        }
    }, [id]);


    const carregarPacientes = async () => {
        try {
            const res = await axios.get('http://localhost:8081/pacientes', {
                params: {
                    page,
                    limit: 5,
                    searchId,
                    searchNome,
                }
            });
            setPacientes(res.data.data);
            setTotal(res.data.total)
        } catch (err) {
            console.error(err);
        }
    };

    const carregarExamesPaciente = async () => {
        try {

            const res = await axios.get(`http://localhost:8081/exames_atendimento/${id}`)
            const valorAtendimento = res.data.data;
            setExameAdicionado(res.data.data)

            if (valorAtendimento.length > 0) {
                setValorTotal(parseFloat(valorAtendimento[0].valor_total));
            } else {
                setValorTotal(0);
            }
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        carregarExamesPaciente()
    }, [id])

    function nextPage() {
        setPage(prev => prev + 1)
    }

    function prevPage() {
        if (page > 1) setPage(prev => prev - 1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!id) {
                const res = await axios.post('http://localhost:8081/atendimentos/add', {
                    paciente_id: paciente.id,
                });

                setAtendimentoId(res.data.insertId);

                const novoId = res.data.insertId;

                toast.success('Atendimento salvo com sucesso!');

                navigate(`/atendimento/${novoId}`, { replace: true });

            } else {
                const edit = {
                    paciente_id: paciente.id
                }

                const res = await axios.put(`http://localhost:8081/atendimentos/${id}/edit`, edit)
                toast.success('Atendimento Atualizado com sucesso!')
            }

        } catch (err) {
            toast.error('Erro ao salvar atendimento!');
            console.log(err)
        }
    };

    const handleSelecionarPaciente = (p) => {
        setPaciente({
            id: p.id,
            nome: p.nome,
            idade: calcularIdade(p.idade),
            nascimento: p.idade,
        });
        setModalShow(false);
    };

    const calcularIdade = (nascimento) => {
        const hoje = new Date();
        const nasc = new Date(nascimento);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        const m = hoje.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
            idade--;
        }
        return idade;
    };


    async function addExames(exameSelecionado) {
        try {
            const res = await axios.get('http://localhost:8081/exames');
            const exames = res.data.data;

            // Busca o exame dentro da resposta da API (com base no cod ou nome)
            const exameEncontrado = exames.find(e =>
                e.cod === exameSelecionado.cod || e.nome === exameSelecionado.nome
            );

            if (exameEncontrado) {
                const jaAdicionado = exameAdicionado.some(e =>
                    e.cod === exameEncontrado.cod || e.nome === exameEncontrado.nome
                );

                if (!jaAdicionado) {
                    setExameAdicionado(prev => [...prev, exameEncontrado]);

                    const postExames = {
                        atendimento_id: id,
                        exames_id: exameEncontrado.id,
                        resultado: 'pendente',
                    };

                    await axios.post('http://localhost:8081/exames_atendimento/add', postExames);
                    setExameBusca({ cod: '', nome: '' });
                    carregarExamesPaciente();
                } else {
                    toast.info('Exame já foi adicionado.');
                }
            } else {
                toast.error('Exame não existente.');
            }
        } catch (err) {
            console.error('Erro ao buscar ou adicionar exame:', err);
        }
    }


    useEffect(() => {

        const fetchSugestoes = async () => {
            if (!exameBusca.cod && !exameBusca.nome) {
                setSugestoes([])
                return;
            }

            try {
                const res = await axios.get('http://localhost:8081/exames', {
                    params: {
                        searchCod: exameBusca.cod || '',
                        searchNome: exameBusca.nome || '',
                        limit: 4,
                        page: 1,
                    }
                });
                setSugestoes(res.data.data)
                setMostrarSugestoes(true)
            } catch (err) {
                console.log(err)
            }
        }

        const timeout = setTimeout(() => fetchSugestoes(), 10)
        return () => clearTimeout(timeout)

    }, [exameBusca.cod, exameBusca.nome])

    useEffect(() => {
        const handleClickOutside = () => {
            setMostrarSugestoes(false)
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside)
        };
    }, [])


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
        setPage(1)
    }, [searchId, searchNome])

    useEffect(() => {
        if (modalShow) carregarPacientes();
    }, [modalShow, page, searchId, searchNome]);



    // Pagamento
    const handlePayment = async () => {
        try {
            const values = {
                metodo: formaPagamento,
                valor: quantoPagar
            };

            if (quantoPagar > quantoFaltaPagar) {
                // Caso o valor pago seja maior que o devido, não realiza o pagamento
                setErrorPayment('Valor incorreto.')
            } else {
                setErrorPayment('')
                // Se o valor pago for válido, realiza o pagamento
                const res = await axios.post(
                    `http://localhost:8081/pagamentos/realizar_pagamento/atendimentoid/${id}`,
                    values
                );
                getPayment(); // Atualiza os pagamentos
                setFormaPagamento("");
                setQuantoPagar("");
                setDisplayValor("R$ 0,00")
                toast.success('Pagamento realizado com sucesso!')
            }

        } catch (err) {
            console.log('Erro ao realizar pagamento:', err); console.log(quantoPagar)
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


    // Função exportada para realizar o pagamento do atendimento corretamente
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
                        <input
                            type="number"
                            name="idade"
                            placeholder="Idade"
                            className="input-idade"
                            value={paciente.idade}
                            readOnly
                        />
                        <input
                            type="date"
                            name="nascimento"
                            placeholder="Data de Nascimento"
                            className="input-data"
                            value={paciente.nascimento}
                            readOnly
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={
                            (!atendimentoId && !paciente.id) ||
                            (atendimentoId && JSON.stringify(paciente) === JSON.stringify(pacienteOriginal))
                        }
                    >
                        {atendimentoId ? 'Atualizar atendimento' : 'Criar atendimento'}
                    </button>

                </form>




                <h2 className="subtitulo">Adicionar Exame</h2>
                <form className="filtro-exames">
                    <input
                        type="text"
                        disabled={!id}
                        placeholder="Código do exame"
                        value={exameBusca.cod}
                        onChange={(e) => setExameBusca({ ...exameBusca, cod: e.target.value })}
                        className="input-filtro-codigo"
                    />
                    <input
                        type="text"
                        disabled={!id}
                        placeholder="Nome do exame"
                        value={exameBusca.nome}
                        onChange={(e) => setExameBusca({ ...exameBusca, nome: e.target.value })}
                        className="input-filtro-nome"
                    />

                    <Button
                        variant="secondary"
                        onClick={() => addExames(exameBusca)}
                        disabled={!id}
                    >
                        Adicionar
                    </Button>

                </form>
                <>
                    {mostrarSugestoes && sugestoes.length > 0 && (
                        <div className="dropdown-sugestoes">
                            {sugestoes.map((sugestao) => (
                                <div
                                    key={sugestao.id}
                                    className="item-sugestao"
                                    onClick={() => {
                                        setExameBusca({ cod: sugestao.cod, nome: sugestao.nome });
                                        addExames(sugestao);
                                        setMostrarSugestoes(false);
                                    }}
                                >
                                    {sugestao.cod} - {sugestao.nome}
                                </div>
                            ))}
                        </div>
                    )}
                </>

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

                {/* Valor Total */}
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


            <Modal show={modalShow} onHide={() => setModalShow(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Selecionar Paciente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3 d-flex gap-3">
                        <input
                            type="text"
                            placeholder="ID"
                            className="form-control"
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Filtrar por Nome"
                            className="form-control"
                            onChange={(e) => setSearchNome(e.target.value)}
                        />
                    </div>

                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome</th>
                                <th>Data Nasc.</th>
                                <th>Idade</th>
                                <th>Ação</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pacientes.length > 0 ? (
                                pacientes.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.nome}</td>
                                        <td>{p.idade}</td>
                                        <td>{calcularIdade(p.idade)}</td>
                                        <td>
                                            <Button variant="success" onClick={() => handleSelecionarPaciente(p)}>
                                                Selecionar
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">Nenhum paciente encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <FaArrowLeft
                            className={`arrow ${page <= 1 ? 'disabled' : ''}`}
                            onClick={page <= 1 ? null : prevPage}
                        />
                        <span>Página {page} de {Math.ceil(total / 5)}</span>
                        <FaArrowRight
                            className={`arrow ${page >= Math.ceil(total / 5) ? 'disabled' : ''}`}
                            onClick={page >= Math.ceil(total / 5) ? null : nextPage}
                        />
                    </div>
                </Modal.Body>
            </Modal>

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