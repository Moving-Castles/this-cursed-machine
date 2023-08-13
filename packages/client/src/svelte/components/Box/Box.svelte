<script lang='ts'>
    import { playerAddress, playerCore, playerBox, coresInPlayerBox} from '../../modules/state'
    import { transfer } from '../../modules/action';
    import { addressToColor } from '../../utils/misc';
</script>

<div class='box'>
    <div class='icon' style={"background: " + addressToColor($playerAddress) + ";"}/>
    <div>Core address: {$playerAddress}</div>
    <div>Core name: {$playerCore.name}</div>
    <div>Core creation block: {$playerCore.creationBlock}</div>
    <div>Core level: {$playerCore.level}</div>
    <hr/>
    <div class='icon' style={"background: " + addressToColor($playerCore.carriedBy) + ";"}/>
    <div>Box level: {$playerBox.level}</div>
    <div>Box address: {$playerCore.carriedBy}</div>
    <div>Box creation block: {$playerBox.creationBlock}</div>
    <div>Min. cores: {$playerBox.minCores}</div>
    <div>Max. cores: {$playerBox.maxCores}</div>
    {#if $coresInPlayerBox.length > 0}
        <div>Cores in box: ({$coresInPlayerBox.length}) == {$coresInPlayerBox.map(c => c.name).reduce((acc, val) => acc + (val + ', '))}</div>
    {/if}
    <div>Box width: {$playerBox.width}</div>
    <div>Box height: {$playerBox.height}</div>
    <div>Box active: {$playerBox.active}</div>
    <hr/>
    {#if $playerBox.active}
        <button on:click={transfer}>Transfer</button>
    {:else}
        <div><strong>WAITING........</strong></div>
    {/if}
</div>

<style>
    .box {
        position: fixed;
        top: 0;
        left: 0;
        padding: 40px;
        height: 100vh;
        width: 100vw;
        background-color: #444;
        font-size: 18px;
        z-index: 1000;
    }

    .icon {
        height: 50px;
        width: 50px;
    }
</style>