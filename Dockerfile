FROM node as builder

WORKDIR /src
COPY package.json yarn.lock ./
# RUN npm install -g yarn
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn run build
COPY .env /dist/.env

# builder

FROM node:slim

WORKDIR /src
COPY package.json yarn.lock ./
# RUN npm install -g yarn
RUN yarn install --frozen-lockfile

COPY --from=builder /src/dist ./dist

EXPOSE 3000
CMD [ "node", "dist/src/index.js" ]



