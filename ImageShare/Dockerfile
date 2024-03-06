FROM alpine

RUN apk update
RUN apk add python3 py3-pip uwsgi uwsgi-python3 nginx
RUN pip install --break-system-packages django djangorestframework Pillow psycopg2-binary cryptography django-rest-knox tzdata

ENV PGSERVICEFILE=/srv/pg_service.conf

COPY pg_service.conf /srv/
COPY .pwdfile /srv/
COPY uwsgi.ini /srv/
COPY start.sh /srv/

COPY media/site/ /var/www/
COPY static/ /var/www/static/
COPY start.sh /srv/
COPY ImageShare/ /srv/ImageShare/
COPY imageapp/ /srv/imageapp/

COPY server.conf /etc/nginx/http.d/default.conf


CMD ["/bin/sh", "/srv/start.sh"]

# EXPOSE 80/tcp
