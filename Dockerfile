# Seleccionamos la imagen base de Node.js con la versión deseada
FROM node:14-alpine

# Definimos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos del proyecto al contenedor
COPY . .

# Instalamos las dependencias
RUN npm install --production
RUN npm install -g @adonisjs/cli

# Exponemos el puerto 3333, utilizado por Adonis
EXPOSE 3333

# Ejecutamos el comando para iniciar la aplicación
CMD ["npm", "start"]
