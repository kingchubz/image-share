FROM alpine

RUN apk update
RUN apk add python3 py3-pip uwsgi uwsgi-python3 nginx

# requirements
COPY requirements.txt /srv/
RUN pip install --break-system-packages -r /srv/requirements.txt

# app files
COPY ImageShare/ /srv/ImageShare/
COPY imageapp/ /srv/imageapp/

# static files
ENV PYTHONPATH=/srv/
ENV DJANGO_SETTINGS_MODULE=ImageShare.settings
RUN django-admin collectstatic

COPY site/static/ /var/www/

# configuration files
COPY .pg_service.conf /srv/
COPY uwsgi.ini /srv/
COPY nginx.conf /etc/nginx/http.d/default.conf

COPY start.sh /srv/
CMD ["/bin/sh", "/srv/start.sh"]

# EXPOSE 80/tcp
