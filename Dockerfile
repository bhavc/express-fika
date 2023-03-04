FROM node as builder

WORKDIR /src
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod
COPY . .
RUN pnpm run build
COPY .env /dist/.env

# builder

FROM node:slim

WORKDIR /src
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY --from=builder /src/dist ./dist

EXPOSE 3000
CMD [ "node", "dist/src/index.js" ]



