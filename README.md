# Panel de Administración para Restaurante

## Descripción
Sistema completo de pedidos para restaurante con panel de administración, backend Node.js, base de datos MongoDB y frontend integrado.

## Instalación

### 1. Instalar Node.js
Descarga e instala Node.js desde https://nodejs.org/

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar MongoDB
#### Opción 1: MongoDB Local (desarrollo)
1. Instala MongoDB Community Server desde https://www.mongodb.com/try/download/community
2. Inicia el servicio: `Start-Service MongoDB` (Windows)
3. MONGO_URI: `mongodb://localhost:27017/restaurante`

#### Opción 2: MongoDB Atlas (producción/despliegue)
1. Crea cuenta en https://www.mongodb.com/atlas
2. Crea un cluster gratuito
3. Crea usuario de BD y whitelist IP (0.0.0.0/0 para acceso global)
4. Obtén la connection string y actualiza MONGO_URI en .env
   Ejemplo: `mongodb+srv://usuario:password@cluster.mongodb.net/restaurante?retryWrites=true&w=majority`

### 4. Configurar variables de entorno
Edita `.env` con tus valores:
- MONGO_URI: URL de conexión a MongoDB
- JWT_SECRET: Secreto para JWT
- ADMIN_USER: Usuario admin
- ADMIN_PASS: Contraseña admin

### 5. Poblar base de datos
```bash
npm run seed
```
Si da error de conexión, asegúrate de que MongoDB esté corriendo.

### 6. Correr backend
Para desarrollo:
```bash
npm start
```

Para producción (siempre corriendo):
```bash
npm install -g pm2
pm2 start server.js --name restaurante-app
pm2 save
```

Para reiniciar automáticamente al encender la PC, crea un acceso directo al archivo `iniciar_servidor.bat` en la carpeta de Inicio de Windows:
- Presiona Win+R, escribe `shell:startup`
- Copia el archivo `iniciar_servidor.bat` ahí

### 7. Abrir frontend
Abre `index.html` en el navegador para la web del restaurante.

### 8. Abrir panel admin
Ve a `admin/login.html` en el navegador.


## Conexión Frontend-Backend
El frontend envía pedidos a `http://localhost:3000/pedido` al confirmar.
El backend guarda en MongoDB y actualiza stock automáticamente.
Productos sin stock se ocultan del menú público.

## API Endpoints
- POST /login: Login admin
- GET /pedidos: Obtener pedidos (autenticado)
- POST /pedido: Crear pedido
- GET /productos: Obtener productos
- PUT /producto/stock/:id: Actualizar stock (autenticado)
- GET /estadisticas: Obtener estadísticas (autenticado)

## Mejoras Futuras
- Notificaciones push para nuevos pedidos
- Integración con MercadoPago para pagos online
- App móvil para repartidores con geolocalización</content>
<parameter name="filePath">c:\FELIPE\proyectos random\pitzas\Opcion 3\README.md