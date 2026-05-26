FROM node:18


WORKDIR /apps

COPY package*.json ./

RUN npm install
RUN npm install prom-client

RUN npm install bcryptjs
RUN apt update && apt install -y netcat-openbsd

COPY . .
RUN chmod +x start.sh
EXPOSE 4000

CMD ["./start.sh"]
