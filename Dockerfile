FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY prisma ./prisma/
RUN pnpm prisma generate

COPY . .
RUN pnpm build && (test -f dist/main.js || test -f dist/src/main.js) || (echo "Build output:" && ls -la dist/ 2>/dev/null || true && exit 1)

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate && \
    pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "if [ -f dist/main.js ]; then exec node dist/main.js; elif [ -f dist/src/main.js ]; then exec node dist/src/main.js; else echo 'No entry point found in dist/' && ls -la dist/ && exit 1; fi"]
