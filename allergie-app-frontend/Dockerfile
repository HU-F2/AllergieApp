# Use an official Node.js runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /allergie-app-frontend

# Copy package.json and package-lock.json first (for caching dependencies)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files into the container
COPY . .

# Expose the port the app will run on
EXPOSE 8080

# Install TypeScript globally (just in case it’s not installed as a devDependency)
RUN npm install -g typescript

# Command to run when the container starts
CMD ["npm", "run", "dev"]