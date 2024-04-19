#!/bin/bash
# echo "waiting for 3m..."
# sleep 60
# echo "...2m left..."
# sleep 60
# echo "...1m left..."
# sleep 60
# echo "running"

# Local defaults
LOCAL_WORLD_ADDRESS=0xd6c8022f1af8e9d7c3825557a1374ee518c65a4e
LOCAL_RPC=http://localhost:8545

RPC=$LOCAL_RPC
WORLD_ADDRESS=$LOCAL_WORLD_ADDRESS

echo "Create testing orders..."
forge script ./CreateOrders.s.sol --sig run\(address\) $WORLD_ADDRESS --rpc-url $RPC --broadcast -vvv
