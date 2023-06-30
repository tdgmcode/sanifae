<script>
    import HeaderSelect from './HeaderSelect.svelte';
    import { page } from '$app/stores';  

    let path = $page.url.origin;

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
        justify-content: space-between;

        position: sticky;
        top: 0;
        
        z-index: 10;
    }

    #logo div {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        margin-left: 25px;
        margin-right: 25px;
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
    <div>
        <a href='/'>
            <img src='/icon_sanifae.svg' alt='Sanifae Logo'>
        </a>
        {#if data.username && data.username != 'false'}
            <a href='/new_post'>
                Post
            </a>
        {/if}
    </div>
    <div> 
        {#if data.username && data.username != 'false'}
            <HeaderSelect
                data={[
                    {'value': '#', 'key': data.username},
                    {'value': `/users/${data.username}`, 'key': 'Profile'},
                    {'value': '/account/settings', 'key': 'Settings'},
                    {'value': '/account/logout', 'key': 'Log out'},
                ]}
            />  
        {:else}
            <HeaderSelect
                data={[
                    {'value': '#', 'key': 'Join Sanifae'},
                    {'value': 'https://auth.montidg.net/account/auth?scope=sanifae&next='+path+'/account/auth', 'key': 'Log in'}
                ]}
            />
        {/if}
        {#if data.read > 0}
            <a href='/messages'>
                <img src='/unread.svg' alt='Messages'>
            </a>
        {:else}
            <a href='/messages'>
                <img src='/read.svg' alt='Messages'>
            </a>
        {/if}
    </div>
        
</div>