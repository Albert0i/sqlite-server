FROM node:18.16.0-alpine
WORKDIR /app
COPY package.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --omit=dev; \
        fi

COPY ./src ./
ENV PORT 8989
EXPOSE $PORT
CMD ["node", "server.js"]

#
# buiid:  
# docker build -t albert0i/sqlite-server:1.0 .
# 
# run: 
# docker run --name api --rm -p 8989:8989 -v data:/app/data --env-file .env -d albert0i/sqlite-server:1.0
#
# (2023/05/28)
# 