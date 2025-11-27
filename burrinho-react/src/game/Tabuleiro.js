import { CasaTabuleiro } from "./models.js";

export class Tabuleiro {
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