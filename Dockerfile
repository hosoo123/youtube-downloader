FROM node:20-slim

# ffmpeg, unzip, python болон бусад шаардлагатай хэрэгслүүдийг суулгах
RUN apt-get update && apt-get install -y \
    ffmpeg \
    unzip \
    curl \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# yt-dlp-г системд суулгах
RUN pip3 install --no-cache-dir --upgrade yt-dlp --break-system-packages

# Deno суулгах
RUN curl -fsSL https://deno.land/install.sh | sh
ENV PATH="/root/.deno/bin:$PATH"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "server.js"]