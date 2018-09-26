####0.Map Docker Domains to localhost
Edit the file `/etc/hosts` and add these lines at the end of file:
```
127.0.0.1       orderer.example.com
127.0.0.1       example.com
127.0.0.1       peer0.a.example.com
127.0.0.1       peer0.b.example.com
127.0.0.1       peer0.c.example.com
127.0.0.1       ca.a.example.com
```
####1.Generate
```bash
./netowrk.sh -m generate
```
####2.Up
```bash
./netowrk.sh -m up
```
####3.Run WebApi for 3 Orgs With PM2
Install pm2 if it is not installed.
 ```bash
 cd webapp
 sudo ORG=a PORT=9001 pm2 start npm --name "a-org" -- start
 sudo ORG=b PORT=9002 pm2 start npm --name "b-org" -- start
 sudo ORG=c PORT=9003 pm2 start npm --name "c-org" -- start
 ```
 ####4.Build React Web Client
 ```bash
 cd ../react-webapp
 npm run build
 ```
 ####5.Create Indexes on CouchDB Instances
 ```bash
     curl -H "Content-Type:application/json" --data '{"index": {"fields": ["Created"]},"name": "Created-json-index","type": "json"}' http://127.0.0.1:17051/common_mycc/_index && curl -H "Content-Type:application/json" --data '{"index": {"fields": ["Created"]},"name": "Created-json-index","type": "json"}' http://127.0.0.1:17056/common_mycc/_index && curl -H "Content-Type:application/json" --data '{"index": {"fields": ["Created"]},"name": "Created-json-index","type": "json"}' http://127.0.0.1:18051/common_mycc/_index && curl -H "Content-Type:application/json" --data '{"index": {"fields": ["Created"]},"name": "Created-json-index","type": "json"}' http://127.0.0.1:18056/common_mycc/_index && curl -H "Content-Type:application/json" --data '{"index": {"fields": ["Created"]},"name": "Created-json-index","type": "json"}' http://127.0.0.1:19051/common_mycc/_index && curl -H "Content-Type:application/json" --data '{"index": {"fields": ["Created"]},"name": "Created-json-index","type": "json"}' http://127.0.0.1:19056/common_mycc/_index
 ```
 All done!

####Restart Network
```bash
./network.sh -m down
./network.sh -m clean
./network.sh -m generate
./network.sh -m up
```
#####Ports In Use
* 9001 (NodeSDK WebApi - ORG a)
* 9002 (NodeSDK WebApi - ORG b)
* 9003 (NodeSDK WebApi - ORG c)
* 17051 (CouchDB - peer0.a)
* 17056 (CouchDB - peer1.a)
* 18051 (CouchDB - peer0.b)
* 18056 (CouchDB - peer1.b)
* 19051 (CouchDB - peer0.c)
* 19056 (CouchDB - peer1.c)
* 7051, 7053 (Peer - peer0.a)
* 7056, 7058 (Peer - peer0.a)
* 8051, 8053 (Peer - peer0.b)
* 8056, 8058 (Peer - peer1.b)
* 9051, 9053 (Peer - peer0.c)
* 9056, 9058 (Peer - peer1.c)
* 7050 (Orderer - orderer.example.com)
* 9090 (Nginx - www.example.com)
* 9091 (Nginx - www.a.example.com)
* 9092 (Nginx - www.b.example.com)
* 9093 (Nginx - www.c.example.com)




https://stackoverflow.com/questions/43626320/ltdl-h-not-found-error-while-building-chaincode