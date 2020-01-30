FROM node:latest as builder
COPY . /app
WORKDIR /app
RUN npm install && \
    npm run-script package

FROM nginx:latest
COPY --from=builder /app/dist/twigs /usr/share/nginx/html

