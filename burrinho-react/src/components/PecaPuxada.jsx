import React from 'react';

function PecaPuxada({ peca, onJogar, onDevolver }) {
  return (
    <div className="card">
      <h3>Peça Puxada</h3>
      <div className="peca-puxada-box">
        <div className="peca-puxada-display">{peca.toString()}</div>
        <p className="peca-puxada-label">Escolha onde encaixar:</p>
        <div className="btn-group">
          <button className="btn-esq" onClick={() => onJogar('I')}>
            ← ESQUERDA
          </button>
          <button className="btn-dir" onClick={() => onJogar('D')}>
            DIREITA →
          </button>
        </div>
        <button className="btn-devolver" onClick={onDevolver}>
          DEVOLVER
        </button>
      </div>
    </div>
  );
}

export default PecaPuxada;