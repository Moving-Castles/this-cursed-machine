#!/bin/bash

# Local defaults
LOCAL_WORLD_ADDRESS=0xd6c8022f1af8e9d7c3825557a1374ee518c65a4e
LOCAL_RPC=http://localhost:8545

# Garnet
GARNET_RPC=https://rpc.garnet.qry.live
GARNET_WORLD_ADDRESS=0x732d7581cff3ea2c54f55e09b0084ee11ddc86de

# Redstone
REDSTONE_RPC=xxxxx
REDSTONE_WORLD_ADDRESS=0xf6cd89de2dfa17dcf699e8e848351b6ddf805df3

RPC=$REDSTONE_RPC
WORLD_ADDRESS=$REDSTONE_WORLD_ADDRESS

echo "Create testing orders..."
forge script ./CreateOrders.s.sol --sig run\(address\) $WORLD_ADDRESS --rpc-url $RPC --broadcast -vvv --slow
