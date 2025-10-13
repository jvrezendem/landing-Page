// ======= Configuração do botão 'segurar para entrar' =======
const holdButton = document.getElementById('holdButton');
const intro = document.getElementById('intro');
const timeline = document.getElementById('timeline');
const backBtn = document.getElementById('backBtn');
const timelineList = document.getElementById('timelineList');

let holdTimer = null;
let progress = 0;
let rafId = null;

const HOLD_MS = 1200; // ajuste para o tempo de “segurar” conforme o Figma

function setRingProgress(deg){
  holdButton.style.setProperty('--prog', `${deg}deg`);
}

function startHold(){
  const start = performance.now();
  cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(function tick(now){
    const elapsed = now - start;
    const t = Math.min(elapsed / HOLD_MS, 1);
    progress = t * 360;
    setRingProgress(progress);

    if (t < 1){
      rafId = requestAnimationFrame(tick);
    } else {
      // Concluiu o carregamento — transição para a timeline
      openTimeline();
    }
  });
}

function cancelHold(){
  cancelAnimationFrame(rafId);
  progress = 0;
  setRingProgress(0);
}

function openTimeline(){
  // Suave “fade” entre telas
  intro.classList.remove('visible');
  intro.setAttribute('aria-hidden', 'true');

  timeline.classList.add('visible');
  timeline.setAttribute('aria-hidden', 'false');

  // Carregar dados da linha do tempo
  bootTimeline();
}

holdButton.addEventListener('pointerdown', (e) => {
  holdButton.setPointerCapture(e.pointerId);
  startHold();
});

['pointerup','pointercancel','pointerleave'].forEach(evt => {
  holdButton.addEventListener(evt, () => {
    // Se soltou antes de completar, cancela
    if (progress < 360) cancelHold();
  });
});

backBtn.addEventListener('click', () => {
  timeline.classList.remove('visible');
  timeline.setAttribute('aria-hidden', 'true');
  intro.classList.add('visible');
  intro.setAttribute('aria-hidden', 'false');
  cancelHold();
});

// ======= Renderização da linha do tempo =======
async function bootTimeline(){
  try{
    const res = await fetch('data/timeline.json', {cache: 'no-store'});
    const items = await res.json();
    renderTimeline(items);
  }catch(err){
    console.error('Falha ao carregar timeline.json. Usando fallback.', err);
    renderTimeline([
      {
        date: "2024",
        title: "Exemplo sem imagem",
        description: "Substitua este conteúdo pelos eventos reais exportados do Figma."
      },
      {
        date: "2024-10-12",
        title: "Exemplo com imagem",
        description: "Coloque a imagem correspondente em assets/images e aponte seu caminho no JSON.",
        image: "assets/images/exemplo.jpg"
      }
    ]);
  }
}

function el(tag, attrs={}, ...children){
  const $el = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)){
    if (k === 'class') $el.className = v;
    else if (k.startsWith('aria-') || k === 'role') $el.setAttribute(k, v);
    else if (k === 'html') $el.innerHTML = v;
    else $el.setAttribute(k, v);
  }
  for (const c of children){
    if (c == null) continue;
    if (typeof c === 'string') $el.appendChild(document.createTextNode(c));
    else $el.appendChild(c);
  }
  return $el;
}

function renderTimeline(items){
  timelineList.innerHTML = '';
  items.forEach((it, idx) => {
    const hasImage = Boolean(it.image);

    const dot = el('div', {class:'t-dot', 'aria-hidden':'true'});
    const media = hasImage
      ? el('img', {class:'t-media', src: it.image, alt: it.alt || it.title || `Evento ${idx+1}`})
      : null;

    const meta = el('div', {class:'t-meta'},
      el('span', {}, it.date || ''),
    );

    const title = el('h3', {class:'t-title'}, it.title || '');
    const text = el('p', {class:'t-text'}, it.description || '');

    const body = el('div', {class:'t-body'}, meta, title, text);

    const card = el('article', {class:`t-card ${!hasImage ? 'no-image':''}`, role:'listitem'},
      ...(hasImage ? [media] : []),
      body
    );

    const item = el('div', {class:'t-item'}, dot, card);
    timelineList.appendChild(item);
  });
}

// Inicializa com a tela intro visível
document.addEventListener('DOMContentLoaded', () => {
  intro.classList.add('visible');
});
