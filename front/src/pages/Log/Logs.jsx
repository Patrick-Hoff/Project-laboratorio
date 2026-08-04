import { useState, useEffect } from 'react';
import './Logs.css';
import { useParams } from 'react-router-dom';
import api from '../../services/api'
import { ToastContainer, toast } from 'react-toastify'
import LogCard from '../../components/LogsCard/LogsCard';


const Logs = () => {
    const { page } = useParams();

    const [log, setLog] = useState([])

    const [dataInicio, setDataInicio] = useState('')
    const [dataFinal, setDataFinal] = useState('')
    const [type, setType] = useState('')

    async function searchLog(e) {
        if (e) e.preventDefault();

        if (!dataInicio || !dataFinal) {
            toast.info('Adicione uma data no filtro')
            return;
        }

        try {
            const response = await api.get(`/logsgrid/${page}`,
                {
                    withCredentials: true,
                    params: {
                        dataInicio,
                        dataFinal,
                        tipo: type
                    }
                });

            setLog(response.data);
            console.log(response)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="logsContainer">
            {page === 'exame' ? (
                <h2 className="logsTitle">Logs de Exames</h2>
            ) : page === 'paciente' ? (
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
                        <option value="Create">Insert</option>
                        <option value="Update">Update</option>
                        <option value="Delete">Delete</option>
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
                ) : (
                    log.map((item) => (
                        <LogCard
                            key={item.logid}
                            item={item}
                            entidadeTipo={page}
                        />
                    ))
                )}

            </div>

            <ToastContainer />
        </div >
    );
};

export default Logs