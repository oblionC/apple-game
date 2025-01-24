FROM node:alpine3.19 AS build-env
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"] 
