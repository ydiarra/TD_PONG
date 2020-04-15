FROM node:10.18.0-alpine3.11

RUN ls

COPY . /app

RUN cd /app && ls && npm i

EXPOSE 3000

WORKDIR /app

CMD ["npm","start"]


