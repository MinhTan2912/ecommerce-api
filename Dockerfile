FROM node:24

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma7.config.ts ./

ARG DATABASE_URL=postgresql://ecommerce_user:ecommerce_password@postgres:5432/ecommerce_db
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate

COPY src ./src

EXPOSE 3001

CMD ["npm", "start"]