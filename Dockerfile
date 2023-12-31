FROM node:18-alpine As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm install

RUN npm run prisma:generate

COPY --chown=node:node . .

USER node
