<script>
    import { playerPod } from '@modules/state/base/stores';
    import { blockNumber } from '@modules/network';
    import { networkIsRunning } from '@modules/state/simulated/stores';
    import { blocksSinceLastResolution, localResolved } from '@modules/state/resolver/stores';
</script>

<div class='debug'>
    <div class='header'>Chain</div>
    <div>CurrentBlock: {$blockNumber}</div>
    <div>Last resolved: {$playerPod.lastResolved}</div>
    <div class='header'>Local</div>
    <div>running: {$networkIsRunning}</div>
    <div>blockSinceLastResolution: {$blocksSinceLastResolution}</div>
    <div>localResolved: {$localResolved}</div>
</div>

<style lang="scss">
    .debug {
        position: fixed;
        top: 10px;
        right: 10px;
        padding: 20px;
        background: red;
        z-index: 10000;
        font-family: monospace;
        opacity: 0.9;
        text-transform: unset !important;

        .header {
            font-weight: bold;
        }
    }
</style>