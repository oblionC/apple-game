FROM node:alpine3.19 AS build-env
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

ARG VITE_BACKEND_URL
ARG VITE_SOCKET_URL

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}

RUN npm run build

FROM nginx
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /app/dist .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"] 
