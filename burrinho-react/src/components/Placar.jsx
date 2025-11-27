import React from 'react';

function Placar({ pontos, jogadorDaVez, gameOver, vencedor }) {
  const getClass = (idx) => {
    let c = 'jogador-info';
    if (!gameOver && jogadorDaVez === idx) c += ' ativo';
    if (gameOver && vencedor === idx) c += ' vencedor';
    if (gameOver && vencedor !== null && vencedor !== idx) c += ' perdedor';
    return c;
  };

  return (
    <div className="card placar">
      <h3>Placar</h3>
      <div className={getClass(0)}>
        <span className="jogador-nome">Jogador 1</span>
        <span className="jogador-pontos">{pontos[0]}</span>
      </div>
      <div className={getClass(1)}>
        <span className="jogador-nome">Jogador 2</span>
        <span className="jogador-pontos">{pontos[1]}</span>
      </div>
      {gameOver && (
        <div className="game-over-msg">
          {vencedor === null ? 'EMPATE!' : `VENCEDOR: Jogador ${vencedor + 1}!`}
        </div>
      )}
    </div>
  );
}

export default Placar;