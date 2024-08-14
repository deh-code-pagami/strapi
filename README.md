# Pagami Strapi

## Getting Started
This project is the frontend of the Pagami application, before continuing make sure to clone the [frontend project](https://github.com/deh-code-pagami/frontend).

First you have to setup the configurations by running

`cp .env.example .env`

in this project's directory.

To launch this project as a docker container, create a `compose.yml` in this project's parent directory with the following content:

```
# compose.yml
services:
  db:
    image: mariadb
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: "strapi"
      MYSQL_DATABASE: "strapi"
      MYSQL_USER: "strapi"
      MYSQL_PASSWORD: "strapi"
    volumes:
      - ./db-data:/var/lib/mysql
    expose:
      - 3306
  strapi:
    image: node:18
    working_dir: '/home/node/strapi'
    ports:
      - 1337:1337
    expose:
      - 1337
    volumes:
      - ./strapi:/home/node/strapi
    command: bash -c "yarn install; yarn run develop"
    depends_on:
      - db
    environment:
      - DATABASE_HOST=db
  frontend:
    image: node:18
    working_dir: '/home/node/frontend'
    ports:
      - 3000:3000
    volumes:
      - ./frontend:/home/node/frontend
    command: bash -c "yarn install; yarn run dev"
    environment:
      - BACKEND_HOST=strapi
      - BACKEND_PORT=1337
    depends_on:
      - strapi
```

At this point the hierarchy should be the following:

```
Pagami/
├─ compose.yml
├─ frontend/
├─ strapi/
```

Now run `docker-compose up -d` in the directory containing the `compose.yml` file.

Once all the containers are up and running, you should be able to connect to [strapi admin panel](http://localhost:1337/admin), follow the instructions in order to create an admin account.

Now that the admin account is set you can use it to log in the admin console.

Next step is to create as many [application users](http://localhost:1337/admin/content-manager/collection-types/plugin::users-permissions.user) as you wish. Make sure to flag them as `confirmed` and to assign them the `Authenticated` role.

Finally you can access to the [frontend application](http://localhost:3000) by using one of the application users you just created.
