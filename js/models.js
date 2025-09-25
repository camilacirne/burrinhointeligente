export const CabecaPeca = Object.freeze({
  BRANCO: "BRANCO",
  PIO: "PIO",
  DUQUE: "DUQUE",
  TERNO: "TERNO",
  QUADRA: "QUADRA",
  QUINA: "QUINA",
  SENA: "SENA",
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
  toString() { return `[${this.esquerda}|${this.direita}]`; }
}

export class CasaTabuleiro {
  constructor(peca) {
    this.peca = peca;
    this.proximo = null;
    this.anterior = null;
  }
}
