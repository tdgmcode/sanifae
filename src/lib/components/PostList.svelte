<script>
    import Post from '$lib/components/Post.svelte';
    import Button from '$lib/components/Button.svelte';
    import Dropdown from '$lib/components/Dropdown.svelte';
    import {setLocation} from '$lib/util.js';

    export let data, noRatings = false;
</script>

{#if !noRatings}
    <Dropdown 
        selectedKey='Sort by'
        clickFunc={(val) => { window.location.search = setLocation(window.location,'sort',val)}}
        options={[
            {
                'key': 'hot',
                'val': 'Hot',
            },
            {
                'key': 'rating',
                'val': 'Top',
            },
            {
                'key': 'time',
                'val': 'New',
            }
        ]}
    />       
{/if}

{#if data && data.postJson && data.postJson.data}
    {#each data.postJson.data as post}
        <Post overflow={true}
            success={post.success}
            username={post.username}
            content={post.content}
            upvotes={post.upvotes}
            downvotes={post.downvotes}
            id={post.id}
            isAuthor={post.isAuthor}
            time={post.time}
        ></Post>
    {/each}
{/if}

<span>
    {#if data.id > 0}
        <Button clickFunc={() => { window.location.search = setLocation(window.location,'page',((data.id)-1)) }} href='#'>Page {(data.id)-1}</Button>
    {/if}
    <Button>Page {(data.id)}</Button>
    <Button clickFunc={() => { window.location.search = setLocation(window.location,'page',((data.id)+1)) }} href='#'>Page {(data.id)+1}</Button>
</span>