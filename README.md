# 🎨 Magic Reading

Una aplicación educativa interactiva que genera cuentos personalizados para niños de 6-12 años utilizando IA, con preguntas de comprensión lectora y sistema de progreso adaptativo.

## ✨ Características

- 📚 Generación de cuentos educativos con OpenAI (GPT-3.5/4)
- 🎭 Personajes animados con Lottie
- 📊 Sistema de niveles adaptativos (Básico, Intermedio, Avanzado)
- ❓ Preguntas de comprensión lectora interactivas
- 📈 Seguimiento de progreso y estadísticas
- 🎨 Interfaz colorida y atractiva para niños
- 📱 Diseño responsive (móvil y desktop)

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + React 19
- **Styling**: Tailwind CSS
- **Animaciones**: Framer Motion 11.x + Lottie React
- **Base de datos**: Firebase Firestore
- **IA**: OpenAI API (GPT-3.5-turbo)
- **Estado**: Zustand
- **Notificaciones**: React Hot Toast
- **Deployment**: Vercel

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta en Firebase
- API Key de OpenAI

### Pasos de instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd magic-reading
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto:
```bash
# OpenAI
OPENAI_API_KEY=sk-tu-api-key-aqui

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

4. **Configurar Firebase**

- Ve a [Firebase Console](https://console.firebase.google.com/)
- Crea un nuevo proyecto
- Activa Firestore Database
- Copia las credenciales al `.env.local`

5. **Configurar OpenAI**

- Ve a [OpenAI Platform](https://platform.openai.com/)
- Crea una API Key
- Agrégala al `.env.local`

6. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🚀 Deployment en Vercel

### Opción 1: Deploy desde GitHub

1. **Sube tu código a GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <tu-repo-url>
git push -u origin main
```

2. **Conecta con Vercel**
- Ve a [vercel.com](https://vercel.com)
- Click en "New Project"
- Importa tu repositorio de GitHub
- Vercel detectará automáticamente Next.js

3. **Configura las variables de entorno**
- En el dashboard de Vercel, ve a Settings → Environment Variables
- Agrega todas las variables de tu `.env.local`
- Guarda los cambios

4. **Deploy automático**
- Click en "Deploy"
- Vercel construirá y desplegará tu app
- Recibirás una URL de producción

### Opción 2: Deploy desde CLI

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Login en Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Deploy a producción**
```bash
vercel --prod
```

### Configurar dominio personalizado (Opcional)

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Agrega tu dominio personalizado
4. Configura los DNS según las instrucciones

## 📂 Estructura del Proyecto
```
magic-reading/
├── src/
│   ├── app/                    # Pages (App Router)
│   │   ├── api/               # API Routes
│   │   │   ├── generar-cuento/
│   │   │   ├── guardar-progreso/
│   │   │   ├── obtener-progreso/
│   │   │   └── historial/
│   │   ├── cuento/            # Página del cuento
│   │   ├── preguntas/         # Página de preguntas
│   │   ├── progreso/          # Página de estadísticas
│   │   ├── layout.jsx         # Layout principal
│   │   ├── page.jsx           # Home page
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes React
│   │   ├── ui/                # Componentes UI reutilizables
│   │   ├── AnimatedCharacter.jsx
│   │   ├── CuentoDisplay.jsx
│   │   ├── NivelSelector.jsx
│   │   ├── PreguntaCard.jsx
│   │   └── ProgresoChart.jsx
│   ├── lib/                   # Librerías y utilidades
│   │   ├── db/                # Base de datos
│   │   │   ├── firebase.js
│   │   │   └── models.js
│   │   ├── openai.js          # Integración OpenAI
│   │   ├── prompts.js         # Prompts para IA
│   │   └── utils.js           # Funciones auxiliares
│   └── store/                 # Estado global (Zustand)
│       └── useStore.js
├── public/
│   └── animations/            # Animaciones Lottie
├── .env.local                 # Variables de entorno (NO subir a Git)
├── .env.example              # Ejemplo de variables
├── next.config.js            # Configuración Next.js
├── tailwind.config.js        # Configuración Tailwind
└── package.json              # Dependencias
```

## 🔧 Scripts Disponibles
```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint
```

## 🎨 Personalización

### Cambiar colores del tema

Edita `/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: { /* tus colores */ },
      secondary: { /* tus colores */ },
    }
  }
}
```

### Agregar más personajes animados

1. Descarga animaciones de [LottieFiles](https://lottiefiles.com/)
2. Guarda los archivos `.json` en `/public/animations/`
3. Actualiza el mapeo en `/src/components/AnimatedCharacter.jsx`

### Modificar niveles de dificultad

Edita `/src/lib/prompts.js` para ajustar:
- Vocabulario
- Longitud de oraciones
- Número de preguntas
- Complejidad de las historias

## 🔒 Seguridad

- ✅ API Keys están en variables de entorno
- ✅ Nunca se exponen en el cliente
- ✅ Firebase Rules deben configurarse apropiadamente
- ✅ Rate limiting en API Routes (opcional pero recomendado)

### Configurar Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Los usuarios solo pueden leer/escribir sus propios datos
    match /usuarios/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /progreso/{progresoId} {
      allow read, write: if request.auth != null;
    }
    
    match /cuentos/{cuentoId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🐛 Troubleshooting

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Firebase not initialized"
- Verifica que todas las variables `NEXT_PUBLIC_FIREBASE_*` estén configuradas
- Asegúrate de que el proyecto Firebase esté activo

### Error: "OpenAI API rate limit"
- Verifica que tu API Key tenga créditos
- Implementa rate limiting o caching

### Build falla en Vercel
- Revisa los logs en Vercel dashboard
- Asegúrate de que todas las variables de entorno estén configuradas
- Verifica la versión de Node.js (debe ser 18+)

## 📈 Próximas Mejoras

- [ ] Sistema de autenticación completo
- [ ] Modo offline (PWA)
- [ ] Más tipos de preguntas (relacionar, ordenar, etc.)
- [ ] Sistema de recompensas y badges
- [ ] Compartir cuentos favoritos
- [ ] Modo multijugador
- [ ] Síntesis de voz para leer cuentos
- [ ] Soporte para más idiomas

## 📄 Licencia

Este proyecto está bajo licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📧 Contacto

Para preguntas o sugerencias, abre un issue en GitHub.

---

Hecho con 💜 para niños curiosos