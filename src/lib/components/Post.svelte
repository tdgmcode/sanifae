<script>
    import Area from '$lib/components/Area.svelte';
    import PostButton from '$lib/components/PostButton.svelte';
    import PostBody from '$lib/components/PostBody.svelte';

    export let success, username, content, upvotes, downvotes, id, isAuthor, time, overflow;

    let clicked = true;
    
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

    .black {
        color: black;
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
<!-- svelte-ignore a11y-click-events-have-key-events -->
<a class='black' href='/post/{id}'>
    <Area overflow={overflow}>
        <span slot="header" id='header'>
            <!-- svelte-ignore a11y-missing-attribute -->
            <img class='pfp' src='/img/pfp/{username}.png'/>
            <div class='header-area'>
                <div><a href='/users/{username}'>
                    {username}
                </a></div>
                <div class='date'>
                    Posted on {date}
                </div>
            </div>
        </span>
        <span slot="main">
            <PostBody content={content} />
        </span>
        <span slot="footer">
            <span class='votes'>
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
                <PostButton
                    href='/new_post?init=%23{id}'
                    data={''}
                    icon='/reply.svg'
                />
            </span>
            {#if isAuthor}
                <span class='votes' >
                    <PostButton
                        clickFunc={() => clicked = !clicked}
                        data={'Actions'}
                        icon='/delete.svg'
                    />
                    <span hidden={clicked}>
                        <PostButton
                            clickFunc={() => deletePost()}
                            data={'Delete'}
                            icon='/delete.svg'
                        />
                    </span>
                    <span hidden={clicked}>
                        <PostButton
                            href='/new_post?edit={id}&init={encodeURIComponent(content)}'
                            data={'Edit'}
                            icon='/edit.svg'
                        />
                    </span>
                </span>
            {/if}
        </span>
    </Area>
</a>
{/if}