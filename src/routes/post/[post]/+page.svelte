<script>
    import PostList from '$lib/components/PostList.svelte';
    import Post from '$lib/components/Post.svelte';
    import Meta from '$lib/components/Meta.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let firstEntry = data.postJson.data.shift();

    let postUser = (firstEntry) ? firstEntry.username : 'Unknown User';
</script>

<svelte:head>
	<Meta title='Post by {postUser || "Unknown user"}' />
</svelte:head>

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
        overflow={false}
    ></Post>
{/if}

<PostList data={data} />