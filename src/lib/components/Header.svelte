<script>
    export let data = '';
</script>

<style>
  

    #logo {

        width: calc(100vw - 10px);

        background: var(--dark-1);

        padding: 5px;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;

        position: sticky;
        top: 0;
        
        z-index: 10;
    }

    #logo a {
        padding: 10px;
        color: var(--light-1);
        font-weight: bold;
    }

    #logo img {
        height: 30px;
        width: auto;

        display: block;
    }
</style>

<div id='logo'>
    <a href='/'>
        <img src='/icon_sanifae.svg' alt='Sanifae Logo'>
    </a>
    {#if data.read > 0}
        <a href='/messages'>
            <img src='/unread.svg' alt='Messages'>
        </a>
    {:else}
        <a href='/messages'>
            <img src='/read.svg' alt='Messages'>
        </a>
    {/if}
    {#if data.username && data.username != 'false'}
        <a href='/users/{data.username}'>
            {data.username}
        </a>
        <a href='/account/logout'>
            Log out
        </a>
        <a href='/new_post'>
            Create
        </a>
        <a href='/chat/main'>
            Chat
        </a>
    {:else}
        <a href='/account/login'>
            Log in
        </a>
        <a href='/account/register'>
            Register
        </a>
    {/if}
    <a href='/tos'>
        Rules
    </a>
</div>