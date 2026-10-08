# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## Implementación de las instrucciones (octubre de 2026)

Se conserva la identidad y el contenido existente de esta variante de Café Bonnibel. El formulario de contacto simulado valida sus campos, evita recargar la página y muestra una confirmación explícita de simulación. Zustand y Supabase se conservan; el checkout valida datos de entrega, evita envíos repetidos y diferencia errores de red/servicio. Crear una preferencia de pago no demuestra un pago completado. Las funciones remotas de pago no están incluidas en este repositorio y necesitan su entorno configurado para verificarse.

La interfaz admite Español / English desde un selector accesible. Se recuerda la elección cuando el navegador permite almacenamiento; sin elección usa un idioma soportado del navegador y español como alternativa. Se actualizan lang, título y descripción. El cambio conserva rutas, filtros, carrito y campos. Los catálogos están en src/site/catalog.json; las claves son estables y las traducciones de contenido existente no modifican identificadores, precios ni bases de negocio. Contenido procedente de la API fuera del catálogo se conserva: nuevos productos o mensajes requieren sus traducciones correspondientes.

### Instalación y verificación

Desde la raíz del repositorio:

```powershell
npm ci
npm run dev
npm run lint
npm run build
npm run test:i18n
npm run test:analytics
```

En entornos Windows donde el empaquetador de la configuración de Vite da Access is denied, se verificó npm run build -- --configLoader runner; esto no modifica el stack ni sus dependencias.

### Analítica y límites

Consulta [contrato, variables, ejecución, persistencia y copias de seguridad](./analytics/README.md). El servicio SQLite y sus pruebas están en analytics/ en la raíz del repositorio. Analítica desactivada hasta configurar su URL. La persistencia de producción, HTTPS y el alojamiento están pendientes de confirmar; no se publicaron cambios ni se contrataron servicios.
