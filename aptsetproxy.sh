#!/bin/bash
#Acquire::http::Proxy "http://user:password@proxy.server:port/";
#Acquire::https::Proxy "http://user:password@proxy.server:port/";
# Exit on any failure
set -e

sudo touch /etc/apt/apt.conf.d/proxy.conf
echo Acquire::http::proxy "http://x.x.x.x:y/";
echo Acquire::https::proxy "http://x.x.x.x:y/";
echo Acquire::ftp::proxy "http://x.x.x.x:y/";
