set -e

echo "[INFO] Starting Exisse Deploy..."

BE_PROJECT="exisse-be-app"
export DISABLE_ESLINT_PLUGIN=true

echo "[INFO] Start compiling react frontend locally."
docker-compose -f "deploy/docker-compose.staging.yml" up --build

echo "[INFO] Move react build to backend project."
mkdir -p ../${BE_PROJECT}/deploy/proxy/build
cp -r deploy/build ../${BE_PROJECT}/deploy/proxy

echo "[INFO] Starting docker compose."
docker-compose -f "../${BE_PROJECT}/deploy/docker-compose.staging.yml" up --build -d

echo "Deploy Completed."