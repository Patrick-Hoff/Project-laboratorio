import './style.css';
import { useEffect, useState } from 'react';
import axios from 'axios'

const Dashboard = () => {

  const [consultasHoje, setConsultasHoje] = useState()
  const [faturamentoHoje, setFaturamentoHoje] = useState()
  const [pacientesCriadosHoje, setPacientesCriadosHoje] = useState()
  const [examesAtendimento, setExamesAtendimento] = useState()
  const [agendamento, setAgendamento] = useState([])

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const data = await axios.get('http://localhost:8081/dashboard')
        const data_consulta = await axios.get('http://localhost:8081/agendamento?proximos=true')
        setAgendamento(data_consulta.data.data)
        if (data.data.quantidade_atendimentos < 10) {
          setConsultasHoje('0' + data.data.quantidade_atendimentos)
        } else {
          setConsultasHoje(data.data.quantidade_atendimentos)
        }
        if (data.data.pacientes_criados < 10) {
          setPacientesCriadosHoje('0' + data.data.pacientes_criados)
        }
        else {
          setPacientesCriadosHoje(data.data.pacientes_criados)
        }
        if (data.data.exames_atendimento < 10) {
          setExamesAtendimento('0' + data.data.exames_atendimento)
        } else {
          setExamesAtendimento(data.data.exames_atendimento)
        }
        setFaturamentoHoje(data.data.faturamento)
      } catch (err) {
        console.log(err)
      }
    }

    carregarDados()
  }, [])


  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <h1 className="page-title">Dashboard Laboratório</h1>

        <div className="cards-container">
          <div className="info-card">
            <p className="card-title">Consultas Hoje</p>
            <h2>{consultasHoje}</h2>
          </div>
          <div className="info-card">
            <p className="card-title">Exames cadastrados</p>
            <h2>{examesAtendimento}</h2>
          </div>
          <div className="info-card">
            <p className="card-title">Novos Pacientes</p>
            <h2>{pacientesCriadosHoje}</h2>
          </div>
          <div className="info-card">
            <p className="card-title">Faturamento do dia</p>
            <h2>R$ {faturamentoHoje}</h2>
          </div>
        </div>

        <div className="table-section">
          <h2>Próximas Consultas</h2>
          <table>
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Data</th>
                <th>Horário</th>
              </tr>
            </thead>

            <tbody>
              {agendamento.length > 0 ? (
                agendamento.map(item => (
                  <tr key={item.id}>
                    <td>{item.nome}</td>
                    <td>{item.data_consulta}</td>
                    <td>{item.horario}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3">Nenhum agendamento encontrado</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
