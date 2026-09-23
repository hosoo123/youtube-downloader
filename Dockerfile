FROM node:20-slim

# ffmpeg, unzip болон бусад шаардлагатай хэрэгслүүдийг суулгах
RUN apt-get update && apt-get install -y \
    ffmpeg \
    unzip \
    curl \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Deno суулгах
RUN curl -fsSL https://deno.land/install.sh | sh
ENV PATH="/root/.deno/bin:$PATH"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 10000

CMD ["node", "server.js"]