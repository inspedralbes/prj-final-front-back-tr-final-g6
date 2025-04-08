# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.18.0

FROM node:${NODE_VERSION}-slim as base

ARG PORT=3000

WORKDIR /usr/src/app

# Install necessary packages for canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    libpangocairo-1.0-0 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Build
FROM base as build

COPY --link package.json package-lock.json ./
RUN npm install
RUN npm install @rollup/rollup-linux-x64-gnu
COPY --link . .

# Ensure postinstall script runs
RUN npm run postinstall

# Expose the application port
EXPOSE ${PORT}

# Command to run the application
CMD ["npm", "run", "dev"]