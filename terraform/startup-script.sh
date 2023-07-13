wget -O- https://apt.corretto.aws/corretto.key | sudo apt-key add -
sudo add-apt-repository 'deb https://apt.corretto.aws stable main'
sudo apt-get update
sudo apt-get install -y java-17-amazon-corretto-jdk
sudo apt-get install -y nginx
sudo apt-get install -y unzip
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
nvm install 18.16.1
gsutil cp gs://balanzas-package/tse-g14-carga.uy-balanzas.zip /tmp
mkdir /apps
mkdir /apps/balanzas
unzip /tmp/tse-g14-carga.uy-balanzas.zip -d /apps/balanzas
cd /apps/balanzas/tse-g14-carga.uy-balanzas && npm i && npm start &