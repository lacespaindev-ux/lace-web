# lacedev.com — notas para trabajar en este repo

Web de Lace, el negocio de Rubén (webs y automatizaciones para negocios locales). HTML estático publicado con GitHub Pages en el dominio lacedev.com (`CNAME`).

## Estructura
- Páginas: `index.html`, `webs.html`, `automatizaciones.html`, `trabajos.html`, `quienes-somos.html`, `contacto.html`. Cabecera y pie están repetidos en cada página: un cambio de menú o pie va en todas.
- `style.css` y `site.js` compartidos. Al cambiarlos, subir el `?v=N` de sus enlaces en todas las páginas para saltar la caché (`style.css` va por `v=9`, `site.js` por `v=6`).
- Paleta: arena `#f3efe6`, verde bosque `#1f3a2e`, terracota `#b5502a`. Tipografías Bricolage Grotesque, Archivo y Space Mono.

## Contenido decidido por Rubén
- `trabajos.html`: un bloque por cliente real, con su web en directo dentro de un móvil. Es un carrusel horizontal de móviles (`.work-rail`, una `.work-slide` por cliente): El Quilombo, La Parada de Hoyo y La Campana Asador. Cada cliente nuevo que cierre se añade como otra `.work-slide`.
- El ejemplo de la web en portada, en «Así quedan las webs» y en `webs.html#en-directo` es El Quilombo (antes El Mirador, ya retirado).
- El móvil de muestra simula una pantalla de 430 px (`.phone-view iframe { width: 430px }` y `view.clientWidth / 430` en `site.js`), para que los botones de las webs de clientes salgan en línea.
- Contacto público de Lace: solo el WhatsApp 614 44 38 90. Nunca el número personal de Rubén.
- El chat de la portada usa el proxy de Cloudflare `lace-chat-proxy`; nunca poner claves de API en el código.

- `auditoria.html` + `auditoria.js`: auditoría gratis de 7 preguntas (la primera es el tipo de negocio y adapta el resto). Todo se calcula en el navegador, no se guarda nada; al final da nota /100, 3 áreas, 3 prioridades con «Hazlo tú» y «O te lo hacemos», plan de 7 días y botón que manda el resultado al WhatsApp de Lace. Enlazada en el mega menú, el pie y un bloque de la portada (`#auditoria`). Estilos al final de `style.css` (prefijo `.aud-`).

## Publicar
Push a `main`; GitHub Pages tarda 1-2 min y puede servir la versión anterior hasta 10 min por caché.
