#!/bin/bash
#/etc/environment
#http_proxy="http://<username>:<password>@<hostname>:<port>/"
#https_proxy="http://<username>:<password>@<hostname>:<port>/"
#ftp_proxy="http://<username>:<password>@<hostname>:<port>/"
#no_proxy="<pattern>,<pattern>,...
# Exit on any failure
set -e

sudo echo http_proxy="http://my.proxyserver.net:8080/" >> /etc/environment
sudo echo https_proxy="http://my.proxyserver.net:8080/" >> /etc/environment
sudo echo ftp_proxy="http://my.proxyserver.net:8080/" >> /etc/environment
#no_proxy="localhost,127.0.0.1,::1
