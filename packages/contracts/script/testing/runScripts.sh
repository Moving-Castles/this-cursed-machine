#!/bin/bash

# Local defaults
LOCAL_WORLD_ADDRESS=0xcb4eb503f4cae4579a6f0886b499b730ee879c8f
LOCAL_DEPLOYER_ADDRESS=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
LOCAL_RPC=http://localhost:8545

# Garnet
GARNET_WORLD_ADDRESS=0x2bb7caabb3926c0589e6cc3a96f480e647f0f1d7
GARNET_DEPLOYER_ADDRESS=0x111
GARNET_RPC=https://rpc.garnet.qry.live

# Redstone
REDSTONE_WORLD_ADDRESS=0xf6cd89de2dfa17dcf699e8e848351b6ddf805df3
REDSTONE_DEPLOYER_ADDRESS=0x222
REDSTONE_RPC=xxxxx

RPC=$LOCAL_RPC
WORLD_ADDRESS=$LOCAL_WORLD_ADDRESS

echo "Create testing orders..."
forge script ./CreateOrders.s.sol --sig run\(address\) $WORLD_ADDRESS --rpc-url $RPC --broadcast -vvv
