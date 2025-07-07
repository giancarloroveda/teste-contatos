**Running the project:**

```
docker-compose up --build
```

**Running migrations:**

```
docker-compose exec api npm run migrate:[up|down]
```

- If you'd like to run migrations on your local machine, you'll have to
  change the database host in the url used in package.json scripts from `db` to
  `localhost`.
