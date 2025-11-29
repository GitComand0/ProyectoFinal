FROM node:20-alpine
# Crea el directorio de la aplicación
WORKDIR /app
# Copia los archivos de dependencias primero
COPY package*.json ./
# Instala dependencias
RUN npm install
# Copia todo el proyecto (incluye src/, public/, etc.)
COPY . .
#Transforma el código fuente React en 
#archivos finales que el navegador puede leer directamente
RUN npm run build
#Instala globalmente el paquete serve, que es un servidor estático ligero de Node.js
RUN npm install -g serve
# Expone el puerto
EXPOSE 5000
#Comando para iniciar el servidor de desarrollo
CMD ["serve", "-s", "dist", "-l", "5000"]
#CMD ["npm", "start"]
