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
    export let clickFunc = () => {};
    export let href = '#';
    export let data = ' ';
    export let icon = '/upvote.svg';
</script>

<span class='vote-area'>
    <a on:click={clickFunc} href='{href}'>
        <img src='{icon}' class='button' alt='Vote button'>
    </a>
    <div class='votes'>
        {data}
    </div>
</span>