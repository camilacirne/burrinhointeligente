// ========== MODELS ==========
const CabecaPeca = Object.freeze({
    BRANCO: "⚪", PIO: "①", DUQUE: "②", TERNO: "③", QUADRA: "④", QUINA: "⑤", SENA: "⑥",
  });
  
  const CABECAS_ARRAY = Object.freeze([
    CabecaPeca.BRANCO, CabecaPeca.PIO, CabecaPeca.DUQUE, CabecaPeca.TERNO,
    CabecaPeca.QUADRA, CabecaPeca.QUINA, CabecaPeca.SENA,
  ]);
  
  class Peca {
    constructor(esquerda, direita) {
      this.esquerda = esquerda;
      this.direita = direita;
    }
    tem(c) { return this.esquerda === c || this.direita === c; }
    inverte() { [this.esquerda, this.direita] = [this.direita, this.esquerda]; }
    clone() { return new Peca(this.esquerda, this.direita); }
    toString() { return `[${this.esquerda}|${this.direita}]`; }
  }
  
  class CasaTabuleiro {
    constructor(peca) {
      this.peca = peca;
      this.proximo = null;
      this.anterior = null;
    }
  }
  
  // ========== TABULEIRO ==========
  class Tabuleiro {
    constructor() {
      this.inicio = null;
      this.fim = null;
      this.tamanho = 0;
    }
  
    #inserirAntes(refer, nova) {
      nova.proximo = refer;
      nova.anterior = refer.anterior;
      if (refer.anterior !== null) refer.anterior.proximo = nova;
      refer.anterior = nova;
      if (refer === this.inicio) this.inicio = nova;
      this.tamanho++;
    }
  
    #inserirDepois(refer, nova) {
      nova.anterior = refer;
      nova.proximo = refer.proximo;
      if (refer.proximo !== null) refer.proximo.anterior = nova;
      refer.proximo = nova;
      if (refer === this.fim) this.fim = nova;
      this.tamanho++;
    }
  
    #indexOf(node) {
      let i = 0, c = this.inicio;
      while (c && c !== node) { c = c.proximo; i++; }
      return i;
    }
  
    incluirDoInicio(peca) {
      const p = peca.clone();
      const nova = new CasaTabuleiro(p);
  
      if (this.tamanho === 0) {
        this.inicio = this.fim = nova;
        this.tamanho = 1;
        return 0;
      }
  
      if (this.tamanho === 1) {
        const unico = this.inicio;
        if (p.tem(unico.peca.esquerda)) {
          if (p.direita !== unico.peca.esquerda) p.inverte();
          this.#inserirAntes(unico, nova);
          return 1;
        }
        if (p.tem(unico.peca.direita)) {
          if (p.esquerda !== unico.peca.direita) p.inverte();
          this.#inserirDepois(unico, nova);
          return 1;
        }
        return -1;
      }
  
      const oldSize = this.tamanho;
  
      if (p.tem(this.inicio.peca.esquerda)) {
        if (p.direita !== this.inicio.peca.esquerda) p.inverte();
        this.#inserirAntes(this.inicio, nova);
        return 2;
      }
  
      if (p.tem(this.fim.peca.direita)) {
        if (p.esquerda !== this.fim.peca.direita) p.inverte();
        this.#inserirDepois(this.fim, nova);
        return 1;
      }
  
      let atual = this.inicio;
      let passos = 0;
      while (atual && atual.proximo) {
        const a = atual.peca.direita;
        const b = atual.proximo.peca.esquerda;
        const combinam = (p.esquerda === a && p.direita === b) || (p.esquerda === b && p.direita === a);
  
        if (combinam) {
          if (p.esquerda !== a) p.inverte();
          this.#inserirDepois(atual, nova);
          return oldSize - passos - 1;
        }
        atual = atual.proximo;
        passos++;
      }
      return -1;
    }
  
    incluirDoFim(peca) {
      const p = peca.clone();
      const nova = new CasaTabuleiro(p);
  
      if (this.tamanho === 0) {
        this.inicio = this.fim = nova;
        this.tamanho = 1;
        return 0;
      }
  
      if (this.tamanho === 1) {
        const unico = this.inicio;
        if (p.tem(unico.peca.esquerda)) {
          if (p.direita !== unico.peca.esquerda) p.inverte();
          this.#inserirAntes(unico, nova);
          return 1;
        }
        if (p.tem(unico.peca.direita)) {
          if (p.esquerda !== unico.peca.direita) p.inverte();
          this.#inserirDepois(unico, nova);
          return 1;
        }
        return -1;
      }
  
      const oldSize = this.tamanho;
  
      if (p.tem(this.inicio.peca.esquerda)) {
        if (p.direita !== this.inicio.peca.esquerda) p.inverte();
        this.#inserirAntes(this.inicio, nova);
        return 2;
      }
  
      if (p.tem(this.fim.peca.direita)) {
        if (p.esquerda !== this.fim.peca.direita) p.inverte();
        this.#inserirDepois(this.fim, nova);
        return 1;
      }
  
      let atual = this.fim;
      let passos = 0;
      while (atual && atual.anterior) {
        const a = atual.anterior.peca.direita;
        const b = atual.peca.esquerda;
        const combinam = (p.esquerda === a && p.direita === b) || (p.esquerda === b && p.direita === a);
  
        if (combinam) {
          if (p.esquerda !== a) p.inverte();
          this.#inserirAntes(atual, nova);
          return oldSize - passos - 1;
        }
        atual = atual.anterior;
        passos++;
      }
      return -1;
    }
  
    getPecas() {
      const arr = [];
      let c = this.inicio;
      while (c) {
        arr.push(c.peca);
        c = c.proximo;
      }
      return arr;
    }
  }
  
  // ========== GAME ENGINE ==========
  class BurrinhoInteligente {
    constructor(maxRodadas = 100) {
      this.tabuleiro = new Tabuleiro();
      this.monte = [];
      this.pontos = [0, 0];
      this.jogadorDaVez = 0;
      this.rodadaAtual = 0;
      this.maxRodadas = maxRodadas;
      this.pecaPuxada = null;
      this.log = [];
      this.gameOver = false;
      this.vencedor = null;
      this.#gerarBaralho();
    }
  
    #gerarBaralho() {
      const arr = [];
      for (let i = 0; i < CABECAS_ARRAY.length; i++) {
        for (let j = i; j < CABECAS_ARRAY.length; j++) {
          arr.push(new Peca(CABECAS_ARRAY[i], CABECAS_ARRAY[j]));
        }
      }
      for (let k = arr.length - 1; k > 0; k--) {
        const r = Math.floor(Math.random() * (k + 1));
        [arr[k], arr[r]] = [arr[r], arr[k]];
      }
      this.monte = arr;
    }
  
    #jogoFechado() {
      if (this.monte.length === 0) return false;
      if (this.tabuleiro.tamanho === 0) return false;
      for (let peca of this.monte) {
        if (this.tabuleiro.incluirDoInicio(peca.clone()) !== -1) return false;
        if (this.tabuleiro.incluirDoFim(peca.clone()) !== -1) return false;
      }
      return true;
    }
  
    puxarPeca() {
      if (this.gameOver || this.pecaPuxada) return this.pecaPuxada;
      if (this.monte.length === 0) {
        this.#finalizarJogo("Monte vazio");
        return null;
      }
      if (this.#jogoFechado()) {
        this.#finalizarJogo("Jogo fechado");
        return null;
      }
      this.pecaPuxada = this.monte.pop();
      return this.pecaPuxada;
    }
  
    tentarJogar(direcao) {
      if (!this.pecaPuxada) return { ok: false, msg: "Nenhuma peça puxada" };
      
      const usarInicio = direcao === "I";
      const ret = usarInicio ? this.tabuleiro.incluirDoInicio(this.pecaPuxada) : this.tabuleiro.incluirDoFim(this.pecaPuxada);
  
      if (ret !== -1) {
        this.pontos[this.jogadorDaVez]++;
        this.log.push({
          rodada: Math.floor(this.log.length / 2) + 1,
          jogador: this.jogadorDaVez + 1,
          peca: this.pecaPuxada.toString(),
          direcao: direcao,
          pontos: this.pontos[this.jogadorDaVez],
          ret
        });
        this.pecaPuxada = null;
        this.jogadorDaVez = 1 - this.jogadorDaVez;
        if (this.jogadorDaVez === 0) this.rodadaAtual++;
        if (this.rodadaAtual >= this.maxRodadas) this.#finalizarJogo("Rodadas máximas atingidas");
        return { ok: true, ret, msg: "Peça encaixada!" };
      }
  
      const outraDirecao = direcao === "I" ? "D" : "I";
      const ret2 = outraDirecao === "I" ? this.tabuleiro.incluirDoInicio(this.pecaPuxada) : this.tabuleiro.incluirDoFim(this.pecaPuxada);
  
      if (ret2 !== -1) {
        this.pontos[this.jogadorDaVez]++;
        this.log.push({
          rodada: Math.floor(this.log.length / 2) + 1,
          jogador: this.jogadorDaVez + 1,
          peca: this.pecaPuxada.toString(),
          direcao: outraDirecao + " (auto)",
          pontos: this.pontos[this.jogadorDaVez],
          ret: ret2
        });
        this.pecaPuxada = null;
        this.jogadorDaVez = 1 - this.jogadorDaVez;
        if (this.jogadorDaVez === 0) this.rodadaAtual++;
        if (this.rodadaAtual >= this.maxRodadas) this.#finalizarJogo("Rodadas máximas atingidas");
        return { ok: true, ret: ret2, msg: "Encaixada na outra direção!" };
      }
      return { ok: false, ret: -1, msg: "Não encaixou" };
    }
  
    devolverPeca() {
      if (!this.pecaPuxada) return;
      this.log.push({
        rodada: Math.floor(this.log.length / 2) + 1,
        jogador: this.jogadorDaVez + 1,
        peca: this.pecaPuxada.toString(),
        direcao: "—",
        pontos: this.pontos[this.jogadorDaVez],
        ret: -1
      });
      this.monte.unshift(this.pecaPuxada);
      this.pecaPuxada = null;
      this.jogadorDaVez = 1 - this.jogadorDaVez;
      if (this.jogadorDaVez === 0) this.rodadaAtual++;
    }
  
    #finalizarJogo(motivo) {
      this.gameOver = true;
      if (this.pontos[0] > this.pontos[1]) this.vencedor = 0;
      else if (this.pontos[1] > this.pontos[0]) this.vencedor = 1;
      else this.vencedor = null;
      this.log.push({ tipo: "fim", motivo, vencedor: this.vencedor });
    }
  }
  
  // ========== UI ==========
  let jogo = null;
  
  function renderBoard() {
    const board = document.getElementById('board');
    const pecas = jogo.tabuleiro.getPecas();
    
    if (pecas.length === 0) {
      board.className = 'board empty';
      board.innerHTML = 'Tabuleiro vazio';
      return;
    }
    
    board.className = 'board';
    const container = document.createElement('div');
    container.className = 'board-pecas';
    
    pecas.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'peca';
      div.innerHTML = `
        <span class="peca-esq">${p.esquerda}</span>
        <span class="peca-div">|</span>
        <span class="peca-dir">${p.direita}</span>
      `;
      container.appendChild(div);
      
      if (i < pecas.length - 1) {
        const arrow = document.createElement('div');
        arrow.className = 'peca-arrow';
        arrow.textContent = '→';
        container.appendChild(arrow);
      }
    });
    
    board.innerHTML = '';
    board.appendChild(container);
  }
  
  function renderMonte() {
    const list = document.getElementById('monteList');
    const count = document.getElementById('monteCount');
    count.textContent = jogo.monte.length;
    
    list.innerHTML = '';
    const monteCopy = [...jogo.monte].reverse();
    
    monteCopy.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'monte-peca';
      
      if (i === 0) {
        div.classList.add(jogo.jogadorDaVez === 0 ? 'proxima-j1' : 'proxima-j2');
      } else if (i === 1 && jogo.monte.length > 1) {
        div.classList.add(jogo.jogadorDaVez === 0 ? 'seguinte-j2' : 'seguinte-j1');
      }
      
      div.innerHTML = `
        <span class="peca-esq">${p.esquerda}</span>
        <span class="peca-div">|</span>
        <span class="peca-dir">${p.direita}</span>
        ${i === 0 ? `<span class="marcador">${jogo.jogadorDaVez === 0 ? '🟢 J1' : '🔵 J2'}</span>` : ''}
        ${i === 1 && jogo.monte.length > 1 ? `<span class="marcador">${jogo.jogadorDaVez === 0 ? '🔵 J2' : '🟢 J1'}</span>` : ''}
    `;
    list.appendChild(div);
  });
}

function renderPlacar() {
  document.getElementById('pontosJ1').textContent = jogo.pontos[0];
  document.getElementById('pontosJ2').textContent = jogo.pontos[1];
  
  const j1 = document.getElementById('jogador1Info');
  const j2 = document.getElementById('jogador2Info');
  
  j1.className = 'jogador-info';
  j2.className = 'jogador-info';
  
  if (!jogo.gameOver) {
    if (jogo.jogadorDaVez === 0) j1.classList.add('ativo');
    else j2.classList.add('ativo');
  } else {
    if (jogo.vencedor === 0) {
      j1.classList.add('vencedor');
      j2.classList.add('perdedor');
    } else if (jogo.vencedor === 1) {
      j2.classList.add('vencedor');
      j1.classList.add('perdedor');
    }
  }
}

function renderLog() {
  const tbody = document.getElementById('logBody');
  tbody.innerHTML = '';
  
  jogo.log.filter(l => !l.tipo).forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${l.rodada}</td>
      <td>Jogador ${l.jogador}</td>
      <td>${l.peca}</td>
      <td>${l.direcao}</td>
      <td><strong>${l.pontos}</strong></td>
    `;
    tbody.appendChild(tr);
  });
}

function renderUI() {
  document.getElementById('pecasRestantes').textContent = jogo.monte.length;
  document.getElementById('rodadaAtual').textContent = jogo.rodadaAtual;
  document.getElementById('rodadaMax').textContent = jogo.maxRodadas;
  
  renderBoard();
  renderMonte();
  renderPlacar();
  renderLog();
  
  const pecaPuxadaCard = document.getElementById('pecaPuxadaCard');
  const btnPuxar = document.getElementById('btnPuxar');
  const btnNovoJogo = document.getElementById('btnNovoJogo');
  const gameOverMsg = document.getElementById('gameOverMsg');
  
  if (jogo.pecaPuxada) {
    pecaPuxadaCard.classList.remove('hidden');
    document.getElementById('pecaPuxadaDisplay').textContent = jogo.pecaPuxada.toString();
    btnPuxar.disabled = true;
  } else {
    pecaPuxadaCard.classList.add('hidden');
    btnPuxar.disabled = jogo.gameOver;
  }
  
  if (jogo.gameOver) {
    btnPuxar.classList.add('hidden');
    btnNovoJogo.classList.remove('hidden');
    gameOverMsg.classList.remove('hidden');
    
    if (jogo.vencedor === null) {
      gameOverMsg.textContent = 'EMPATE!';
    } else {
      gameOverMsg.textContent = `VENCEDOR: Jogador ${jogo.vencedor + 1}!`;
    }
  } else {
    btnPuxar.classList.remove('hidden');
    btnNovoJogo.classList.add('hidden');
    gameOverMsg.classList.add('hidden');
  }
}

function iniciarJogo() {
  const maxRodadas = parseInt(document.getElementById('maxRodadas').value) || 50;
  jogo = new BurrinhoInteligente(maxRodadas);
  
  document.getElementById('telaInicial').classList.add('hidden');
  document.getElementById('telaJogo').classList.remove('hidden');
  
  renderUI();
}

function puxar() {
  jogo.puxarPeca();
  renderUI();
}

function jogar(direcao) {
  jogo.tentarJogar(direcao);
  renderUI();
}

function devolver() {
  jogo.devolverPeca();
  renderUI();
}

function novoJogo() {
  document.getElementById('telaInicial').classList.remove('hidden');
  document.getElementById('telaJogo').classList.add('hidden');
  jogo = null;
}

// Event Listeners
document.getElementById('btnIniciar').addEventListener('click', iniciarJogo);
document.getElementById('btnPuxar').addEventListener('click', puxar);
document.getElementById('btnEsquerda').addEventListener('click', () => jogar('I'));
document.getElementById('btnDireita').addEventListener('click', () => jogar('D'));
document.getElementById('btnDevolver').addEventListener('click', devolver);
document.getElementById('btnNovoJogo').addEventListener('click', novoJogo);