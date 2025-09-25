import { BurrinhoInteligente } from "./burrinho.js";

const $ = (sel) => document.querySelector(sel);
const logEl = $("#log");
const boardEl = $("#board");
const bagEl = $("#bag");
const sizeEl = $("#size");
const lastEl = $("#last");
const playerBtns = $("#playerBtns");

let modo = "sim"; // "sim" | "player"
let jogo = null;

function setModeFromUI() {
  const v = [...document.querySelectorAll('input[name="mode"]')]
    .find(r => r.checked)?.value || "sim";
  modo = v;
  playerBtns.style.display = modo === "player" ? "flex" : "none";
}

function resetLog() { logEl.textContent = ""; }
function appendLog(line) {
  logEl.textContent += line + "\n";
  logEl.scrollTop = logEl.scrollHeight;
}

function setLast(ret) {
  lastEl.textContent = (ret === null || ret === undefined) ? "-" : String(ret);
  lastEl.className = ret === -1 ? "fail" : "ok";
}

// ------- Renderização visual do tabuleiro -------
function snapshotBoard() {
  const txt = jogo.estadoTabuleiro();
  return txt === "—" ? [] : txt.split("—");
}

function renderBoard(meta = null) {
  const items = snapshotBoard();
  if (!items.length) { boardEl.textContent = "—"; return; }

  const line = document.createElement("div");
  line.className = "board-list";

  items.forEach((s, i) => {
    const chip = document.createElement("span");
    chip.className = "tile";
    chip.textContent = s;
    if (meta && Number.isInteger(meta.index) && i === meta.index) {
      chip.classList.add("new");
      setTimeout(() => chip.classList.remove("new"), 1200);
    }
    line.appendChild(chip);
    if (i < items.length - 1) {
      const sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "—";
      line.appendChild(sep);
    }
  });

  boardEl.innerHTML = "";
  boardEl.appendChild(line);
}

function refresh(meta = null) {
  renderBoard(meta);
  bagEl.textContent = String(jogo.pecasRestantes());
  sizeEl.textContent = String(jogo.tamanhoTabuleiro());
}

// ------- Fluxo do jogo -------
function novoJogo() {
  jogo = new BurrinhoInteligente(Math);
  resetLog();
  setLast("-");
  refresh();
  appendLog("Novo jogo iniciado. Peças no saco: " + jogo.pecasRestantes());
}

function prettyMeta(meta) {
  if (!meta) return "";
  const pos =
    meta.place === "head"  ? `antes da primeira (i=${meta.index})` :
    meta.place === "tail"  ? `após a última (i=${meta.index})` :
    meta.place === "only"  ? `primeira peça (i=0)` :
                             `entre casas (i=${meta.index})`;
  return ` — ${pos}`;
}

function step() {
  if (jogo.acabou()) {
    appendLog("Saco vazio. Fim de jogo.");
    setLast("-");
    return;
  }

  if (modo === "sim") {
    const res = jogo.simStep();
    if (res === null) {
      appendLog("Saco vazio. Fim de jogo.");
      setLast("-");
      return;
    }
    const { ok, ret, peca, lado, meta } = res;
    appendLog(`${ok ? "OK " : "X  "} ${lado.padEnd(6)} peça ${peca} → retorno ${ret}${ok ? prettyMeta(meta) : ""}`);
    setLast(ret);
    refresh(meta);
  } else {
    appendLog("Modo jogador: use os botões 'Tentar pelo início/fim'.");
  }
}

function runAll() {
  if (modo !== "sim") {
    appendLog("Para 'Rodar até acabar', selecione o modo Simulação.");
    return;
  }
  let safety = 100000; // trava de segurança
  let lastMeta = null;
  while (!jogo.acabou() && safety-- > 0) {
    const r = jogo.simStep();
    if (r === null) break;
    lastMeta = r.meta || lastMeta;
  }
  appendLog("Fim de jogo. Saco vazio.");
  setLast("-");
  refresh(lastMeta);
}

// Modo jogador
function tryStart() {
  if (jogo.acabou()) { appendLog("Saco vazio. Fim de jogo."); return; }
  const r = jogo.playerStep("INICIO");
  if (r === null) return;
  appendLog(`${r.ok ? "OK " : "X  "} INÍCIO  peça ${r.peca} → retorno ${r.ret}${r.ok ? prettyMeta(r.meta) : ""}`);
  setLast(r.ret);
  refresh(r.meta);
}
function tryEnd() {
  if (jogo.acabou()) { appendLog("Saco vazio. Fim de jogo."); return; }
  const r = jogo.playerStep("FIM");
  if (r === null) return;
  appendLog(`${r.ok ? "OK " : "X  "} FIM     peça ${r.peca} → retorno ${r.ret}${r.ok ? prettyMeta(r.meta) : ""}`);
  setLast(r.ret);
  refresh(r.meta);
}

// bindings
$("#newGame").addEventListener("click", novoJogo);
$("#step").addEventListener("click", step);
$("#runAll").addEventListener("click", runAll);
$("#tryStart").addEventListener("click", tryStart);
$("#tryEnd").addEventListener("click", tryEnd);
document.querySelectorAll('input[name="mode"]').forEach(r => {
  r.addEventListener("change", () => { setModeFromUI(); });
});

// init
setModeFromUI();
novoJogo();
