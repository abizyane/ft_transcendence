FROM docker.elastic.co/elasticsearch/elasticsearch:8.17.0

USER root

COPY ./tools/entrypoint.sh /entrypoint.sh

RUN mkdir -p /usr/share/elasticsearch/config/certs &&\
	chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]