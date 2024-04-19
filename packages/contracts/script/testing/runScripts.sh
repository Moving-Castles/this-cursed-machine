#!/bin/bash

# Local defaults
LOCAL_WORLD_ADDRESS=0xd6c8022f1af8e9d7c3825557a1374ee518c65a4e
LOCAL_RPC=http://localhost:8545

# Garnet
GARNET_RPC=https://rpc.garnet.qry.live
GARNET_WORLD_ADDRESS=0xcb94f7570e26b639224e656e34cee7fba8c9da46

RPC=$LOCAL_RPC
WORLD_ADDRESS=$LOCAL_WORLD_ADDRESS

echo "Create testing orders..."
forge script ./CreateOrders.s.sol --sig run\(address\) $WORLD_ADDRESS --rpc-url $RPC --broadcast -vvv
