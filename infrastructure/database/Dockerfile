FROM postgres:17.1-alpine3.20

COPY ./scripts/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    chown postgres:postgres /entrypoint.sh

USER postgres

ENTRYPOINT ["/entrypoint.sh"]
