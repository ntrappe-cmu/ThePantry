# The Pantry

## Live Demo
Navigate to: `http://17423-team03.s3d.cmu.edu/`

Login with:
- **Email**: `you@example.com`
- **Password**: `123456`

## Local Development 

You'll need 2 terminals.

**Terminal 1:** 

1. Get a virtual environment running.
```bash
cd backend
python3 -m venv .venc && source .venv/bin/activate
```

2. Install requirements.
```bash
pip install -r requirements.txt
```

3. Start up the server.
```bash
python3 src/app.py
```
**Terminal 2:**

1. Install dependencies.
```bash
cd frontend
npm install
```

2. Start up the web server.
```bash
npm run dev
```

3. Navigate to the url it points to. If you get a cross-origin block issue, that's likely the CORS configuration which needs to allow the Vite origin. If you patch this, you'll need to restart the backend.

### Testing

- **Jest:** Fast unit/component tests (small scope, runs in JS/DOM test environment, good for utilities and component logic).
- **Cypress:** End-to-end/integration UI tests (runs a real browser, exercises full user flows like login, ordering, navigation).

To run locally:
```bash
cd frontend
npm i
npm test # jest tests
npx cypress open # e2e tests
```
