<style>
    .votes {
        font-weight: bold;
        font-size: 0.9rem;
        margin-left: 5px;
    }
    .vote-area {
        margin-right: 15px;
        display: flex;
        align-items: center;
    }

    .button {
        width: auto;
        height: 20px;
    }

</style>

<script>
    export let clickFunc = false;
    export let href = '#';
    export let data = ' ';
    export let icon = '/upvote.svg';
</script>

<span class='vote-area'>
    {#if clickFunc}
        <a on:click|preventDefault={clickFunc} href='{href}'>
            <img src='{icon}' class='button' alt='Vote button'>
        </a>
    {:else}
        <a href='{href}'>
            <img src='{icon}' class='button' alt='Vote button'>
        </a>
    {/if}
    <div class='votes'>
        {data}
    </div>
</span>