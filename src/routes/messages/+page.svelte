<script>
    import { setLocation} from '$lib/util.js';
    import PostBody from '$lib/components/PostBody.svelte';
    import Area from '$lib/components/Area.svelte';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<style>
    .date {
        font-size: 0.8rem;
        font-style: italic;
        font-weight: normal;
    }
</style>

<Area handleSubmit=''>
    <span slot="header">
        Messages
    </span>

    <span slot='main'>
        {#if data && data.postJson}
            {#each data.postJson as post}
                <PostBody content={post.content} excludeImg={true} />
                <div class='date'>
                    {new Date(post.time / 1000)}
                </div>
            {/each}
        {/if}
    </span>
    <p slot="footer">
        Any messages and notifications sent to your profile.
    </p>
</Area>

<p>
    {#if data.id > 0}
        <a on:click={() => { window.location.search = setLocation(window.location,'page',((data.id)-1)) }} href='#'>← Page {(data.id)-1}</a>
    {/if}
    <b>Page {(data.id)}</b>
    <a on:click={() => { window.location.search = setLocation(window.location,'page',((data.id)+1)) }} href='#'>Page {(data.id)+1} →</a>
</p> 