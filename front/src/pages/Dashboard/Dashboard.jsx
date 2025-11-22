import './style.css';
import { useEffect, useState } from 'react';
import axios from 'axios'

const Dashboard = () => {

  const [consultasHoje, setConsultasHoje] = useState()
  console.log(consultasHoje)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const consultas = await axios.get('http://localhost:8081/dashboard')
        if (consultas.data.quantidade < 10) {
          setConsultasHoje('0' + consultas.data.quantidade)
        } else {
          setConsultasHoje(consultas.data.quantidade)
        }
      } catch (err) {
        console.log(err)
      }
    }

    carregarDados()
  }, [])


  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <h1 className="page-title">Visão Geral - Em desenvolvimento</h1>

        <div className="cards-container">
          <div className="info-card">
            <p className="card-title">Consultas Hoje</p>
            <h2>{consultasHoje}</h2>
          </div>
          <div className="info-card">
            <p className="card-title">Exames Pendentes</p>
            <h2>8</h2>
          </div>
          <div className="info-card">
            <p className="card-title">Novos Pacientes</p>
            <h2>25</h2>
          </div>
          <div className="info-card">
            <p className="card-title">Faturamento</p>
            <h2>R$ 15.200,00</h2>
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
                <th>Médico</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ana Souza</td>
                <td>26/08/2025</td>
                <td>14:00</td>
                <td>Dra. Paula</td>
              </tr>
              <tr>
                <td>João Lima</td>
                <td>26/08/2025</td>
                <td>15:30</td>
                <td>Dr. Marcos</td>
              </tr>
              <tr>
                <td>Maria Clara</td>
                <td>26/08/2025</td>
                <td>16:00</td>
                <td>Dra. Fernanda</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
