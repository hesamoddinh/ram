#!/bin/bash
#
# Exit on any failure
set -e

mkdir $HOME/RAMProject
cd $HOME/RAMProject
sudo git clone https://github.com/hesamoddinh/ram.git

# Install Fabric Samples
sudo mkdir $HOME/hyperledger
cd $HOME/hyperledger
git clone -b master https://github.com/hyperledger/fabric-samples.git

# Install Binaries:
sudo -i
cd /home/[user]/hyperledger/
sudo curl -sSL https://goo.gl/6wtTN5 | bash -s 1.1.0
export PATH=$PATH:$HOME/hyperledger/bin

# 0.Map Docker Domains to localhost, Edit the file `/etc/hosts` and add these lines at the end of file:
echo 127.0.0.1       orderer.example.com  >> /etc/hosts
echo 127.0.0.1       example.com  >> /etc/hosts
echo 127.0.0.1       peer0.a.example.com  >> /etc/hosts
echo 127.0.0.1       peer0.b.example.com  >> /etc/hosts
echo 127.0.0.1       peer0.c.example.com  >> /etc/hosts
echo 127.0.0.1       ca.a.example.com  >> /etc/hosts

#1.Generate
cd $HOME/RAMProject/ram
sudo ./network.sh -m generate

#2.Up
sudo ./network.sh -m up

#3.Run WebApi for 3 Orgs With PM2
cd $HOME/RAMProject/ram/webapp
sudo npm install 
sudo npm install -g pm2
sudo ORG=a PORT=9001 pm2 start npm --name "a-org" -- start
sudo ORG=b PORT=9002 pm2 start npm --name "b-org" -- start
sudo ORG=c PORT=9003 pm2 start npm --name "c-org" -- start


#4.Build React Web Client
cd $HOME/RAMProject/ram/react-webapp
sudo npm install
sudo npm install -g pm2
sudo npm start
