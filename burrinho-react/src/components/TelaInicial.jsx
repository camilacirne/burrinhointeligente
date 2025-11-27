import React, { useState } from 'react';

function TelaInicial({ onIniciar }) {
  const [maxRodadas, setMaxRodadas] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    onIniciar(maxRodadas);
  };

  return (
    <div className="tela-inicial">
      <div className="inicial-card">
        <h1>🎲 Burrinho Inteligente</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quantidade de rodadas</label>
            <input
              type="number"
              value={maxRodadas}
              onChange={(e) => setMaxRodadas(Number(e.target.value))}
              min="1"
              max="200"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            INICIAR JOGO
          </button>
        </form>
      </div>
    </div>
  );
}

export default TelaInicial;