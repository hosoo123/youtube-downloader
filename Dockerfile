FROM node:20-slim

# Deno болон бусад шаардлагатай хэрэгслүүдийг суулгах
RUN apt-get update && \
    apt-get install -y python3 python3-pip curl ffmpeg unzip && \
    curl -fsSL https://deno.land/x/install/install.sh | sh && \
    mv /root/.deno/bin/deno /usr/local/bin/deno && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]