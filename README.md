 # SchoolBites README

## Useful links

Drizzle ORM [here.](https://orm.drizzle.team/docs/overview)
Tailwind Docs [here.](https://tailwindcss.com/docs/styling-with-utility-classes)
Svelte Docs [here.](https://svelte.dev/docs/svelte/overview)
Svelte Kit Docs [here.](https://svelte.dev/docs/kit/introduction) 
Docker Download [here.](https://docs.docker.com/desktop/)

## Quick start

### 1) Requirements
- Node 20+
- Docker & Docker Compose

### 2) Start Postgres
```bash
docker compose up -d
```

### 3) Install Dependencies
```
npm install
```

### 4) Run the Application
```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```


This starts a local Postgres at `localhost:5432` with DB `schoolbites`

### 5) Access our Web Application using /login as Home Page (since /index has not been created yet)
```
http://localhost:5173/login
```