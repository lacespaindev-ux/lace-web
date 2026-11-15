/* Auditoría gratis de Lace: todo se calcula en el navegador, no se envía ni guarda nada. */
(function () {
  var WA = "34614443890";
  var $ = function (id) { return document.getElementById(id); };

  var TYPES = [
    { v: "bar", t: "Bar, cafetería o restaurante" },
    { v: "belleza", t: "Peluquería, barbería o estética" },
    { v: "salud", t: "Clínica, fisio o dentista" },
    { v: "tienda", t: "Tienda o comercio" },
    { v: "oficios", t: "Reformas u oficios" },
    { v: "otro", t: "Otro tipo de negocio" }
  ];
  var CITAS = { bar: 1, belleza: 1, salud: 1, otro: 1 };

  function info(type) {
    if (type === "bar") return "tu carta con precios";
    if (type === "oficios") return "tus trabajos y cómo pedir presupuesto";
    return "tus servicios y precios";
  }
  function cliente(type) { return type === "salud" ? "paciente" : "cliente"; }

  // Cada pregunta puntuable vale de 0 a 3. area: encontrar | escribir | volver
  function questions(type) {
    var q = [
      { key: "type", q: "¿Qué tipo de negocio tienes?", help: "Así adaptamos las preguntas y los consejos.", opts: TYPES },
      { key: "web", area: "encontrar", q: "¿Tu negocio tiene página web propia?", help: "Una web tuya, no solo un perfil en redes.", opts: [
        { v: 3, t: "Sí, y la tengo al día" },
        { v: 1, t: "Sí, pero está vieja o no la toco nunca" },
        { v: 0, t: "No, solo Instagram o Facebook" },
        { v: 0, t: "No tengo nada en internet" } ] },
      { key: "google", area: "encontrar", q: "Si alguien busca tu negocio en Google, ¿le sale tu ficha con fotos, horario y reseñas?", help: "Es lo que aparece a la derecha en Google o en Google Maps.", opts: [
        { v: 3, t: "Sí, completa y con el horario bien" },
        { v: 1, t: "Sale, pero incompleta o con datos viejos" },
        { v: 0, t: "No lo sé" },
        { v: 0, t: "No aparezco" } ] },
      { key: "info", area: "encontrar", q: "¿Se puede ver " + info(type) + " desde el móvil?", help: "Sin tener que llamarte ni ampliar una foto borrosa.", opts: [
        { v: 3, t: "Sí, en mi web, y se lee bien" },
        { v: 1, t: "Solo en fotos, en Instagram o en Google" },
        { v: 0, t: "No, hay que preguntar" } ] },
      { key: "contacto", area: "escribir", q: "Cuando alguien quiere " + (CITAS[type] ? "reservar o pedir cita" : "pedirte algo") + ", ¿cómo te contacta?", help: "Piensa en alguien que te descubre hoy en el móvil.", opts: [
        { v: 3, t: "Tiene un botón de WhatsApp o llamada a un toque" },
        { v: 1, t: "Tiene que buscar mi número y copiarlo" },
        { v: 0, t: "Solo por mensaje de Instagram o viniendo al local" } ] },
      { key: "respuesta", area: "escribir", q: "Si te escriben mientras trabajas o fuera de horario, ¿qué pasa?", help: "Sé sincero: nadie te va a juzgar.", opts: [
        { v: 3, t: "Contesto casi al momento" },
        { v: 1, t: "Tardo unas horas" },
        { v: 0, t: "Muchos mensajes los veo tarde o se quedan sin contestar" } ] }
    ];
    if (CITAS[type]) {
      q.push({ key: "plantones", area: "volver", q: "¿Hay gente que " + (type === "bar" ? "reserva mesa" : "pide cita") + " y luego no aparece?", help: "Lo que se suele llamar «plantones» o huecos perdidos.", opts: [
        { v: 3, t: "Casi nunca" },
        { v: 1, t: "Alguna vez al mes" },
        { v: 0, t: "Todas las semanas" } ] });
    } else {
      q.push({ key: "resenas", area: "volver", q: "¿Pides a tus clientes que te dejen una reseña en Google?", help: "Las reseñas son lo que más convence a quien no te conoce.", opts: [
        { v: 3, t: "Sí, casi siempre" },
        { v: 1, t: "A veces, cuando me acuerdo" },
        { v: 0, t: "Nunca" } ] });
    }
    return q;
  }

  // Qué decir de cada fallo: título, por qué importa, hazlo tú, y lo que hace Lace
  function fix(key, val, type) {
    var c = cliente(type);
    var F = {
      web: {
        t: val === 1 ? "Tu web no está trabajando para ti" : "No tienes una web propia",
        why: "Quien te busca por primera vez mira el móvil antes de ir. Si no encuentra una web clara con lo básico, elige al de al lado.",
        diy: "Apunta en un papel lo que más te preguntan (horario, " + (type === "bar" ? "carta" : "precios") + ", dónde estás, cómo reservar). Eso es lo que tiene que tener tu web.",
        lace: "Te hacemos la web con todo eso y te la enseñamos terminada antes de pagar.", link: "webs.html" },
      google: {
        t: "Tu ficha de Google está floja",
        why: "La mayoría de " + c + "s nuevos te encuentran en Google Maps. Una ficha sin fotos ni horario transmite que el negocio está cerrado o descuidado.",
        diy: "Entra en business.google.com, reclama tu ficha si no es tuya y completa horario, teléfono, 10 fotos buenas y una descripción de dos líneas.",
        lace: "Te dejamos la ficha completa y conectada con tu web y tu WhatsApp.", link: "webs.html" },
      info: {
        t: "No se puede ver " + info(type) + " fácilmente",
        why: "Si para saber un precio hay que llamarte o ampliar una foto, mucha gente se va sin preguntar.",
        diy: "Pasa " + info(type) + " a texto (no foto) y súbelo a tu ficha de Google y a tu bio de Instagram.",
        lace: "Lo ponemos en tu web, bien ordenado y fácil de cambiar cuando subas precios.", link: "webs.html" },
      contacto: {
        t: "Cuesta demasiado contactarte",
        why: "Cada paso de más (copiar un número, buscar dónde escribirte) hace que alguien abandone.",
        diy: "Pon un enlace de WhatsApp (wa.me/tu-número) en tu bio de Instagram y en tu ficha de Google.",
        lace: "Botón de WhatsApp y llamada en cada pantalla de tu web, con el mensaje ya escrito.", link: "webs.html" },
      respuesta: {
        t: "Se te escapan mensajes",
        why: "Quien escribe y no recibe respuesta en un rato suele preguntar a otro negocio. Fuera de horario es cuando más se pierde.",
        diy: "Activa WhatsApp Business y configura un mensaje de ausencia con tu horario y " + info(type) + ".",
        lace: "Las preguntas de siempre se contestan solas al momento, también de madrugada. Una semana de prueba gratis.", link: "automatizaciones.html" },
      plantones: {
        t: "Pierdes " + (type === "bar" ? "mesas" : "citas") + " por plantones",
        why: "Cada hueco vacío es dinero que no vuelve. La mayoría de plantones son olvidos, no mala fe.",
        diy: "El día antes, manda a mano un WhatsApp corto a cada " + (type === "bar" ? "reserva" : c) + " para confirmar.",
        lace: "Ese recordatorio sale solo el día antes y te avisa de quién confirma y quién no.", link: "automatizaciones.html" },
      resenas: {
        t: "Te faltan reseñas",
        why: "Antes de llamarte, la gente mira cuántas estrellas tienes y qué dicen otros. Pocas reseñas pesan más que un buen precio.",
        diy: "Saca de tu ficha de Google el enlace «Pedir reseñas» y mándaselo por WhatsApp a tus 10 mejores clientes esta semana.",
        lace: "Tras cada trabajo, tu cliente recibe un WhatsApp con el enlace para dejar la reseña.", link: "automatizaciones.html" }
    };
    return F[key];
  }

  var AREAS = {
    encontrar: "Que te encuentren",
    escribir: "Que te escriban",
    volver: "Que vuelvan"
  };

  var state = { name: "", i: 0, a: {} , qs: questions("otro") };

  function show(id) {
    ["audIntro", "audQuiz", "audResult"].forEach(function (s) { $(s).classList.toggle("is-on", s === id); });
    var card = $("audCard");
    var top = card.getBoundingClientRect().top + window.scrollY - 96;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
  }

  function render() {
    var q = state.qs[state.i];
    var n = state.qs.length;
    $("audNum").textContent = "Pregunta " + (state.i + 1) + " de " + n;
    $("audBar").style.width = (state.i / n * 100) + "%";
    $("audQ").textContent = q.q;
    $("audHelp").textContent = q.help || "";
    var box = $("audOpts");
    box.innerHTML = "";
    q.opts.forEach(function (o, idx) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "aud-opt";
      b.setAttribute("role", "radio");
      var chosen = state.a[q.key] && state.a[q.key].idx === idx;
      b.setAttribute("aria-checked", chosen ? "true" : "false");
      if (chosen) b.classList.add("is-sel");
      b.innerHTML = '<span class="aud-dot" aria-hidden="true"></span><span></span>';
      b.lastChild.textContent = o.t;
      b.addEventListener("click", function () { pick(q, o, idx, b); });
      box.appendChild(b);
    });
    $("audBack").style.visibility = state.i === 0 ? "hidden" : "visible";
  }

  function pick(q, o, idx, btn) {
    state.a[q.key] = { v: o.v, idx: idx, t: o.t };
    if (q.key === "type") {
      var keep = state.a;
      state.qs = questions(o.v);
      // si cambia el tipo, la última pregunta puede ser otra: borrar respuestas que ya no existan
      var valid = {};
      state.qs.forEach(function (x) { valid[x.key] = 1; });
      Object.keys(keep).forEach(function (k) { if (!valid[k]) delete keep[k]; });
    }
    Array.prototype.forEach.call($("audOpts").children, function (c) { c.classList.remove("is-sel"); c.setAttribute("aria-checked", "false"); });
    btn.classList.add("is-sel");
    btn.setAttribute("aria-checked", "true");
    setTimeout(function () {
      if (state.i < state.qs.length - 1) { state.i++; render(); }
      else result();
    }, 220);
  }

  function result() {
    var type = state.a.type.v;
    var total = 0, max = 0, area = {}, gaps = [];
    state.qs.forEach(function (q, order) {
      if (!q.area) return;
      var v = state.a[q.key].v;
      total += v; max += 3;
      area[q.area] = area[q.area] || { got: 0, max: 0 };
      area[q.area].got += v; area[q.area].max += 3;
      if (v < 3) gaps.push({ key: q.key, v: v, gap: 3 - v, order: order });
    });
    var pts = Math.round(total / max * 100);

    // Nota
    $("audPts").textContent = pts;
    $("audRing").style.setProperty("--p", 0);
    requestAnimationFrame(function () { setTimeout(function () { $("audRing").style.setProperty("--p", pts); }, 60); });
    $("audRing").dataset.level = pts < 40 ? "low" : pts < 70 ? "mid" : "high";
    $("audFor").textContent = state.name ? "Resultado de " + state.name : "Tu resultado";
    var verdict, txt;
    if (pts < 40) { verdict = "Estás perdiendo clientes cada semana"; txt = "Ahora mismo, a quien te busca por internet le cuesta encontrarte y escribirte. La buena noticia: es lo más fácil de arreglar y se nota enseguida."; }
    else if (pts < 70) { verdict = "Vas bien, pero se te escapan clientes"; txt = "Tienes lo básico, pero hay huecos por los que se van clientes que ya te habían encontrado. Con tres cambios lo notas."; }
    else if (pts < 100) { verdict = "Lo tienes bastante bien montado"; txt = "Tu negocio está por encima de la mayoría. Quedan detalles que te pueden ahorrar tiempo o traer algún cliente más."; }
    else { verdict = "Lo tienes perfecto"; txt = "Tu negocio está muy bien montado en internet. Si quieres ahorrar tiempo con WhatsApp automático, cuéntanos."; }
    $("audVerdict").textContent = verdict;
    $("audVerdictTxt").textContent = txt;

    // Áreas
    var ah = "";
    ["encontrar", "escribir", "volver"].forEach(function (k) {
      if (!area[k]) return;
      var p = Math.round(area[k].got / area[k].max * 100);
      var lvl = p < 40 ? "low" : p < 70 ? "mid" : "high";
      ah += '<div class="aud-area" data-level="' + lvl + '"><div class="aud-area-top"><span>' + AREAS[k] + '</span><b>' + p + '%</b></div><div class="aud-meter"><i style="width:' + p + '%"></i></div></div>';
    });
    $("audAreas").innerHTML = ah;

    // Prioridades: primero lo que más falla; a igualdad, lo más básico (orden de las preguntas)
    gaps.sort(function (a, b) { return b.gap - a.gap || a.order - b.order; });
    var top = gaps.slice(0, 3);
    var fh = "";
    top.forEach(function (g, n) {
      var f = fix(g.key, g.v, type);
      fh += '<article class="aud-fix"><span class="aud-fix-n">' + (n + 1) + '</span><div><h4>' + esc(f.t) + '</h4><p>' + esc(f.why) + '</p>' +
        '<p class="aud-diy"><b>Hazlo tú hoy:</b> ' + esc(f.diy) + '</p>' +
        '<p class="aud-lace"><b>O te lo hacemos:</b> ' + esc(f.lace) + ' <a href="' + f.link + '">Ver cómo →</a></p></div></article>';
    });
    if (!top.length) fh = '<article class="aud-fix"><span class="aud-fix-n">✓</span><div><h4>Nada urgente</h4><p>No hemos encontrado ningún fallo importante. Sigue así.</p></div></article>';
    $("audFixes").innerHTML = fh;

    // Plan de 7 días
    var plan = [];
    if (top[0]) plan.push(["Días 1 y 2", fix(top[0].key, top[0].v, type).diy]);
    if (top[1]) plan.push(["Días 3 y 4", fix(top[1].key, top[1].v, type).diy]);
    if (top[2]) plan.push(["Días 5 y 6", fix(top[2].key, top[2].v, type).diy]);
    plan.push(["Día 7", "Pregunta a los 5 próximos " + cliente(type) + "s nuevos cómo te han encontrado. Así sabrás qué está funcionando."]);
    $("audPlan").innerHTML = plan.map(function (p) { return '<li><span class="aud-day">' + p[0] + '</span><p>' + esc(p[1]) + '</p></li>'; }).join("");

    // WhatsApp con el resultado
    var tipo = TYPES.filter(function (t) { return t.v === type; })[0].t.toLowerCase();
    var msg = "Hola, he hecho la auditoría gratis de lacedev.com.\n" +
      (state.name ? "Negocio: " + state.name + " (" + tipo + ")\n" : "Tipo de negocio: " + tipo + "\n") +
      "Nota: " + pts + "/100\n" +
      (top.length ? "Lo que más me falla:\n" + top.map(function (g) { return "- " + fix(g.key, g.v, type).t; }).join("\n") + "\n" : "") +
      "¿Me preparáis una muestra gratis?";
    $("audWa").href = "https://wa.me/" + WA + "?text=" + encodeURIComponent(msg);

    $("audBar").style.width = "100%";
    show("audResult");
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  $("audStart").addEventListener("submit", function (e) {
    e.preventDefault();
    state.name = $("audName").value.trim().slice(0, 80);
    state.i = 0;
    render();
    show("audQuiz");
  });
  $("audBack").addEventListener("click", function () { if (state.i > 0) { state.i--; render(); } });
  $("audAgain").addEventListener("click", function () {
    state = { name: state.name, i: 0, a: {}, qs: questions("otro") };
    render();
    show("audQuiz");
  });
})();
