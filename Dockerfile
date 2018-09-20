FROM node:8.10.0

WORKDIR /opt/app

COPY package*.json ./

RUN npm install --production

COPY . .

CMD [ "npm", "start" ]
