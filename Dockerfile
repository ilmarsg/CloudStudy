FROM openalpr/openalpr
LABEL description="OpenAlpr worker priekš grupu darba"
LABEL version="1.0"
WORKDIR ./OpenAlpr/
COPY ./OpenAlpr/package.json ./OpenAlpr/index.js ./
RUN apt-get update && apt-get install -y nodejs libssl1.0-dev
RUN apt-get install -y npm
RUN npm install --quiet amqplib minio mongodb nodemailer
EXPOSE 5672 27017 9000 587
CMD node index.js

FROM ubuntu:22.04R
RUN apt updateRUN apt-get -y install nodejs
RUN apt-get -y install npm
WORKDIR /usr/src/app
COPY package*.json ./
COPY index.js ./
RUN npm install \
  EXPOSE 3001RUN useradd laganovskisUSER laganovskisCMD ["node", "index.js"]