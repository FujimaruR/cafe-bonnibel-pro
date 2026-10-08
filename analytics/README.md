# Analítica con SQLite (contrato v1)

Servicio HTTP independiente para este repositorio, ejecutado con Node.js 24. No requiere dependencias adicionales. Las bases MySQL, PostgreSQL y Supabase existentes conservan su función; este servicio guarda solamente eventos de analítica. Se mantiene separado de los procesos de negocio para evitar que una caída de la analítica detenga pedidos o contacto.

## Ejecución local

Desde la raíz del repositorio:

```powershell
node --test analytics/server.test.mjs
node analytics/server.mjs
```

Por defecto escucha en 127.0.0.1:4100, admite el origen http://localhost:5173 y crea data/analytics.sqlite respecto al directorio de ejecución. Para personalizarlo, copia analytics/.env.example a analytics/.env, configura una ruta de archivo local válida y ejecuta `node --env-file=analytics/.env analytics/server.mjs`. Este archivo es privado e ignorado. Usa una ruta absoluta en producción.

En frontends Vite, define `VITE_ANALYTICS_URL=http://127.0.0.1:4100/events` y `VITE_ANALYTICS_IN_DEV=true` para pruebas locales; reinicia Vite. En producción usa HTTPS y deja VITE_ANALYTICS_IN_DEV=false. Sin URL no se envía ningún evento. En Arquitectura y Oficios añade en index.html `<meta name="analytics-url" content="https://TU-SERVICIO/events">` únicamente cuando exista una dirección confirmada; se deja desactivado por defecto.

## Contrato y seguridad

- POST /events acepta JSON de hasta 2048 bytes. Version: 1; UUID v4 para event_id y session_id; event_type permitido; path listado en analytics/config.json; locale es/en; form_id estable para eventos de formulario; error_code validation/network/service/configuration únicamente en errores. Rechaza cualquier campo adicional. received_at es UTC del servidor, nunca del cliente.
- Tipos: page_view, session_start, form_start, form_submit_attempt, form_validation_error, form_submit_success y form_submit_error. Un formulario simulado lleva prefijo demo- y no produce form_submit_success: no hay servicio receptor que confirme una entrega.
- Una carga inicial o un cambio de ruta produce una vista; efectos duplicados y cambios de idioma no generan otra vista. Una sesión expira tras 30 minutos de inactividad. sessionStorage guarda solo un identificador aleatorio y marcadores de eventos; si no funciona, se usa memoria. Sin fingerprinting ni identificador permanente de visitante.
- No se envían contenidos de campos, nombres, emails, teléfonos, credenciales, información médica, query/hash ni rutas desconocidas. En Alitas se excluyen las rutas administrativas y el login: el contrato cubre el sitio público.
- Reintento máximo: uno, con el mismo event_id. Timeout de 3 segundos por intento. Los errores se absorben sin bloquear la interfaz.
- SQLite usa sentencias parametrizadas, WAL, busy_timeout y migración idempotente versionada. event_id deduplica reintentos; índices únicos limitan session_start por sesión y form_start por formulario/sesión. El índice de fecha facilita la eliminación por retención.
- Orígenes exactos separados por coma en ANALYTICS_ALLOWED_ORIGINS. No admite comodín. Límite de 120 eventos por sesión/minuto y 3000 solicitudes/minuto por proceso. Estas restricciones no convierten eventos del cliente en datos confiables ni sustituyen un proxy con límites y protección contra bots.
- GET /stats exige Authorization: Bearer con ANALYTICS_ADMIN_TOKEN privado. Si no se configura, permanece cerrado. No hay panel público ni exportación de la BD. GET /health devuelve únicamente disponibilidad básica.
- Retención por defecto: 90 días; ANALYTICS_RETENTION_DAYS admite 1–3650. Eliminación al iniciar y cada hora. No se configura consentimiento en esta implementación; si se añade un flujo de consentimiento, debe habilitarse el cliente solo tras concederlo y deshabilitarse al retirarlo.

## Interpretación

Vistas son cargas/cambios de ruta, sesiones son períodos de actividad, y ninguna de estas cifras representa personas reales. No se calcula un contador de visitantes únicos estimados porque no se mantiene un identificador entre sesiones. Form_submit_success significa confirmación del servicio receptor: EmailJS aceptó el mensaje, la API creó el pedido o el servicio de pago creó su preferencia. No demuestra lectura del correo, entrega de un WhatsApp ni pago completado.

Las pruebas se excluyen por defecto mediante VITE_ANALYTICS_IN_DEV=false. Para un entorno de QA utiliza una BD y origen separados. Los bots capaces de ejecutar JavaScript no se identifican de forma fiable: se deben excluir en el proxy según el entorno, sin guardar IP en SQLite. Las cifras pueden subcontar por bloqueadores, falta de red o almacenamiento y sobrecontar por clientes manipulados.

## Producción y copias

Implementación y persistencia al reabrir la BD verificadas localmente; despliegue de producción pendiente. Los frontends con vercel.json continúan usando su configuración existente. No guardes este SQLite en una función serverless de Vercel: necesita un servicio Node de larga duración con disco persistente, más un proxy HTTPS. Propuesta concreta: mantener el frontend donde está y alojar analytics/server.mjs en un servidor propio o en un servicio con volumen persistente, con ANALYTICS_DB_PATH=/var/lib/site-analytics/events.sqlite. No se contrató ni cambió ningún proveedor.

Antes de habilitarlo en producción confirma servidor, dominio HTTPS, disco persistente, permisos del archivo, orígenes y token. Desactiva en el proxy los logs de cuerpos y query strings, y aplica la política de acceso/retención a los logs del alojamiento. Verifica escritura y reinicio del proceso en ese volumen; el código local no prueba las condiciones del proveedor.

Para respaldar SQLite mientras está activo, utiliza la API de backup de SQLite (o detén el servicio antes de copiar el archivo). No copies solo el archivo principal mientras hay escrituras WAL. Guarda copias cifradas fuera del directorio público con acceso restringido y retención definida. Prueba la restauración en otra ruta antes de usarla; conserva la copia anterior. No versiones bases ni WAL/SHM.
