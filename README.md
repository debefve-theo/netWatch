# NetWatch

Dashboard personnel de monitoring réseau basé sur `Next.js`, `Prisma` et `PostgreSQL`.
Un Raspberry Pi exécute régulièrement `speedtest`, sauvegarde localement le résultat en CSV, puis l’envoie au VPS via `POST /api/ingest/speedtest` avec authentification `Authorization: Bearer <api-key>`.

## Arborescence

```text
speedtest-app/
├── app/
│   ├── api/
│   │   ├── devices/
│   │   ├── health/
│   │   ├── ingest/speedtest/
│   │   ├── speedtests/
│   │   └── stats/overview/
│   ├── dashboard/
│   │   ├── devices/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── auth.ts
│   ├── crypto.ts
│   ├── device-status.ts
│   ├── env.ts
│   ├── http.ts
│   ├── network-quality.ts
│   ├── prisma.ts
│   ├── queries.ts
│   ├── serializers.ts
│   ├── utils.ts
│   └── validators.ts
├── prisma/
│   ├── migrations/0001_init/migration.sql
│   ├── schema.prisma
│   └── seed.ts
├── scripts/
│   ├── create-device.ts
│   ├── generate-api-key.ts
│   └── raspberry_speedtest_client.py
├── types/
│   └── index.ts
├── .env.example
└── package.json
```

## Stack

- `Next.js` App Router
- `TypeScript`
- `Tailwind CSS`
- `Prisma`
- `PostgreSQL`
- `Zod`
- `Recharts`

## Fonctionnalités

- API d’ingestion sécurisée par API key hashée en base
- Validation stricte du payload avec `Zod`
- Dashboard overview et page détail device
- Historique paginé côté dashboard et côté API
- Statistiques agrégées par période
- Détection online/offline centralisée
- Script Raspberry Pi simple, fiable, sans dépendance Python externe obligatoire
- Healthcheck HTTP pour le VPS

## Variables d’environnement

Copier `.env.example` vers `.env` puis ajuster :

```bash
cp .env.example .env
```

Variables principales :

```env
APP_URL="http://speedtest.squal.cloud:8080"
NEXT_PUBLIC_APP_NAME="NetWatch"
PORT="3000"
HOSTNAME="0.0.0.0"
DATABASE_URL="postgresql://speedtest:change-me@localhost:5432/speedtest_db?schema=public"
API_KEY_PEPPER="generate-with-openssl-rand-hex-32"
DEVICE_OFFLINE_THRESHOLD_MINUTES="10"
SEED_DEVICE_NAME="Demo Raspberry Pi"
SEED_DEVICE_LOCATION="Maison"
```

Générer un pepper robuste :

```bash
openssl rand -hex 32
```

## Installation locale

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Application locale : `http://localhost:3000`

## Déploiement Docker sur VPS

Les fichiers Docker fournis :

- [`Dockerfile`](./Dockerfile)
- [`docker-compose.yml`](./docker-compose.yml)
- [`docker/entrypoint.sh`](./docker/entrypoint.sh)
- [`.env.docker.example`](./.env.docker.example)

### Préparer l’environnement Docker

```bash
cp .env.docker.example .env
```

Puis ajuster au minimum :

```env
APP_URL=http://speedtest.squal.cloud:8080
APP_PORT=8080
POSTGRES_PASSWORD=change-me
DATABASE_URL=postgresql://speedtest:change-me@postgres:5432/speedtest_db?schema=public
API_KEY_PEPPER=generate-with-openssl-rand-hex-32
```

### Lancer la stack

```bash
docker compose build
docker compose up -d
docker compose logs -f
```

Services démarrés :

- `postgres`
- `app`
- `nginx`

### Vérifier

```bash
curl http://127.0.0.1:8080/api/health
docker compose ps
```

Le dashboard sera ensuite servi sur :

```text
http://speedtest.squal.cloud:8080
```

### Seed initial

Une fois la stack démarrée :

```bash
docker compose exec app npm run db:seed
```

### Créer un nouveau device

```bash
docker compose exec app npm run create-device -- --name "Raspberry Pi Salon" --location "Salon"
```

### Mise à jour

```bash
docker compose build
docker compose up -d
```

## Déploiement automatique via GitHub Actions

Le workflow [`.github/workflows/build-deploy-prod.yml`](./.github/workflows/build-deploy-prod.yml) :

- build l'image Docker multi-arch
- push l'image sur `ghcr.io`
- se connecte en SSH sur le VPS
- met à jour le dépôt sur `main`
- déploie l'image `prod` avec [`scripts/deploy_prod.sh`](./scripts/deploy_prod.sh)

Le script de déploiement utilise `docker compose up -d --remove-orphans`, ce qui supprime automatiquement l'ancien conteneur `nginx` si le VPS avait encore l'ancienne stack.

### Variables GitHub à configurer

Variables de repository :

- `PROD_DEPLOY_HOST`
- `PROD_DEPLOY_PORT`
- `PROD_DEPLOY_USER`
- `PROD_DEPLOY_PATH`
- `GHCR_USERNAME` optionnel, sinon le owner GitHub du repo est utilisé

Secrets GitHub :

- `PROD_DEPLOY_SSH_KEY`
- `GHCR_READ_TOKEN`

Le `GHCR_READ_TOKEN` doit au minimum avoir le scope `read:packages` pour que le VPS puisse faire `docker pull` sur `ghcr.io`.

### Pré-requis sur le VPS

- le repo doit déjà être cloné dans `PROD_DEPLOY_PATH`
- le VPS doit avoir `git`, `docker` et `docker compose`
- la branche `main` du repo doit être accessible depuis le VPS
- le fichier `.env` du VPS doit être présent et configuré

Le workflow exporte automatiquement `APP_IMAGE=ghcr.io/<owner>/netwatch:prod` pendant le déploiement, donc tu n'as pas besoin de le stocker dans `.env`.

## Base de données

Le schéma Prisma définit deux tables :

- `devices`
- `speedtest_results`

Points importants :

- hash d’API key stocké dans `devices.api_key_hash`
- relation `1 -> n` entre `devices` et `speedtest_results`
- index sur `enabled`
- index sur `measured_at`
- contrainte unique `(device_id, measured_at)` pour éviter les doublons lors des retries

## Commandes utiles

```bash
npm run dev
npm run build
npm run start
npm run typecheck
npm run db:generate
npm run db:migrate
npm run db:seed
npm run create-device -- --name "Raspberry Pi Bureau" --location "Bureau"
npm run generate-key
```

## Provisionner un device

### Option 1: seed de démonstration

```bash
npm run db:seed
```

Le script affiche :

- l’ID du device
- son nom
- l’API key brute à copier côté Raspberry Pi

### Option 2: créer un device manuellement

```bash
npm run create-device -- --name "Raspberry Pi Salon" --location "Salon"
```

## Contrat d’ingestion

### Endpoint

```http
POST /api/ingest/speedtest
Authorization: Bearer <api-key>
Content-Type: application/json
```

### Payload JSON attendu

```json
{
  "deviceId": "cm9exampledeviceid123456789",
  "measuredAt": "2026-03-31T15:00:00.000Z",
  "pingMs": 12.34,
  "jitterMs": 2.21,
  "downloadMbps": 903.14,
  "uploadMbps": 412.77,
  "packetLoss": 0,
  "isp": "Example ISP",
  "externalIp": "203.0.113.10",
  "serverId": "12345",
  "serverName": "Paris 01",
  "serverLocation": "Paris",
  "serverCountry": "France",
  "resultUrl": "https://www.speedtest.net/result/c/example"
}
```

### Réponses

- `201` si la mesure est créée
- `200` si le résultat existe déjà
- `400` si le payload est invalide
- `401` si la clé est absente ou invalide
- `403` si le `deviceId` du payload ne correspond pas à la clé
- `413` si le payload dépasse la limite

## API de lecture

### Liste des devices

```http
GET /api/devices
```

### Détail d’un device

```http
GET /api/devices/:id
```

### Historique

```http
GET /api/speedtests?deviceId=<id>&range=24h&page=1&pageSize=100
```

`range` supporte : `1h`, `6h`, `24h`, `7d`, `30d`

### Stats overview

```http
GET /api/stats/overview?deviceId=<id>&range=7d
```

### Healthcheck

```http
GET /api/health
```

## Script Raspberry Pi

Fichier : [`scripts/raspberry_speedtest_client.py`](./scripts/raspberry_speedtest_client.py)

### Pré-requis Raspberry Pi

Installer le CLI Ookla :

```bash
sudo apt update
sudo apt install curl gnupg -y
curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash
sudo apt install speedtest -y
```

### Configuration

Créer un `.env` dans le même dossier que le script :

```env
SPEEDTEST_API_URL=http://speedtest.squal.cloud:8080/api/ingest/speedtest
SPEEDTEST_API_KEY=raw_key_from_seed_or_create_device
SPEEDTEST_DEVICE_ID=cm9exampledeviceid123456789
SPEEDTEST_CSV_PATH=/home/pi/netwatch/speedtest_results.csv
SPEEDTEST_TIMEOUT_SECONDS=60
SPEEDTEST_RETRY_COUNT=3
SPEEDTEST_RETRY_DELAY_SECONDS=10
```

### Lancer manuellement

```bash
python3 raspberry_speedtest_client.py
```

### Cron toutes les 5 minutes

```cron
*/5 * * * * cd /home/pi/netwatch && /usr/bin/python3 /home/pi/netwatch/raspberry_speedtest_client.py >> /home/pi/netwatch/cron.log 2>&1
```

## Déploiement VPS Linux

Exemple cible : Ubuntu 24.04 avec `Node.js 22`, `PostgreSQL`, `Nginx`.

Si vous utilisez Docker Compose, cette section peut être simplifiée: Docker gère déjà l’app, PostgreSQL et Nginx. Dans ce cas, il suffit surtout d’installer Docker Engine + Compose plugin, copier le projet, remplir `.env`, puis lancer `docker compose up -d`.

### 1. Installer les dépendances système

```bash
sudo apt update
sudo apt install -y nginx postgresql postgresql-contrib certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Préparer PostgreSQL

```bash
sudo -u postgres psql
CREATE USER speedtest WITH PASSWORD 'change-me';
CREATE DATABASE speedtest_db OWNER speedtest;
\q
```

### 3. Déployer le code

```bash
mkdir -p /var/www/netwatch
cd /var/www/netwatch
# copier le projet ici
npm install
cp .env.example .env
```

Remplir ensuite `.env`.

### 4. Initialiser Prisma

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Build et lancement

```bash
npm run build
PORT=3000 npm run start
```

### 6. Service systemd

Créer `/etc/systemd/system/netwatch.service`

```ini
[Unit]
Description=NetWatch Next.js app
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/netwatch
Environment=NODE_ENV=production
Environment=PORT=3000
EnvironmentFile=/var/www/netwatch/.env
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Puis :

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now netwatch
sudo systemctl status netwatch
```

### 7. Reverse proxy Nginx

Créer `/etc/nginx/sites-available/netwatch`

```nginx
server {
    server_name speedtest.squal.cloud;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Activer le site :

```bash
sudo ln -s /etc/nginx/sites-available/netwatch /etc/nginx/sites-enabled/netwatch
sudo nginx -t
sudo systemctl reload nginx
```

### 8. HTTPS Let’s Encrypt

```bash
sudo certbot --nginx -d speedtest.squal.cloud
```

## Déploiement Docker sur Ubuntu

### 1. Installer Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

### 2. Déployer

```bash
mkdir -p /var/www/netwatch
cd /var/www/netwatch
# copier le projet ici
cp .env.docker.example .env
docker compose build
docker compose up -d
```

### 3. HTTPS

Le `docker-compose.yml` expose Nginx en HTTP sur le port `80`.
Pour la terminaison TLS, deux approches simples :

- utiliser un reverse proxy HTTPS déjà présent sur l’hôte
- ou adapter le conteneur Nginx pour monter des certificats Let’s Encrypt générés sur l’hôte

Pour un VPS perso simple, je recommande :

- Certbot sur l’hôte
- Nginx hôte en `443`
- proxy vers `127.0.0.1:80` du conteneur Nginx

## Conseils sécurité

- Utiliser un `API_KEY_PEPPER` long et unique
- Ne jamais versionner `.env`
- Renouveler une clé en créant un nouveau device ou en remplaçant son hash
- Garder PostgreSQL écoutant uniquement en local si possible
- Exposer uniquement `443` et `80` côté VPS
- Laisser le Raspberry Pi en trafic sortant uniquement
- Sauvegarder la base PostgreSQL et le CSV local du Raspberry Pi
- En mode Docker, ne pas exposer directement PostgreSQL vers l’extérieur

## Points de maintenance

- Le dashboard lit directement la base côté serveur pour l’UI
- Les routes API de lecture réutilisent les mêmes requêtes Prisma
- La logique online/offline est centralisée dans `lib/device-status.ts`
- La logique de hash d’API key est centralisée dans `lib/crypto.ts`

## Améliorations possibles ensuite

- authentification admin sur le dashboard
- relecture d’un backlog CSV non envoyé
- agrégations journalières matérialisées
- alertes email ou webhook sur forte dégradation
