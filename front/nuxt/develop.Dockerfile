# Use the official Node.js image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port Nuxt runs on (3000 by default)
EXPOSE 3000

# Define the default command to run the Nuxt app
CMD ["npm", "run", "dev"]
