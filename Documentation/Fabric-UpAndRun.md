#Prerequisites
##Install cURL
```bash
sudo apt install curl
```
##Install Docker
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt-get update
sudo apt-get install -y docker-ce
sudo systemctl status docker
```
If you want to avoid typing `sudo` whenever you run the `docker` command, add your username to the `docker` group:
```bash
sudo usermod -aG docker ${USER}
su - ${USER}
```
To read more about docker, continue reading this [document](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04). 
##Install Go Language
```bash
sudo apt-get update
sudo apt-get -y upgrade
wget https://dl.google.com/go/go1.10.1.linux-amd64.tar.gz
sudo tar -xvf go1.10.1.linux-amd64.tar.gz
sudo mv go /usr/local
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```
##Install Node.js and NPM
```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
##Install python 2.7
```bash
sudo apt-get install python
```
check the version to be 2.7:
```bash
python --version
```
#Install Fabric Samples
##Download Fabric Samples
Choose the location to clone fabric-samples repository, then execute following commands. Suppose `$HOME/hyperledger` as parent directory:
```bash
cd $HOME/hyperledger
git clone -b master https://github.com/hyperledger/fabric-samples.git
cd fabric-samples
```
 ##Download Platform-specific Binaries
Platform-specific Binaries are CLI tools and Docker images which is used to setup, run and and interact with fabric network.  
Here is the list CLI tools:  
* <span style="color:red">cryptogen</span>
* <span style="color:red">configtxgen</span>
* <span style="color:red">configtxlator</span>
* <span style="color:red">peer</span>
* <span style="color:red">orderer</span>
* <span style="color:red">fabric-ca-client</span>  

Below command will download binaries, create a `bin` directory and place binaries inside it. So you should navigate to your preferred path for `bin` directory and execute this command. Suppose `$HOME/hyperledger` as our desired path: 
```bash
cd $HOME/hyperledger/
curl -sSL https://goo.gl/6wtTN5 | bash -s 1.1.0
```
Then add the `bin` path to `PATH` variable, in order to execute the command **without** having to navigate to `bin` directory.
```bash
export PATH=$PATH:$HOME/hyperledger/bin
```
After downloading CLI tools, script will download Hyperledger Fabric docker images. You can see a list of these images after script execution completion. 
