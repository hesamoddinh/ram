#!/usr/bin/env bash

function getCouchDbPortForOrg () {
    peer_port=$(( $1 ))
    local couchdb_port=${peer_port}+10000
    echo $(( couchdb_port ))
}

res=$(getCouchDbPortForOrg 7051)

echo $(( res ))