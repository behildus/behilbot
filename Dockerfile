FROM node:lts-alpine
ENV NODE_ENV=production
ARG TOKEN
ARG CLIENT_ID
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN touch /usr/src/app/.env
RUN touch /usr/src/app/playlists.json
RUN echo "TOKEN=${TOKEN} \ CLIENT_ID=${CLIENT_ID}" >> /usr/src/app/.env
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 80
EXPOSE 443
RUN chown -R node /usr/src/app
USER node
VOLUME ["/usr/src/app/mp3"]
CMD ["node", "index.js"]
