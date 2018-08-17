FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ./ ./
RUN npm install

CMD ["node", "dist/index.js"]