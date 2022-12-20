FROM ubuntu:22.04
RUN apt update
RUN apt-get -y install nodejs
RUN apt-get -y install npm
WORKDIR /usr/src/app
COPY package*.json ./
COPY index.js ./
RUN npm install
EXPOSE 3001
CMD ["node", "index.js"]