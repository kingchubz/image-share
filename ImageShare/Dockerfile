FROM alpine

RUN apk update
RUN apk add python3 py3-pip uwsgi uwsgi-python3 nginx
RUN pip install django djangorestframework Pillow psycopg cryptography django-rest-knox tzdata

COPY media/site/ /var/www/
#COPY media/media/ /var/www/media/
COPY static/ /var/www/static/
# COPY db.sqlite3 /srv/db.sqlite3
COPY start.sh /srv/
COPY ImageShare/ /srv/ImageShare/
COPY imageapp/ /srv/imageapp/
COPY uwsgi.ini /srv/
COPY server.conf /etc/nginx/http.d/default.conf
COPY start.sh /srv/

CMD ["/bin/sh", "/srv/start.sh"]

# EXPOSE 80/tcp
