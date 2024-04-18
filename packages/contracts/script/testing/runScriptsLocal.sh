#!/bin/bash
echo "waiting for 3m..."
sleep 60
echo "...2m left..."
sleep 60
echo "...1m left..."
sleep 60
echo "running"

# Local defaults
LOCAL_WORLD_ADDRESS=0xc14fbdb7808d9e2a37c1a45b635c8c3ff64a1cc1
LOCAL_RPC=http://localhost:8545

# Garnet
GARNET_RPC=https://rpc.garnet.qry.live
GARNET_WORLD_ADDRESS=0xcb94f7570e26b639224e656e34cee7fba8c9da46

RPC=$LOCAL_RPC
WORLD_ADDRESS=$LOCAL_WORLD_ADDRESS

echo "Create testing orders..."
forge script ./CreateOrders.s.sol --sig run\(address\) $WORLD_ADDRESS --rpc-url $RPC --broadcast -vvv
