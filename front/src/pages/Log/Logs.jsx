import { useState, useEffect } from 'react';
import './Logs.css';
import { useParams } from 'react-router-dom';
import api from '../../services/api'
import { ToastContainer, toast } from 'react-toastify'
import { formatarData } from '../../utils/formatters';
import LogCard from '../../components/LogsCard/LogsCard';


const Logs = () => {
    const { page } = useParams();


    // Dados ( MOCK EXAMES) temporarios
    // const [logExame, setLogExame] = useState([
    //     {
    //         logid: 1,
    //         date: "05/05/2026",
    //         valor: {
    //             update: {
    //                 alteracao: "Update"
    //             },
    //             antes: {
    //                 exameid: 1,
    //                 codigo: "HEMO",
    //                 exame: "Hemograma",
    //                 duplicar: "Sim"
    //             },
    //             depois: {
    //                 exameid: 1,
    //                 codigo: "HEMOG",
    //                 exame: "Hemograma completo",
    //                 duplicar: "Não"
    //             },
    //             user: {
    //                 userid: 1,
    //                 user: "Admin",
    //             }
    //         }
    //     }, {
    //         logid: 2,
    //         date: "02/05/2026",
    //         valor: {
    //             update: {
    //                 alteracao: "Delete"
    //             },
    //             delete: {
    //                 exameid: 1,
    //                 codigo: "HEMO",
    //                 exame: "Hemograma",
    //                 duplicar: "Sim"
    //             },
    //             user: {
    //                 userid: 1,
    //                 user: "Admin",
    //             }
    //         }
    //     }, {
    //         logid: 2,
    //         date: "20/05/2026",
    //         valor: {
    //             update: {
    //                 alteracao: "Create"
    //             },
    //             create: {
    //                 exameid: 2,
    //                 codigo: "HEMO",
    //                 exame: "Hemograma",
    //                 duplicar: "Não"
    //             },
    //             user: {
    //                 userid: 1,
    //                 user: "Admin",
    //             }
    //         }
    //     }
    // ]);

    const [logExame, setLogExame] = useState([])
    console.log(logExame)
    // Dados (MOCK PACIENTES ) temporarios
    const [logPaciente, setLogPaciente] = useState([
        {
            logid: 1,
            date: "05/05/2026",
            valor: {
                update: {
                    alteracao: "Update"
                },
                antes: {
                    pacienteid: 1,
                    nome: "Mario",
                    nascimento: "12/05/1999",
                },
                depois: {
                    pacienteid: 1,
                    nome: "Victor",
                    nascimento: "12/05/1999",
                },
                user: {
                    userid: 1,
                    user: "Admin",
                }
            }
        }, {
            logid: 2,
            date: "02/05/2026",
            valor: {
                update: {
                    alteracao: "Delete"
                },
                delete: {
                    pacienteid: 1,
                    nome: "Victor",
                    nascimento: "12/05/1999",
                },
                user: {
                    userid: 1,
                    user: "Admin",
                }
            }
        }, {
            logid: 2,
            date: "20/05/2026",
            valor: {
                update: {
                    alteracao: "Create"
                },
                create: {
                    pacienteid: 2,
                    nome: "Victor",
                    nascimento: "12/05/1999",
                },
                user: {
                    userid: 1,
                    user: "Admin",
                }
            }
        }
    ])

    const [dataInicio, setDataInicio] = useState('')
    const [dataFinal, setDataFinal] = useState('')
    const [type, setType] = useState('')

    async function searchLog(e) {
        e.preventDefault();

        if (!dataInicio || !dataFinal) {
            toast.info('Adicione uma data no filtro')
            return;
        }

        try {
            const response = await api.get(`/${page}/log`, {
                // params: {
                //     dataInicio,
                //     dataFinal,
                //     tipo: type
                // }
            });
            console.log(response.data)
            setLogExame(response.data);
        } catch (error) {
            console.log(error)
        }

    }

    return (
        <div className="logsContainer">
            {page === 'exames' ? (
                <h2 className="logsTitle">Logs de Exames</h2>
            ) : page === 'pacientes' ? (
                <h2 className="logsTitle">Logs de Pacientes</h2>
            ) : (
                <h2 className="logsTitle">Logs da Aplicação</h2>
            )}

            <form onSubmit={searchLog} className="filtersSection">
            {/* <form className="filtersSection"> */}

                <div className="dateFilter">
                    <label>Data Inicial:</label>
                    <input
                        type="date"
                        name="dataInicio"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                    />
                </div>

                <div className="dateFilter">
                    <label>Data Final:</label>
                    <input
                        type="date"
                        name="dataFim"
                        value={dataFinal}
                        onChange={(e) => setDataFinal(e.target.value)}
                    />
                </div>

                <div className="operationFilter">
                    <label>Operação:</label>
                    <select
                        name="operacao"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Todas</option>
                        <option value="INSERT">Insert</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                    </select>
                </div>

                <button
                    className="searchButton"
                    type='submit'
                >Pesquisar</button>
            </form>

            <div className="logsContent">
                {logExame.length === 0 || logPaciente.length === 0 ? (
                    <p>Nenhum log encontrado.</p>
                ) : page === 'paciente' ? (
                    logPaciente.map((item, index) => (
                        <LogCard key={item.logid} item={item} entidadeTipo="paciente" />
                    ))
                ) : page === 'exames' ? (
                    logExame.map((item) => (
                        <LogCard key={item.logid} item={item} entidadeTipo="exame" />
                    ))
                ) : (
                    <p>Log não encontrado</p>
                )}
            </div>

            <ToastContainer />
        </div >
    );
};

export default Logs