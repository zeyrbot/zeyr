# ================ #
#    Base Stage    #
# ================ #

FROM node:18-buster-slim as base

WORKDIR /usr/src/app

ENV HUSKY=0
ENV CI=true

RUN apt-get update --fix-missing && \
    apt-get upgrade -y --no-install-recommends && \
    apt-get install -y --no-install-recommends build-essential python3 libfontconfig1 dumb-init && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm i -g pnpm@latest

COPY --chown=node:node .npmrc .
COPY --chown=node:node pnpm-workspace.yaml .
COPY --chown=node:node pnpm-lock.yaml .
COPY --chown=node:node package.json .
COPY --chown=node:node apps/bot/package.json apps/bot/package.json
COPY --chown=node:node prisma/ prisma/

RUN sed -i 's/"postinstall": "husky install .github\/husky && pnpm bot prisma:generate"/"postinstall": ""/' ./package.json

ENTRYPOINT ["dumb-init", "--"]

# ================ #
#   Builder Stage  #
# ================ #

FROM base as builder

ENV NODE_ENV="development"

COPY --chown=node:node tsconfig.base.json tsconfig.base.json
COPY --chown=node:node apps/bot/src apps/bot/src

RUN pnpm install --no-frozen-lockfile --recursive
RUN cd apps/bot/ && pnpm prisma:generate && pnpm run build

# ================ #
#   Runner Stage   #
# ================ #

FROM base as runner

ENV NODE_ENV="production"
ENV NODE_OPTIONS="--enable-source-maps --max_old_space_size=4096"

COPY --chown=node:node apps/bot/.env apps/bot/.env
COPY --chown=node:node --from=builder /usr/src/app/apps/bot/dist apps/bot/dist
COPY --chown=node:node --from=builder /usr/src/app/node_modules/ node_modules/
COPY --chown=node:node --from=builder /usr/src/app/apps/bot/node_modules/ apps/bot/node_modules/

RUN chown node:node /usr/src/app

USER node

WORKDIR /usr/src/app/apps/bot

CMD [ "pnpm", "run", "start" ]
