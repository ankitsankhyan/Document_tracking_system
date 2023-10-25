FROM node:18-slim

# add curl for healthcheck
RUN apt-get update 

WORKDIR /usr/local/app

# have nodemon available for local dev use (file watching)

COPY package.json ./

COPY . .

RUN npm install


EXPOSE 3000

CMD ["node", "index.js"]