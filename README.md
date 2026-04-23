# uder_5ms
a simulated environement that allows users deploy there project via

- Git, and
- File Upload

The project consist of `backend`, `frontend` and `swagger doc`. 

### Directory Structrue

```
under_5ms/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       └── modules/
│   ├── frontend/
│   │   └── src/
│   ├── docs/
│   │   └── src/
├── packages/
│   ├── relay_bus/
│   └── shared_types/
├── .gitignore
├── package.json
└── pnpm-workspace.yaml

```

---

## Start App

for dev enviroment

- `docker compose -f docker-compose.dev.yaml up --build`

- `docker compose -f docker-compose.dev.yaml down`

---

The project uses a layered structure for for file organisation.


