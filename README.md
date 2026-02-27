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

To run the frontend code locally:

1. **Navigate to the directory:**
```bash
cd frontend
```

2. **Install dependencies & bundle:**
```bash
npm install
npm run build
```

> [!NOTE]
> Uses cypress `^15.10.0`, jest `^30.2.0`, react `^19.2.0`, and Vite.

3. **Run development server:**
```bash
npm run dev
```

4. **Open in browser:** Navigate to the localhost link provided by Vite.

### Backend

### Testing
