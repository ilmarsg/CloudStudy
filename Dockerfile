FROM ubuntu
RUN apt-get -qq update \
     && apt-get -qq install -y wget
LABEL maintainer="Ilmārs Geiba <ilmars.geiba@gmail.com>"
LABEL description="Daļa no Mākoņskaitļošanas 8. nedēļas uzdevuma."
LABEL version="1.0"
WORKDIR ./webserviss/
COPY ./6neduzd/package.json ./6neduzd/index.js ./
RUN wget https://data.gov.lv/dati/dataset/e823f5b6-4403-491d-8fd2-161cf65c11f4/resource/f2579b7a-a752-43b7-8d7a-6924daac5e09/download/ta2017c.lst
RUN apt -qq install -y nodejs npm
RUN npm install --quiet express csv csv-parse --save
EXPOSE 8081
RUN useradd geiba
USER geiba
CMD node index.js
HEALTHCHECK --interval=30s --timeout=3s \
     CMD curl localhost:8081/ || exit 1