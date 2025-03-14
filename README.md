# Sumfight

A real-time web based multiplayer game built on NodeJS using ReactJS, Express and Socket.io.  
![Sumfight Demo gif](/assets/sumfight.gif)  

## To run the app locally using Docker Compose:
- Ensure you have docker installed: 
- Clone the repository:
```
    git clone https://github.com/oblionC/apple-game.git
    cd apple-game
```
- Run docker compose:
```
    docker compose build
    docker compose up
```

## To run each app in development:

### Backend:
- Once cloned, change directory to backend:
```
    cd backend
```
- Install node dependencies:
```
    npm i
```
- Create a .env file with the following values:
```
    MONGODB_URI = "your mongodb endpoint uri"
    JWT_SECRET = "yourjwtsecret"
```
- Run the app:
```
    npm run dev
```

### Frontend:
- Once cloned, change directory to frontend:
```
    cd frontend 
```
- Install node dependencies:
```
    npm i
```
- Create a .env file with the following values:
```
    VITE_BACKEND_URL = "http://localhost:3000"
    VITE_SOCKET_URL = "http://localhost:4000"
```
- Run the app:
```
    npm run dev

### Socket server:
- Once cloned, change directory to socket server:
```
    cd socketio_server 
```
- Install node dependencies:
```
    npm i
```
- Create a .env file with the following values:
```
    BACKEND_URL = "http://localhost:3000"
    REDIS_URL = "endpoint for your redis instance"
    ENABLE_TLS = false
```
- Run the app:
```
    npm run dev
```

### Note: 
If you want a Redis instance, your best option would be to run a docker instance of redis locally:
```
    docker pull redis
    docker run -d -p 6379:6379 redis 
```
And set REDIS_URL to "redis://localhost:6379"   

For a MonogDB instance, you can use MongoDB Atlas: https://www.mongodb.com/products/platform/atlas-database.  
Alternatively, you can also run a mongo instance locally:
```
    docker pull mongo
    docker run -d -p 27017:27017 mongo
```
And set MONGODB_URI to "mongodb://localhost:27017"


