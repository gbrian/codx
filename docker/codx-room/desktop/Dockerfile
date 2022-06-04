FROM codx/room:latest

RUN apt update && \
  apt install -y feh cairo-dock

COPY wallpapers /desktop/wallpapers

COPY openbox.xml /etc/neko/openbox.xml

COPY supervisord.conf /etc/neko/supervisord/cairo-dock.conf

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh