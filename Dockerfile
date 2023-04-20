ARG DATABASE_URL

FROM node:18 as development

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
# COPY .env.docker ./prisma/.env


RUN npm install
RUN npx prisma db push
RUN npx prisma generate

COPY . .

RUN npm run build:be

CMD [ "node", "dist/apps/pc-be/main.js" ]

FROM node:18 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --only=production
RUN npx prisma db push
RUN npx prisma generate

COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma ./prisma

CMD [ "node", "dist/apps/pc-be/main.js" ]