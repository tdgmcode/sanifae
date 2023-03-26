<script>
    import Area from '$lib/components/Area.svelte';
    import PostButton from '$lib/components/PostButton.svelte';
    import PostBody from '$lib/components/PostBody.svelte';

    export let success, username, content, upvotes, downvotes, id, isAuthor, time;

    let date = 'Time unknown';

    if (time)
        date = new Date(time / 1000);

    let query = (id) ? `/post/${id}` : '';

    let fData;

    function vote(v) {
        fData = (new FormData());

        fData.append('vote',v);
        fData.append('id',id);

        fetch('/api/vote', {
            method: 'POST',
            body: fData
        }).then(async x => {
            var j = (await x.json());
            upvotes = j.data.up;
            downvotes = j.data.down;
        })
    }

    function deletePost(v) {
        fData = (new FormData());

        fData.append('id',id);

        fetch('/api/postDelete', {
            method: 'POST',
            body: fData
        }).then(async x => {
            window.location.href = '/';
        })
    }

</script>

<style>
    #header {
        display: flex;
        align-items: center;
    }
    
    .votes {
        font-weight: bold;
        font-size: 1.5rem;
    }
    
    
    #header-area {
        display: flex;
        flex-direction: column;
    }

    img {
        max-width: 250px;
    }

    .pfp {
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 100%;
    }

    .date {
        font-size: 0.8rem;
        font-style: italic;
        font-weight: normal;
    }

    .votes {
        display: flex;
        
    }
</style>

{#if success}
    <Area>
        <p slot="header">
            Error
        </p>
        <p slot="main">
            {success}
        </p>
        <p slot="footer">
            Failed to get post.
        </p>
    </Area>
{:else if content}
    <Area>
        <span slot="header" id='header'>
            <img class='pfp' src='/img/pfp/{username}.png'/>
            <div class='header-area'>
                <div><a href='/users/{username}'>
                    {username}
                </a></div>
                <div class='date'>
                    {date}
                </div>
            </div>
        </span>
        <span slot="main">
            <PostBody content={content} />
        </span>
        <span slot="footer" class='votes'>
            <PostButton
                clickFunc={() => vote('up')}
                data={upvotes * 1}
                icon='/upvote.svg'
            />
            <PostButton
                clickFunc={() => vote('down')}
                data={downvotes * 1 }
                icon='/downvote.svg'
            />
            {#if isAuthor}
                <PostButton
                    clickFunc={() => deletePost()}
                    data={''}
                    icon='/delete.svg'
                />
                <PostButton
                    href='/new_post?edit={id}&init={encodeURIComponent(content)}'
                    data={''}
                    icon='/edit.svg'
                />
            {/if}
            {#if id}
                <PostButton
                    href='/post/{id}'
                    data={''}
                    icon='/view.svg'
                />
            {/if}
            <PostButton
                href='/new_post?init=%23{id}'
                data={''}
                icon='/reply.svg'
            />
        </span>
    </Area>
{/if}