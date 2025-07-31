import { useState, useEffect } from 'react';
import './Logs.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'

const Logs = () => {
    const { page } = useParams();
    const [log, setLog] = useState([]);

    const [dataInicio, setDataInicio] = useState()
    const [dataFinal, setDataFinal] = useState()
    const [type, setType] = useState('')

    async function searchLog(e) {
        e.preventDefault();

        if (!dataInicio ||!dataFinal) {
            toast.info('Adicione uma data no filtro')
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8081/${page}/log`, {
                params: {
                    dataInicio,
                    dataFinal,
                    tipo: type
                }
            });
            setLog(response.data);
        } catch (error) {
            setLog([]);
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
                {log.length === 0 ? (
                    <p>Nenhum log encontrado.</p>
                ) : page === 'pacientes' ? (
                    <ul>
                        {log.map((item, index) => (
                            <li key={index}>
                                <strong>Alteração data: </strong> {item.data_alteracao} <br />
                                <strong>Ação:</strong> {item.tipo_alteracao} <br />
                                <strong>ID Paciente:</strong> {item.id_paciente} <br />
                                <strong>Paciente: </strong> {item.paciente} <br />
                                <strong>Idade:</strong> {item.idade}
                                <hr />
                            </li>
                        ))}
                    </ul>
                ) : page === 'exames' ? (
                    <ul>
                        {log.map((item, index) => (
                            <li key={index}>
                                <strong>Alteração data: </strong> {item.data_alteracao} <br />
                                <strong>Ação:</strong> {item.tipo_alteracao} <br />
                                <strong>ID Exame:</strong> {item.id_exame} <br />
                                <strong>Cod: </strong> {item.cod} <br />
                                <strong>Exame: </strong> {item.exame}
                                <hr />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Log não encontrado</p>
                )}
            </div>

            <ToastContainer />
        </div >
    );
};

export default Logs;