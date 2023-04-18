<script>
    import Button from '$lib/components/Button.svelte'
    import Area from '$lib/components/Area.svelte';
    import PostList from '$lib/components/PostList.svelte';
    import PostBody from '$lib/components/PostBody.svelte';
    import Meta from '$lib/components/Meta.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let userData, following, followers, username;

    let uploadForm = {};

    $: userData = data.postJsonUser.data;
    
    $: username = userData ? (userData.username) : false;

    $: following = data.postJsonUser.following;
    $: followers = data.postJsonUser.followers;

    let submitter;

    function follow() {
        let fData = (new FormData());

        fData.append('target',userData.username);

        fetch('/api/follow', {
            method: 'POST',
            body: fData
        }).then(async x => {
            let xJson = (await x.json()).data;
            following = xJson.following;
            followers = xJson.followers;
        })
    }

    async function inputHandler(e) {
        if(!e.key || (e.key == "Enter" && !e.shiftKey)) {
            submitter.click();
        }
    }
</script>

<svelte:head>
	<Meta title={username || "Unknown user"} file='/img/pfp/{username || ""}.png' />
</svelte:head>

<style>
    .follower {
        margin-right: 1.5rem;
    }

    .pfp {
        width: 100px;
        height: 100px;
        border-radius: 100%;
    }

    .pfp-small {
        width: 45px;
        height: 45px;
        border-radius: 100%;
    }

    #header {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .sections {
        display: grid;
        grid-template-columns: 1fr 1fr;
    }

    .sections div {
        text-align: right;
        max-height: 300px;
        overflow-y: auto;
    }

    textarea {
        width: 80%;
        height: 5rem;
    }

    .sections div:nth-child(1) {
        text-align: left;
    }

    .profile {
        align-items: center;
        flex-direction: column;  
        display: flex;
    }
</style>

{#if userData}
    <Area>
        <span slot="header" id='header'>
            <div class='profile'>
                <img class='pfp' src='/img/pfp/{userData.username}.png'/>
                <a href='/users/{userData.username}'>
                    {userData.username}
                </a>
            </div>
            <div>
                <Button clickFunc={follow}>
                    Follow
                </Button>
                <a href='/chat/msg:{[userData.username,data.resAcc.data].sort().join(':')}'>
                    <Button clickFunc={follow}>
                        Message
                    </Button>
                </a>
            </div>
        </span>
        <span slot="main">
            <div class='sections'>
                <div>
                    <p class='data'>
                        <span class='follower'>
                            <b>{userData.reputation}</b> reputation <b>(+{userData.upvotes}) (-{userData.downvotes})</b>
                        </span>
                    </p>
                </div>
                <div>
                    <p class='data'>
                        <span class='follower'>
                            <PostBody content={userData.pinned || ''} excludeImg={true} />
                        </span>
                    </p>
                </div>
            </div>

            {#if userData.rolesArr}
                <p>
                    {#each userData.rolesArr as role} 
                        <b class='follower'>{role}</b>
                    {/each}
                </p>
            {/if}

            <div class='sections'>   
                <div>           
                <p><b>{following.length}</b> following</p>
                    {#each following as user}
                        <a href='/users/{user.following}'>
                            <img class='pfp-small' src='/img/pfp/{user.following}.png'/> 
                        </a>
                    {/each}
                </div>

                <div>
                    <p><b>{followers.length}</b> followers</p>
                    {#each followers as user}
                        <a href='/users/{user.username}'>
                            <img class='pfp-small' src='/img/pfp/{user.username}.png'/>    
                        </a>
                    {/each}
                </div>
            </div>
        </span>
        <span slot="footer">

        </span>
    </Area>
{:else}
    <Area>
        <span slot="header">
            <a href='/users/{data.user}'>
                {data.user}
            </a>
        </span>
        <span slot="main">
        </span>
        <span slot="footer">
            This user does not have any statistics available.
        </span>
    </Area>
{/if}

<PostList data={data} />
