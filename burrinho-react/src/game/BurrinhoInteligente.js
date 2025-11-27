import { CABECAS_ARRAY, Peca } from "./models.js";
import { Tabuleiro } from "./tabuleiro.js";

export class BurrinhoInteligente {
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

  puxarPeca() {
    if (this.gameOver || this.pecaPuxada) return this.pecaPuxada;
    if (this.monte.length === 0) {
      this.#finalizarJogo("Monte vazio");
      return null;
    }
    this.pecaPuxada = this.monte.pop();
    return this.pecaPuxada;
  }

  tentarJogar(direcao) {
    if (!this.pecaPuxada) return { ok: false, msg: "Nenhuma peça puxada" };
    
    const usarInicio = direcao === "I";
    const ret = usarInicio 
      ? this.tabuleiro.incluirDoInicio(this.pecaPuxada) 
      : this.tabuleiro.incluirDoFim(this.pecaPuxada);

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
      if (this.rodadaAtual >= this.maxRodadas) {
        this.#finalizarJogo("Rodadas máximas atingidas");
      }
      return { ok: true, ret, msg: "Peça encaixada!" };
    }

    const outraDirecao = direcao === "I" ? "D" : "I";
    const ret2 = outraDirecao === "I" 
      ? this.tabuleiro.incluirDoInicio(this.pecaPuxada) 
      : this.tabuleiro.incluirDoFim(this.pecaPuxada);

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
      if (this.rodadaAtual >= this.maxRodadas) {
        this.#finalizarJogo("Rodadas máximas atingidas");
      }
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
    if (this.pontos[0] > this.pontos[1]) {
      this.vencedor = 0;
    } else if (this.pontos[1] > this.pontos[0]) {
      this.vencedor = 1;
    } else {
      this.vencedor = null;
    }
    this.log.push({ tipo: "fim", motivo, vencedor: this.vencedor });
  }
}