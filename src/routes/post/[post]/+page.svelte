<script>
    import PostList from '$lib/components/PostList.svelte';
    import Post from '$lib/components/Post.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let firstEntry = data.postJson.data.shift();
</script>

{#if firstEntry.username}
    <Post
        success={firstEntry.success}
        username={firstEntry.username}
        content={firstEntry.content}
        upvotes={firstEntry.upvotes}
        downvotes={firstEntry.downvotes}
        id={firstEntry.id}
        isAuthor={firstEntry.isAuthor}
        time={firstEntry.time}
    ></Post>
{/if}

<PostList data={data} />