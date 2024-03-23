# Image Share

![Index page](/img/index.png)

## Build & Configuration

Change [`ALLOWED_HOSTS`](ImageShare/ImageShare/settings.py) to match your domain name

Create `.pg_service` file in `ImageShare` folder:

    [db_service]
    host=db
    user=postgres
    dbname=<database name>
    port=5432

Create `.env` file in `ImageShare` folder:

    SECRET_KEY=<secret_key>

    POSTGRES_DB=<database name>
    POSTGRES_PASSWORD=<database_password>
    DJANGO_SETTINGS_MODULE=ImageShare.settings
    
    PYTHONPATH=/srv/

    PGSERVICEFILE="/srv/.pg_service.conf"


Type `docker-compose build`

### First time start up

* `docker-compose up`;

* SSH into `server` container `docker exec -it <container name> /bin/bash`;

* Create superuser `django-admin createsuperuser`

## Start server

`docker-compose up`

