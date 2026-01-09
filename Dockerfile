FROM nginx:1.29.4 AS base
WORKDIR /app
EXPOSE 80

FROM node:20.19.6 AS build
ENV NODE_OPTIONS=--max_old_space_size=8192
WORKDIR /app

COPY package.json ./

RUN npm config set registry https://registry.npmmirror.com
RUN npm config set unsafe-perm true
# RUN npm install
RUN npm install
RUN npm config set unsafe-perm false

COPY . .

ARG buildEnv
RUN npm run build:${buildEnv}

FROM base AS final
WORKDIR /app
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]