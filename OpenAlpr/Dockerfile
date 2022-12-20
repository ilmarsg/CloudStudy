FROM openalpr/openalpr
RUN apt-get update
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - &&\
    apt-get install -y nodejs
RUN npm install -g npm@9.2.0
WORKDIR ./OpenAlpr/
COPY package*.json ./
COPY index.js ./
RUN npm install
CMD ["node", "index.js"]