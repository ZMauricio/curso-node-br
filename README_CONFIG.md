# =========================
# === Instalar o docker ===
# =========================
#  sudo apt-get update
#  sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

# === Abaixo é usado um comando adaptado para o Linux Mint 18
# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
# sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu xenial stable"


# sudo apt-get update
# sudo apt-get install docker-ce docker-ce-cli containerd.io

# === Fonte: 
# 1 https://docs.docker.com/engine/install/ubuntu/ installation-methods
# 2 https://gist.github.com/dweldon/39ca0536168a92815a56df44eb55a337

# ============================================
# === Criação do banco de dados postgreSQL ===
# ============================================
# sudo docker run --name postgres -e POSTGRES_USER=mauricio -e POSTGRES_PASSWORD=123 -e POSTGRES_DB=heroes -p 5432:5432 -d postgres

# sudo docker ps
# sudo docker exec -it postgres /bin/bash

# sudo docker run --name adminer -p 8080:8080 --link postgres:postgres -d adminer

# //Obs: o nome do serviço(servidor) é postgres e a base de dados é heroes

# sudo docker ps // Verificar o estado ou ID dos containers
# sudo docker start postgres // Ativar o container postgres
# sudo docker start adminer // Ativar o container adminer
# sudo docker stop postgres // Parar o container postgres
# sudo docker stop adminer // Parar o container adminer

# =========================================
# === Criação do banco de dados MongoDB ===
# =========================================

# sudo docker run --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=123 -d mongo:4

# === Criar cliente do mongodb ===
# sudo docker run --name mongoclient -p 3000:3000 --link mongodb:mongodb -d mongoclient/mongoclient

# === Criar usuário do mongodb ===
# sudo docker exec -it mongodb mongo --host localhost -u admin -p 123 --authenticationDatabase admin --eval "db.getSiblingDB('heroes').createUser({user: 'mauricio', pwd: '123', roles:[{role: 'readWrite', db: 'heroes'}]})"