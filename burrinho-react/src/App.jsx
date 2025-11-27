import React, { useState } from 'react';
import { BurrinhoInteligente } from './game/BurrinhoInteligente';
import TelaInicial from './components/TelaInicial';
import Tabuleiro from './components/Tabuleiro';
import Placar from './components/Placar';
import PecaPuxada from './components/PecaPuxada';
import Controles from './components/Controles';
import Monte from './components/Monte';
import Historico from './components/Historico';
import './App.css';

function App() {
  const [jogo, setJogo] = useState(null);
  const [, forceUpdate] = useState({});

  const refresh = () => forceUpdate({});

  const iniciarJogo = (maxRodadas) => {
    setJogo(new BurrinhoInteligente(maxRodadas));
  };

  const puxarPeca = () => {
    jogo.puxarPeca();
    refresh();
  };

  const tentarJogar = (direcao) => {
    jogo.tentarJogar(direcao);
    refresh();
  };

  const devolverPeca = () => {
    jogo.devolverPeca();
    refresh();
  };

  const novoJogo = () => setJogo(null);

  if (!jogo) {
    return <TelaInicial onIniciar={iniciarJogo} />;
  }

  return (
    <div className="container">
      <h1>🎲 Burrinho Inteligente</h1>
      
      <div className="game-grid">
        <div className="card">
          <Tabuleiro 
            tabuleiro={jogo.tabuleiro} 
            pecasRestantes={jogo.monte.length}
          />
        </div>

        <div>
          <Placar 
            pontos={jogo.pontos}
            jogadorDaVez={jogo.jogadorDaVez}
            gameOver={jogo.gameOver}
            vencedor={jogo.vencedor}
          />

          {jogo.pecaPuxada && (
            <PecaPuxada 
              peca={jogo.pecaPuxada}
              onJogar={tentarJogar}
              onDevolver={devolverPeca}
            />
          )}

          <Controles
            gameOver={jogo.gameOver}
            pecaPuxada={jogo.pecaPuxada}
            rodadaAtual={jogo.rodadaAtual}
            maxRodadas={jogo.maxRodadas}
            onPuxar={puxarPeca}
            onNovoJogo={novoJogo}
          />
        </div>
      </div>

      <Monte 
        monte={jogo.monte}
        jogadorDaVez={jogo.jogadorDaVez}
      />

      <Historico log={jogo.log} />
    </div>
  );
}

export default App;