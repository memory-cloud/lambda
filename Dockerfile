FROM node:8.10.0

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV development

CMD [ "npm", "start" ]
