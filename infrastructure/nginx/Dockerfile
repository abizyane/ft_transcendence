FROM alpine:3.20

RUN apk add --no-cache nginx openssl \
    && mkdir -p /run/nginx /etc/nginx/ssl \
    && openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
       -keyout /etc/nginx/ssl/cert.key \
       -out /etc/nginx/ssl/cert.crt \
       -subj "/CN=astropong.com/O=42/OU=1337/C=MO/L=KHOURIBGA"
 
COPY ./conf/nginx.conf /etc/nginx/http.d/default.conf

CMD ["nginx", "-g", "daemon off;"]