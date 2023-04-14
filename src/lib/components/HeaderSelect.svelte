<style> 
    select {
        padding: 0.35rem;
        border: none;

        font-family: 'Open Sans';

        margin: 0;

        color: white;
        font-weight: bold;
        font-size: 1rem;

        background: var(--dark-1);
    }
</style>

<script>
    export let data = [];
    let val;
</script>

<select bind:value={val} on:change={() => window.location = val}>
    {#each data as entry}
        <option value={entry.value} disabled={entry.value == data[0].value} selected={entry.value == '#'} >
            {entry.key}
        </option>
    {/each}
</select>