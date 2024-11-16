FROM node:18-alpine
WORKDIR /app
COPY . /app
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "start"]
