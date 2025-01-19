FROM node:alpine3.19
WORKDIR /app
RUN apk --no-cache add ca-certificates \
    && rm -rf /var/cache/apk/*
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start"]

