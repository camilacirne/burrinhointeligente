import { CasaTabuleiro } from "./models.js";

export class Tabuleiro {
  constructor() {
    this.inicio = null;
    this.fim = null;
    this.tamanho = 0;
    this.lastInsert = null; // { ret, place: 'head'|'tail'|'middle'|'only', index }
  }

  #setLast(ret, place, index) {
    this.lastInsert = { ret, place, index };
    return ret;
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
    const nova = new CasaTabuleiro(peca);

    if (this.tamanho === 0) {
      this.inicio = this.fim = nova;
      this.tamanho = 1;
      return this.#setLast(0, "only", 0);
    }

    if (this.tamanho === 1) {
      const unico = this.inicio;
      if (peca.tem(unico.peca.esquerda) || peca.tem(unico.peca.direita)) {
        this.#inserirDepois(unico, nova); // índice 1
        return this.#setLast(1, "tail", 1);
      }
      this.lastInsert = null;
      return -1;
    }

    const oldSize = this.tamanho;

    if (peca.tem(this.inicio.peca.esquerda)) {
      this.#inserirAntes(this.inicio, nova);     // índice 0
      return this.#setLast(2, "head", 0);
    }

    if (peca.tem(this.fim.peca.direita)) {
      this.#inserirDepois(this.fim, nova);       // índice oldSize
      return this.#setLast(1, "tail", oldSize);
    }

    // entre casas (entre i e i+1) -> índice i+1
    let atual = this.inicio;
    let passos = 0;
    while (atual && atual.proximo) {
      const a = atual.peca.direita;
      const b = atual.proximo.peca.esquerda;
      const combinam =
        (peca.esquerda === a && peca.direita === b) ||
        (peca.esquerda === b && peca.direita === a);

      if (combinam) {
        this.#inserirDepois(atual, nova);
        const ret = oldSize - passos - 1;
        const index = passos + 1;
        return this.#setLast(ret, "middle", index);
      }
      atual = atual.proximo;
      passos++;
    }

    this.lastInsert = null;
    return -1;
  }

  incluirDoFim(peca) {
    const nova = new CasaTabuleiro(peca);

    if (this.tamanho === 0) {
      this.inicio = this.fim = nova;
      this.tamanho = 1;
      return this.#setLast(0, "only", 0);
    }

    if (this.tamanho === 1) {
      const unico = this.inicio;
      if (peca.tem(unico.peca.esquerda) || peca.tem(unico.peca.direita)) {
        this.#inserirAntes(unico, nova); // índice 0
        return this.#setLast(1, "head", 0);
      }
      this.lastInsert = null;
      return -1;
    }

    const oldSize = this.tamanho;

    if (peca.tem(this.inicio.peca.esquerda)) {
      this.#inserirAntes(this.inicio, nova); // índice 0
      return this.#setLast(2, "head", 0);
    }

    if (peca.tem(this.fim.peca.direita)) {
      this.#inserirDepois(this.fim, nova); // índice oldSize
      return this.#setLast(1, "tail", oldSize);
    }

    // entre casas (contando a partir do fim para o retorno),
    // mas queremos o índice final (i) — vamos localizar o nó 'atual'
    let atual = this.fim;
    let passos = 0;
    while (atual && atual.anterior) {
      const a = atual.anterior.peca.direita;
      const b = atual.peca.esquerda;
      const combinam =
        (peca.esquerda === a && peca.direita === b) ||
        (peca.esquerda === b && peca.direita === a);

      if (combinam) {
        const index = this.#indexOf(atual); // i
        this.#inserirAntes(atual, nova);    // entra antes do 'atual'
        const ret = oldSize - passos - 1;
        return this.#setLast(ret, "middle", index);
      }
      atual = atual.anterior;
      passos++;
    }

    this.lastInsert = null;
    return -1;
  }

  #indexOf(node) {
    let i = 0, c = this.inicio;
    while (c && c !== node) { c = c.proximo; i++; }
    return i;
  }

  toString() {
    let out = "";
    let c = this.inicio;
    while (c) {
      out += `[${c.peca.esquerda}|${c.peca.direita}]`;
      if (c.proximo) out += "—";
      c = c.proximo;
    }
    return out || "—";
  }
}
