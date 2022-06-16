FROM codx/neko:firefox

RUN groupadd --gid 1001 codx

## CODE-SERVER
RUN apt-get update \
 && apt-get install -y \
    curl \
    dumb-init \
    zsh \
    htop \
    locales \
    man \
    nano \
    git \
    git-lfs \
    procps \
    openssh-client \
    sudo \
    vim.tiny \
    lsb-release \
  && git lfs install \
  && rm -rf /var/lib/apt/lists/*

# https://wiki.debian.org/Locale#Manually
RUN sed -i "s/# en_US.UTF-8/en_US.UTF-8/" /etc/locale.gen \
  && locale-gen
ENV LANG=en_US.UTF-8

RUN adduser --uid 1001 --gid 1001 --gecos '' --disabled-password codx && \
  echo "codx ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/nopasswd

RUN ARCH="$(dpkg --print-architecture)" && \
    curl -fsSL "https://github.com/boxboat/fixuid/releases/download/v0.5/fixuid-0.5-linux-$ARCH.tar.gz" | tar -C /usr/local/bin -xzf - && \
    chown root:root /usr/local/bin/fixuid && \
    chmod 4755 /usr/local/bin/fixuid && \
    mkdir -p /etc/fixuid && \
    printf "user: codx\ngroup: codx\n" > /etc/fixuid/config.yml

ARG CODE_SERVER_VER=4.2.0
RUN ARCH="$(dpkg --print-architecture)" && \
    curl -fsSL "https://github.com/coder/code-server/releases/download/v${CODE_SERVER_VER}/code-server_${CODE_SERVER_VER}_${ARCH}.deb" > /tmp/code-server.deb

RUN dpkg -i /tmp/code-server.deb && rm /tmp/code-server*.deb

ENV CODX_HOME=/home/codx

COPY --chown=codx code-server/.config.yaml ${CODX_HOME}/.config/code-server/config.yaml
COPY --chown=codx code-server/settings.json ${CODX_HOME}/.local/share/code-server/User/settings.json
## CODE-SERVER

## APPS
COPY --chown=codx apps ${CODX_HOME}/apps
ENV CODX_APPS=${CODX_HOME}/apps
RUN chmod +x $CODX_APPS/codx.sh
RUN cp $CODX_APPS/codx.sh /bin/codx
##

ENV PATH=$PATH:/usr/share/code
COPY supervisord.conf /etc/neko/supervisord/code.conf
COPY --chown=codx firefox/policies.json /usr/lib/firefox/distribution/policies.json
COPY --chown=codx firefox/neko.js /usr/lib/firefox/mozilla.cfg

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Python
RUN apt update && apt install -y python python3-pip 

ENTRYPOINT [ "/entrypoint.sh" ]