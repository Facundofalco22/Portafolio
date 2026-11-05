document.documentElement.classList.add('js');
// Seguridad: si algo falla, se muestra todo igual
setTimeout(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('in')), 1500);

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Menú hamburguesa
const burger = document.querySelector('.burger'), menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open'); burger.setAttribute('aria-expanded', false);
  }));
}

// ===== Proyectos desde data/proyectos.json =====
const grid = document.getElementById('proyectos-grid');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const enlace = (u, t) => u
  ? `<a href="${esc(u)}" target="_blank" rel="noopener">${t} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>`
  : `<span class="off">${t} (pronto)</span>`;

function render(lista) {
  if (!lista.length) { grid.innerHTML = '<p class="vacio">Todavía no hay proyectos cargados.</p>'; return; }
  grid.innerHTML = lista.map((p, i) => `
    <article class="card" data-cat="${esc(p.categoria)}">
      <div class="cover cv${i % 3 + 1}">
        ${p.imagen ? `<img src="${esc(p.imagen)}" alt="${esc(p.titulo)}" loading="lazy">` : `<i class="fa-solid fa-${esc(p.icono || 'code')}"></i>`}
        ${p.demo ? `<a href="${esc(p.demo)}" target="_blank" rel="noopener" class="ext" aria-label="Abrir ${esc(p.titulo)}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
      </div>
      <div class="card-b"><h3>${esc(p.titulo)}</h3><p>${esc(p.descripcion)}</p>
        <div class="tags">${(p.tecnologias || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
        <div class="links">${enlace(p.demo, 'Ver demo')}${enlace(p.codigo, 'Ver código')}</div>
      </div>
    </article>`).join('');
}
if (grid) fetch('data/proyectos.json', { cache: 'no-store' }).then(r => r.json()).then(render)
  .catch(() => grid.innerHTML = '<p class="vacio">No se pudieron cargar los proyectos. Abrí el sitio con Live Server.</p>');

// Filtros
const filtros = document.querySelector('.filtros');
if (filtros) filtros.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  filtros.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  document.querySelectorAll('.card').forEach(c => c.hidden = !(b.dataset.f === 'todos' || c.dataset.cat === b.dataset.f));
});

// Animación de entrada
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Link activo según sección
if (menu) {
  const links = [...menu.querySelectorAll('a[href^="#"]')];
  const so = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('act', l.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(s => so.observe(s));
}