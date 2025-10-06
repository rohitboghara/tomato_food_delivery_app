FROM node:18


WORKDIR /apps

COPY package*.json .

RUN npm install

RUN npm install bcryptjs

COPY . .

EXPOSE 4000

CMD ["node", "server.js"]
