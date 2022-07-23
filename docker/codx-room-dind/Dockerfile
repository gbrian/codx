# https://hub.docker.com/_/docker
FROM docker:dind

# docker-compose
# https://github.com/tiangolo/docker-with-compose
RUN apk add --no-cache py3-pip python3-dev libffi-dev openssl-dev curl gcc libc-dev rust cargo make && \
    pip3 install --no-cache-dir docker-compose

COPY codx-entrypoint.sh /codx-entrypoint.sh
RUN chmod +x /codx-entrypoint.sh

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY docker-compose.yaml /docker-compose.yaml

ENTRYPOINT [ "/entrypoint.sh" ]