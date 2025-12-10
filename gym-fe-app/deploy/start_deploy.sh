set -e

echo "[INFO] Starting Exisse Deploy..."

HOST="edoaws"
BE_PROJECT="exisse-be-app"
ssh ${HOST} export DISABLE_ESLINT_PLUGIN=true


echo '[INFO] Stop currently running containers.'
ssh ${HOST} docker-compose -f "${BE_PROJECT}/deploy/docker-compose.staging.yml" down

echo '[INFO] Deleting old repository version.'
ssh ${HOST} rm -rf ${BE_PROJECT}

echo '[INFO] Fetching updated backend repository from Github.'
ssh ${HOST} git clone git@github.com:GES-Team/${BE_PROJECT}.git

echo "[INFO] Copying environmental variables."
scp -r ../${BE_PROJECT}/environments edoaws:${BE_PROJECT}

echo '[INFO] Deleting old local build'
rm -rf deploy/build

echo "[INFO] Start compiling react frontend locally."
docker-compose -f "deploy/docker-compose.staging.yml" up --build

echo "[INFO] Upload react build to AWS."
ssh ${HOST} mkdir -p ${BE_PROJECT}/deploy/proxy/build
scp -r deploy/build edoaws:${BE_PROJECT}/deploy/proxy

echo "[INFO] Starting docker compose."
ssh ${HOST} docker-compose -f "${BE_PROJECT}/deploy/docker-compose.staging.yml" up --build -d

echo "Deploy Completed."