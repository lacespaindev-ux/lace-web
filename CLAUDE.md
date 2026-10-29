# lacedev.com — notas para trabajar en este repo

Web de Lace, el negocio de Rubén (webs y automatizaciones para negocios locales). HTML estático publicado con GitHub Pages en el dominio lacedev.com (`CNAME`).

## Estructura
- Páginas: `index.html`, `webs.html`, `automatizaciones.html`, `trabajos.html`, `quienes-somos.html`, `contacto.html`. Cabecera y pie están repetidos en cada página: un cambio de menú o pie va en todas.
- `style.css` y `site.js` compartidos. Al cambiarlos, subir el `?v=N` de sus enlaces en todas las páginas para saltar la caché (va por `v=3`).
- Paleta: arena `#f3efe6`, verde bosque `#1f3a2e`, terracota `#b5502a`. Tipografías Bricolage Grotesque, Archivo y Space Mono.

## Contenido decidido por Rubén
- `trabajos.html`: un bloque por cliente real, con su web en directo dentro de un móvil. De momento solo El Quilombo (barelquilombo.com). Cada cliente nuevo que cierre se añade como otro bloque igual.
- El ejemplo de la web en portada, en «Así quedan las webs» y en `webs.html#en-directo` es El Quilombo (antes El Mirador, ya retirado).
- El móvil de muestra simula una pantalla de 430 px (`.phone-view iframe { width: 430px }` y `view.clientWidth / 430` en `site.js`), para que los botones de las webs de clientes salgan en línea.
- Contacto público de Lace: solo el WhatsApp 614 44 38 90. Nunca el número personal de Rubén.
- El chat de la portada usa el proxy de Cloudflare `lace-chat-proxy`; nunca poner claves de API en el código.

## Publicar
Push a `main`; GitHub Pages tarda 1-2 min y puede servir la versión anterior hasta 10 min por caché.
