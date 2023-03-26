<style>    
    #content {
        background: url(/bg.svg) center center / cover;

        height: 100vh;
        width: 100vw;
        padding-top: 0px;

        display: flex;
        flex-direction: column;
        align-items: center;

        overflow-y: auto;
    }
    
    :global(:root) {
        --dark-1: #2b2f36;
        --dark-2: #d8d8d8;
        --dark-3: rgb(73, 138, 236);

        --light-1: #ffffff;
        --light-2: #f8f8f8;
        
        --hyperlink: rgb(139, 171, 219);

        font-family: 'Open Sans';
    }

    :global(a) {
        color: var(--hyperlink);
        text-decoration: none;
    }

    :global(input, textarea) {
        border: 0;
        border-radius: 0.2rem;
        box-shadow: 0px 0px 2px 2px var(--dark-2);

        font-size: 1rem;
        padding: 0.5rem;
    }

</style>

<script>
    /** @type {import('./$types').PageData} */
    export let data;

    import Header from '$lib/components/Header.svelte';

</script>

<div id='content'>
    <Header data={data} />
    <slot />
</div>

