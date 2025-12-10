##########################
# STAGE 1: build React app
##########################
FROM node:18-alpine AS build

# Directory di lavoro dentro il container
WORKDIR /app/frontend

# Copio solo file di dipendenze per sfruttare la cache Docker
COPY ./gym-fe-app/package*.json ./

# Installo le dipendenze
# Se c'è package-lock.json uso npm ci, altrimenti npm install
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copio il resto del codice dell'app
COPY ./gym-fe-app/ .

# Ottimizzazioni per build di produzione
ENV NODE_ENV=production
# Evita che react-scripts lanci eslint in build (non ti serve in prod e ti evita errori stupidi)
ENV DISABLE_ESLINT_PLUGIN=true

# Build dell'app React
RUN npm run build

##########################
# STAGE 2: nginx
##########################
FROM nginx:stable-alpine

# Copio i file statici buildati nella root servita da nginx
COPY --from=build /app/frontend/build /usr/share/nginx/html

# Espongo la porta 80
EXPOSE 80

# Comando di avvio di nginx
CMD ["nginx", "-g", "daemon off;"]
