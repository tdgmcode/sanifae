<style>
    .button {
        padding: 0.35rem;
        border: none;
        border-bottom: solid var(--dark-3) 3px;
        box-shadow: 0px 3px 5px 3px rgba(0,0,0,0.1);

        font-family: 'Open Sans';

        margin: 0.2rem;
        margin-top: 0.5rem;
        margin-bottom: 0rem;
    }

    .button option, .button {
        color: var(--dark-1);
        font-weight: bold;
        font-size: 1rem;
    }

</style>

<script>
    let val;
    export let clickFunc = () => {};
    export let options = [];
    export let selectedKey = false;
</script>

<select bind:value={val} on:change={() => clickFunc(val)} class='button'>
    {#if selectedKey}
        <option disabled selected value> {selectedKey}</option>
    {/if}
    {#each options as option}
        <option value={option.key} selected={option.key == selectedKey} >{option.val}</option>
    {/each}
    <slot />
</select>