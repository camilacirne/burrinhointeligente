import React from 'react';

function Controles({ gameOver, pecaPuxada, rodadaAtual, maxRodadas, onPuxar, onNovoJogo }) {
  return (
    <div className="card">
      <h3>Controles</h3>
      {!gameOver ? (
        <button 
          className="btn btn-success" 
          onClick={onPuxar}
          disabled={!!pecaPuxada}
        >
          PUXAR PEÇA
        </button>
      ) : (
        <button className="btn btn-primary" onClick={onNovoJogo}>
          NOVO JOGO
        </button>
      )}
      <div className="rodada-info">
        Rodada: <span>{rodadaAtual}</span> / <span>{maxRodadas}</span>
      </div>
    </div>
  );
}

export default Controles;