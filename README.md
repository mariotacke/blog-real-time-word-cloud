# Building a real-time word cloud from Twitch.tv chat with Node.js and Redis

This is a sample repository to demonstrate real-time aggregation of keywords 
from Twitch.tv chat with Redis.

## Usage
Copy `.env.example` to `.env` and modify the values as necessary before starting 
nodemon. Also, Redis needs to be running for keyword aggregation. The project
includes a `docker-compose.yml` file with the service definition.

```
# start redis
docker-compose up -d

# install and start node server
npm install
npm start
```

Open http://localhost:8080.