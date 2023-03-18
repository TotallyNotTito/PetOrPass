# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:18-slim as build-stage

RUN apt-get update && apt-get upgrade -y && apt-get autoclean -y && apt-get autoremove -y
RUN npm install -g pnpm

WORKDIR /app
COPY ./nginx.conf /nginx.conf
COPY package*.json /app/

RUN pnpm install

COPY ./ /app/

ENV VITE_BACKEND_IP=127.0.0.1
ENV VITE_BACKEND_PORT=8080
ENV VITE_IP_ADDR=localhost
ENV VITE_PORT=5173
ENV VITE_AUTH0_DOMAIN=dev-aevxtb882nkyrbhe.us.auth0.com
ENV VITE_AUTH0_CLIENT_ID=2PL4L35pgUAKOV485GFdluoLBAJY0NG8

RUN pnpm build

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# Note it leaves out almost everything from build stage, making a MUCH smaller final container
FROM nginx:latest
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /nginx.conf /etc/nginx/conf.d/default.conf
