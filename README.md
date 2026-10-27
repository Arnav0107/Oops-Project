# ⚔️ Battle Arena - C++ OOP Showcase

A full-stack two-player combat game where **100% of game mechanics, OOP principles, and calculations run in C++17**, relayed by a thin Node.js server to a React (Vite) interface.

---

## 🚀 Cloud Deployment Guide (Render + Vercel)

The project is pre-configured with infrastructure-as-code files (`render.yaml`, `vercel.json`, and cross-platform build scripts) so you can deploy in minutes.

```
   ┌───────────────────────┐             ┌─────────────────────────┐
   │    Vercel Frontend    │ ──WebSocket─▶│     Render Backend      │
   │  React (Vite) Client  │ ◀───JSON────│ Node Relay + C++ Engine │
   └───────────────────────┘             └─────────────────────────┘
```

---

### Step 1: Deploy Backend to Render (Node.js + C++ Engine)

1. Go to [Render.com](https://render.com) and log in.
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository: `https://github.com/Arnav0107/Oops-Project`.
4. Configure the service settings:
   - **Name**: `battle-arena-server`
   - **Region**: Any (e.g. *Oregon* or *Frankfurt*)
   - **Branch**: `main`
   - **Root Directory**: *(leave blank)*
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm run render-build
     ```
     *(This automatically runs `g++ -std=c++17` on Render's Linux container to compile the C++ engine!)*
   - **Start Command**:
     ```bash
     npm run start:server
     ```
   - **Plan**: Free
5. Click **Create Web Service**.
6. Once deployed, Render will provide a public URL like:
   `https://battle-arena-server.onrender.com`
   *(Verify it by visiting `https://battle-arena-server.onrender.com/` — it returns `{"status":"healthy","engineFound":true}`)*

> **Alternative via Blueprint**: You can also click **New +** > **Blueprint** on Render and select this repository. Render will automatically read `render.yaml` and configure everything with zero manual typing!

---

### Step 2: Deploy Frontend to Vercel (React + Vite)

1. Go to [Vercel.com](https://vercel.com) and click **Add New...** > **Project**.
2. Import the `Arnav0107/Oops-Project` repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: *(leave as `./` or set to `battle-arena/client` — both work!)*
   - **Build Command**: `cd battle-arena/client && npm install && npm run build` (or default if root directory is set to `battle-arena/client`)
   - **Output Directory**: `battle-arena/client/dist` (or `dist` if root directory is set to `battle-arena/client`)
4. **Environment Variables**:
   - Add a new variable:
     - **Key**: `VITE_SERVER_URL`
     - **Value**: Your Render URL from Step 1 (e.g. `https://battle-arena-server.onrender.com` — *no trailing slash*)
5. Click **Deploy**.

> **In-App Server Switcher**: Even without setting `VITE_SERVER_URL`, you can paste your Render backend URL directly into the client lobby under *"Configure Server Address"*, and it will save to `localStorage`!

---

## 💻 Local Development

### 1. Build C++ Engine
```bash
cd battle-arena/engine
g++ -std=c++17 -Wall -Wextra -O2 -Iinclude src/*.cpp -o battle_engine.exe
# Optional: Terminal fallback mode
.\battle_engine.exe --console
```

### 2. Run Node.js Server
```bash
cd battle-arena/server
npm install
npm run build   # compiles C++ engine
npm start       # starts server on port 3001
```

### 3. Run React Client
```bash
cd battle-arena/client
npm install
npm run dev     # starts Vite on port 5173
```

Full architecture specifications, Mermaid UML class diagram, and OOP concept mappings can be found in [`battle-arena/README.md`](file:///d:/Study/OOPS%20Project/battle-arena/README.md).
