FROM node:16

USER node

WORKDIR /usr/src/app

COPY --chown=node:node . . 

RUN npm install

ENV DEBUG=todo-backend:*

CMD PORT=3002 npm run dev
