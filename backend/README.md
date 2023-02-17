Local:

1. Copy and configure .env.example to .env

Docker:
> docker build -t petorpass/backend .
> docker run -p 8080:8080 petorpass/backend

Docker-Compose:
From root (not /backend)
> docker-compose up -d


Adding migration process:
> Create new model in src/db/models
> pnpm migration:generate ./src/db/migrations/<NAMEHERE>
> pnpm typeorm:updateDatasource //This will auto add to dev_datasource.ts
> pnpm migration:run

