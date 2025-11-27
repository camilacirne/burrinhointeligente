import React from 'react';

function Historico({ log }) {
  const jogadas = log.filter(l => !l.tipo);

  return (
    <div className="card">
      <h2>Histórico de Jogadas</h2>
      <div className="overflow-auto">
        <table className="log-table">
          <thead>
            <tr>
              <th>Rodada</th>
              <th>Jogador</th>
              <th>Peça</th>
              <th>Direção</th>
              <th>Pontos</th>
            </tr>
          </thead>
          <tbody>
            {jogadas.map((l, i) => (
              <tr key={i}>
                <td>{l.rodada}</td>
                <td>Jogador {l.jogador}</td>
                <td>{l.peca}</td>
                <td>{l.direcao}</td>
                <td><strong>{l.pontos}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Historico;