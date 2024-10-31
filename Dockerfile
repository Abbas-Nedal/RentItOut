# catalog/Dockerfile
FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
    curl && \
    curl -sL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs


WORKDIR /app


COPY . .


RUN npm install


EXPOSE 3000


CMD ["node", "server.js"]
