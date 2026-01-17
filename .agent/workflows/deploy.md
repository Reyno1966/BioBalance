---
description: Cómo desplegar la aplicación BioBalance a producción (Vercel)
---

Sigue estos pasos para poner la aplicación "en actividad" y que sea accesible para todo el mundo:

### 1. Preparar la Base de Datos (Supabase)
// turbo
1. Asegúrate de que todas las tablas estén creadas en tu proyecto de Supabase (puedes usar el archivo `backend/schema.sql`).
2. Obtén tu `SUPABASE_URL` y `SUPABASE_KEY` del panel de configuración de Supabase.

### 2. Configurar el Backend en Vercel
1. Ve a [Vercel](https://vercel.com) e importa la carpeta `backend`.
2. Añade las siguientes variables de entorno:
   - `STRIPE_SECRET_KEY`: Tu clave secreta de Stripe.
   - `STRIPE_WEBHOOK_SECRET`: El secreto del webhook de Stripe (lo obtienes tras crear el webhook en Stripe).
   - `GEMINI_API_KEY`: Tu clave de Google Gemini.
   - `SUPABASE_URL`: La URL de tu proyecto Supabase.
   - `SUPABASE_KEY`: La clave API de tu proyecto Supabase.
   - `FRONTEND_URL`: La URL final de tu frontend (ej. `https://biobalance.vercel.app`).

### 3. Configurar el Frontend en Vercel
1. Importa la carpeta `frontend` en un nuevo proyecto de Vercel.
2. Añade la variable de entorno:
   - `VITE_API_URL`: La URL que te dio Vercel para el proyecto del **backend**.
3. Vercel detectará Automáticamente el comando de build (`npm run build`).

### 4. Configurar Stripe Webhook
1. En el panel de Stripe, crea un Webhook que apunte a `https://tu-backend.vercel.app/api/payment/webhook`.
2. Selecciona el evento `checkout.session.completed`.

### 5. ¡Promocionar!
Una vez desplegado, puedes compartir tu URL del frontend. La aplicación ya es multi-idioma y está optimizada para SEO.
