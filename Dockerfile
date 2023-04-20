FROM node:18 as development
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

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
ARG DATABASE_URL
ENV NODE_ENV=${NODE_ENV}
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --only=production
RUN npx prisma db push
RUN npx prisma generate

COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma ./prisma

CMD [ "node", "dist/apps/pc-be/main.js" ]