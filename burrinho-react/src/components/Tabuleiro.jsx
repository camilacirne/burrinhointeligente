import React from 'react';

function Tabuleiro({ tabuleiro, pecasRestantes }) {
  const pecas = tabuleiro.getPecas();

  return (
    <>
      <div className="board-header">
        <h2>Tabuleiro</h2>
        <div className="pecas-count">
          Peças restantes: <span>{pecasRestantes}</span>
        </div>
      </div>
      <div className={pecas.length === 0 ? "board empty" : "board"}>
        {pecas.length === 0 ? (
          "Tabuleiro vazio"
        ) : (
          <div className="board-pecas">
            {pecas.map((p, i) => (
              <React.Fragment key={i}>
                <div className="peca">
                  <span className="peca-esq">{p.esquerda}</span>
                  <span className="peca-div">|</span>
                  <span className="peca-dir">{p.direita}</span>
                </div>
                {i < pecas.length - 1 && (
                  <div className="peca-arrow">→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Tabuleiro;