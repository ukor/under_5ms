# uder_5ms
a simulated environement that allows users deploy there project via

- Git, and
- File Upload

The project consist of `backend`, `frontend` and `docs` seevice; and some share packages in the `packages` folder.

> [!IMPORTANT]
> Read to the end to see Brimble FeedBack

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

The project uses `PNPM` extensively. PNPM is use not just to manage dependency but also

- to manage the workspace 
- production deployment with `--prod` flag

---

## Running the Project

First ensure that you are in the project root.


- #### Setup environemental variables

To start the app first will need to set up the `environemental variables`. We achieve that by running

```sh

./etc/setup_env.sh

```
The script generate all `.env` file for all services. It overides any existing content in the `.env` filewith the project defaults.


- #### Build and start app
Then procced to run the project in docker by run the command below

```sh

docker compose -f docker-compose.dev.yaml up --build`
```

This will build, install dependencies and start the project.

To confirm everything is fine and dandy, run the command

```sh

curl http://localhost/api/__/health
```

or enter this address in your browser `http://localhost/api/__/health`

if you get a JSON response, everything is fine.


- #### Stop the app

To stop the app, run the command below

```sh

docker compose -f docker-compose.dev.yaml down`
```

---

### The Backend
The project uses a layered structure for for file organisation.

The backend uses a layered acheterture structure for file organisation. I tried to maintain same thing for the `frontend` but I was going too fast and trying to beat a dealine.

The backend expose 4 REST API endpoint, namely

- `[POST] /v1/deploy/git`

This allows users to start a deployment by sending a git URL to the backend server

- `[POST] /v1/deploy/upload`

This allow users to upload a folder to the backend. Users upload a folder, the client zip the files and send it over to the backend. 

This expose a lot security concerns and there are better way to handle file upload, but that is out of scoop for this document (PS - Hire me and we can have more conversation about this, hahaha). just kidding, I am on a deadline and i am trying to rush this documentation.

- `[GET] /v1/deployments`

This is returns all deployment backe to the user irrespective of theier staus.

it could use some pagination, but ... deadline!.

- `[GET] /v1/deployment-logs`

This is where all the magic happens and where i spent the most time. it streams all the logs back to the user when they click on a build or when they trigger a new build.


- `[PATCH] /v1/deploy/stop`

This is a nice to have feature, that i intend to work on if i have more time or after the review process.

it allows users to manualy stop the deployment process.


---

### The frontend

A basic use that allow user interact with our simulation.

---

### The Pipeline

TODO: - comming soon - I have code to write



## Brimble FeedBack

(FeedBack)[./FEEDBACK.md]
