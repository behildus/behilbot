FROM node:lts-alpine
RUN apt-get -y update && apt-get install -y ffmpeg
ARG TOKEN
ARG CLIENT_ID
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN touch /usr/src/app/.env
RUN echo "TOKEN=${TOKEN} \ CLIENT_ID=${CLIENT_ID}" >> /usr/src/app/.env
RUN npm install && npm install --global typescript
COPY . .
EXPOSE 80
EXPOSE 443
RUN chown -R node /usr/src/app
USER node
VOLUME ["/usr/src/app/mp3"]
WORKDIR /usr/src/app/mp3
RUN touch /usr/src/app/mp3/playlists.json
RUN echo "{'playlists': []}"
WORKDIR /usr/src/app
CMD ["node", "index.js"]
