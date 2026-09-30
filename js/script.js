// ===== FILTRO DE PROYECTOS =====
const botones = document.querySelectorAll('.filtro-btn');
const tarjetas = document.querySelectorAll('.proyecto-card');

botones.forEach(boton => {
  boton.addEventListener('click', () => {
    // 1. sacar clase "activo" de todos, ponérsela solo al clickeado
    botones.forEach(b => {
      b.classList.remove('activo');
      b.setAttribute('aria-pressed', 'false');
    });
    boton.classList.add('activo');
    boton.setAttribute('aria-pressed', 'true');

    const filtro = boton.dataset.filtro;

    // 2. mostrar/ocultar tarjetas según categoría
    //    (data-categoria puede tener varias: "python sql")
    tarjetas.forEach(tarjeta => {
      const categorias = (tarjeta.dataset.categoria || '').split(' ');
      const visible = filtro === 'todos' || categorias.includes(filtro);
      // '' devuelve el display original del CSS (flex); no usar 'block'
      tarjeta.style.display = visible ? '' : 'none';
    });
  });
});


// ===== MENÚ HAMBURGUESA (mobile) =====
const hamburguesa = document.querySelector('.hamburguesa');
const navLinks = document.querySelector('.navbar-links');

if (hamburguesa && navLinks) {
  const cerrarMenu = () => {
    navLinks.classList.remove('activo');
    hamburguesa.setAttribute('aria-expanded', 'false');
  };

  hamburguesa.addEventListener('click', () => {
    const abierto = navLinks.classList.toggle('activo');
    hamburguesa.setAttribute('aria-expanded', String(abierto));
  });

  // Se cierra al elegir una sección o al apretar Escape
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', cerrarMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarMenu();
  });
}


// ===== ANIMACIONES AL HACER SCROLL =====
const animables = document.querySelectorAll('.animar-entrada');
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !sinMovimiento) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);   // ya apareció, deja de observarlo
      }
    });
  }, { threshold: 0.15 });

  animables.forEach(el => observer.observe(el));
} else {
  // Sin soporte o con "reducir movimiento": mostrar todo de una vez
  animables.forEach(el => el.classList.add('visible'));
}


// ===== AÑO AUTOMÁTICO EN EL FOOTER =====
const anio = document.getElementById('anio');
if (anio) anio.textContent = new Date().getFullYear();


// ===== FORMULARIO DE CONTACTO (Formspree, sin salir de la página) =====
const form = document.querySelector('.contacto-form');
const estado = document.querySelector('.form-estado');

if (form && estado) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const boton = form.querySelector('button[type="submit"]');
    boton.disabled = true;
    boton.textContent = 'Enviando...';
    estado.className = 'form-estado';
    estado.textContent = '';

    try {
      const respuesta = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!respuesta.ok) throw new Error('Error de envío');

      estado.textContent = '¡Mensaje enviado! Te respondo pronto.';
      estado.classList.add('ok');
      form.reset();
    } catch (error) {
      estado.textContent = 'No se pudo enviar. Probá de nuevo o escribime por email.';
      estado.classList.add('error');
    } finally {
      boton.disabled = false;
      boton.textContent = 'Enviar mensaje';
    }
  });
}