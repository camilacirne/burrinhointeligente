import React from 'react';

function Monte({ monte, jogadorDaVez }) {
  const monteCopy = [...monte].reverse();

  const getClass = (i) => {
    let c = 'monte-peca';
    if (i === 0) c += jogadorDaVez === 0 ? ' proxima-j1' : ' proxima-j2';
    else if (i === 1 && monte.length > 1) c += jogadorDaVez === 0 ? ' seguinte-j2' : ' seguinte-j1';
    return c;
  };

  const getMarcador = (i) => {
    if (i === 0) return jogadorDaVez === 0 ? '🟢 J1' : '🔵 J2';
    if (i === 1 && monte.length > 1) return jogadorDaVez === 0 ? '🔵 J2' : '🟢 J1';
    return null;
  };

  return (
    <div className="card">
      <h2>Peças Disponíveis no Monte (<span>{monte.length}</span>)</h2>
      <div className="monte-pecas">
        <p className="monte-label">
          Ordem de retirada (última para primeira) - Próximas jogadas:
        </p>
        <div className="monte-list">
          {monteCopy.map((p, i) => (
            <div key={i} className={getClass(i)}>
              <span className="peca-esq">{p.esquerda}</span>
              <span className="peca-div">|</span>
              <span className="peca-dir">{p.direita}</span>
              {getMarcador(i) && <span className="marcador">{getMarcador(i)}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Monte;