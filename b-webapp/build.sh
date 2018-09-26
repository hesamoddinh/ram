#!/bin/bash
cp ../server/package.json ./
# verion with dropped PATCH part (https://semver.org/)
VERSION=$(jq -r .version package.json)
echo "Building maxxx1313/fabric-rest-core:$VERSION-test"
docker build -t maxxx1313/fabric-rest-core:$VERSION .
rm package.json