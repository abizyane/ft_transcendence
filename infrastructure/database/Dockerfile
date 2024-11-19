FROM postgres:15

COPY ./scripts/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh && \
    chown postgres:postgres /entrypoint.sh

USER postgres

ENTRYPOINT ["/entrypoint.sh"]
