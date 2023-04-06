<script>
    import HeaderSelect from './HeaderSelect.svelte';

    export let data = '';
</script>

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
        <HeaderSelect
            data={[
                {'value': '#', 'key': data.username},
                {'value': `/users/${data.username}`, 'key': 'Profile'},
                {'value': '/account/settings', 'key': 'Settings'},
                {'value': '/account/logout', 'key': 'Log out'},
            ]}
        />

        <HeaderSelect
            data={[
                {'value': '#', 'key': 'Create'},
                {'value': '/new_post', 'key': 'Post'},
                {'value': '/chat/main', 'key': 'Main chat'},
            ]}
        />
    {:else}
        <HeaderSelect
            data={[
                {'value': '#', 'key': 'Join Sanifae'},
                {'value': '/account/login', 'key': 'Log in'},
                {'value': '/account/register', 'key': 'Register'}
            ]}
        />
    {/if}
</div>