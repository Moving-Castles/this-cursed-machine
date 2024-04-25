# Local defaults
LOCAL_WORLD_ADDRESS=0xd6c8022f1af8e9d7c3825557a1374ee518c65a4e
LOCAL_RPC=http://localhost:8545

RPC=$LOCAL_RPC
WORLD_ADDRESS=$LOCAL_WORLD_ADDRESS

BATCH_SIZE=5

forge script PostDeploy --sig run\(address\) $WORLD_ADDRESS --broadcast --rpc-url $RPC -vvvv --batch-size $BATCH_SIZE