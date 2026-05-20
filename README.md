# The Drop — Closet Sale App

App para organizar inventario de closet sale con amigas.

## Setup local

### 1. Instalar dependencias
```bash
npm install
```

### 2. Variables de entorno
El archivo `.env` ya tiene tus credenciales de Supabase. No lo subas a GitHub (ya está en .gitignore).

### 3. Correr en local
```bash
npm start
```
Abre http://localhost:3000

---

## Deploy en Vercel

### 1. Subir a GitHub
```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/closet-sale.git
git push -u origin main
```

### 2. Conectar Vercel
1. Ve a vercel.com e inicia sesión con GitHub
2. Clic en "Add New Project"
3. Importa el repo `closet-sale`
4. En **Environment Variables** agrega:
   - `REACT_APP_SUPABASE_URL` → tu Supabase URL
   - `REACT_APP_SUPABASE_ANON_KEY` → tu Supabase anon key
5. Clic en "Deploy"

¡Listo! Vercel te da un link tipo `https://closet-sale-xxx.vercel.app`

---

## Funcionalidades
- Agregar/editar/eliminar items con foto o emoji
- Subir fotos desde cámara o galería
- Marcar items como vendidos
- Ver total recaudado por amiga
- Dashboard global con progreso de cada amiga
- Hasta 6 amigas con colores distintos
