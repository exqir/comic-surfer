# Dockerfile for the API service
# The file is located at the root to include the yarn.lock file in the build context
# which only exisits at the root in a yarn workspace

# base node image with development dependencies
FROM node:14-alpine as base

# Needed to build dependencies with node-gyp
RUN apk add --no-cache python3 make g++

RUN mkdir -p /workspace/packages/backend/
WORKDIR /workspace/

# Add global package.json and lock file for workspaces
ADD package.json yarn.lock ./
# Add package.json for API service and install dependencies
ADD packages/backend/package.json ./packages/backend
RUN yarn install --frozen-lockfile --production=false --silent

# setup production node_modules by pruning dev dependencies
FROM base as production-deps
RUN yarn workspace @comic-surfer/backend install --frozen-lockfile --production=true --silent

# build app
FROM base as build

ADD packages/backend/ ./packages/backend/
RUN yarn workspace @comic-surfer/backend run build

# build smaller image for running
FROM node:14-alpine

ENV NODE_ENV=production

RUN mkdir /app/
WORKDIR /app/

COPY --from=production-deps /workspace/node_modules /app/node_modules
COPY --from=build /workspace/packages/backend/dist /app/dist
ADD packages/backend/package.json /app/
ADD packages/backend/apollo.config.js /app/

CMD ["yarn", "run", "start"]