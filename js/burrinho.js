import { CABECAS_ARRAY, Peca } from "./models.js";
import { Tabuleiro } from "./tabuleiro.js";

export class BurrinhoInteligente {
  constructor(rng = Math) {
    this.rng = rng;
    this.tabuleiro = new Tabuleiro();
    this.saco = [];
    this.jogadasBemSucedidas = 0;
    this.jogadasMalSucedidas = 0;
    this.#gerarDominoCompleto();
  }

  #gerarDominoCompleto() {
    const arr = [];
    for (let i = 0; i < CABECAS_ARRAY.length; i++) {
      for (let j = i; j < CABECAS_ARRAY.length; j++) {
        arr.push(new Peca(CABECAS_ARRAY[i], CABECAS_ARRAY[j])); // combinação com repetição
      }
    }
    // Fisher–Yates
    for (let k = arr.length - 1; k > 0; k--) {
      const r = Math.floor(this.rng.random() * (k + 1));
      [arr[k], arr[r]] = [arr[r], arr[k]];
    }
    this.saco = arr;
  }

  pecasRestantes() { return this.saco.length; }
  tamanhoTabuleiro() { return this.tabuleiro.tamanho; }
  estadoTabuleiro() { return this.tabuleiro.toString(); }

  #tirarPeca() { return this.saco.length ? this.saco.pop() : null; }
  #devolverPeca(p) {
    const idx = Math.floor(this.rng.random() * (this.saco.length + 1));
    this.saco.splice(idx, 0, p);
  }

  acabou() { return this.saco.length === 0; }

  simStep() {
    if (this.acabou()) return null;
    const p = this.#tirarPeca();
    const tentarInicio = this.rng.random() < 0.5;
    const ret = tentarInicio ? this.tabuleiro.incluirDoInicio(p) : this.tabuleiro.incluirDoFim(p);

    if (ret === -1) {
      this.jogadasMalSucedidas++;
      this.#devolverPeca(p);
      return { ok:false, ret, peca:p, lado: tentarInicio ? "INÍCIO" : "FIM", meta: null };
    } else {
      this.jogadasBemSucedidas++;
      return { ok:true, ret, peca:p, lado: tentarInicio ? "INÍCIO" : "FIM", meta: this.tabuleiro.lastInsert };
    }
  }

  playerStep(lado) {
    if (this.acabou()) return null;
    const p = this.#tirarPeca();
    const useStart = (lado || "").toUpperCase().startsWith("I");
    const ret = useStart ? this.tabuleiro.incluirDoInicio(p) : this.tabuleiro.incluirDoFim(p);

    if (ret === -1) {
      this.jogadasMalSucedidas++;
      this.#devolverPeca(p);
      return { ok:false, ret, peca:p, lado: useStart ? "INÍCIO" : "FIM", meta: null };
    } else {
      this.jogadasBemSucedidas++;
      return { ok:true, ret, peca:p, lado: useStart ? "INÍCIO" : "FIM", meta: this.tabuleiro.lastInsert };
    }
  }
}
