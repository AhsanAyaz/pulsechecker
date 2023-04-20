FROM node:16 as development

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
# COPY .env.docker ./prisma/.env


RUN npm install

COPY . .

RUN npm run build:be

CMD [ "node", "dist/apps/pc-be/main.js" ]

FROM node:16 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma ./prisma


CMD [ "node", "dist/apps/pc-be/main.js" ]