export const CabecaPeca = Object.freeze({
  BRANCO: "⚪",
  PIO: "①",
  DUQUE: "②",
  TERNO: "③",
  QUADRA: "④",
  QUINA: "⑤",
  SENA: "⑥",
});

export const CABECAS_ARRAY = Object.freeze([
  CabecaPeca.BRANCO,
  CabecaPeca.PIO,
  CabecaPeca.DUQUE,
  CabecaPeca.TERNO,
  CabecaPeca.QUADRA,
  CabecaPeca.QUINA,
  CabecaPeca.SENA,
]);

export class Peca {
  constructor(esquerda, direita) {
    this.esquerda = esquerda;
    this.direita = direita;
  }
  tem(c) { return this.esquerda === c || this.direita === c; }
  inverte() { [this.esquerda, this.direita] = [this.direita, this.esquerda]; }
  clone() { return new Peca(this.esquerda, this.direita); }
  toString() { return `[${this.esquerda}|${this.direita}]`; }
}

export class CasaTabuleiro {
  constructor(peca) {
    this.peca = peca;
    this.proximo = null;
    this.anterior = null;
  }
}