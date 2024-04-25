FROM node:18-alpine
WORKDIR /front/
COPY public/ /front/public
COPY src/ /front/src
COPY package.json /front/
RUN npm install
CMD ["npm", "start"]