FROM node:23-bookworm-slim

# Install Python and required tools
RUN apt-get update && apt-get install -y python3 python3-venv python3-pip && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN python3 -m venv venv && \
    ./venv/bin/pip install --upgrade pip && \
    ./venv/bin/pip install -r requirements.txt

# Expose the port
EXPOSE 3022

# Start the server
CMD ["node", "index.js"]