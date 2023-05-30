#!/bin/sh

uwsgi --ini /srv/uwsgi.ini
nginx -g 'daemon off;'