<script>
    import Button from '$lib/components/Button.svelte'
    import Area from '$lib/components/Area.svelte';
    import PostList from '$lib/components/PostList.svelte';
    import FileUpload from '$lib/components/FileUpload.svelte';
    import PostBody from '$lib/components/PostBody.svelte';
    import Form from '$lib/components/Form.svelte';


    /** @type {import('./$types').PageData} */
    export let data;

    let uploadForm = {};

    let userData = data.postJsonUser.data;

    let following = data.postJsonUser.following;
    let followers = data.postJsonUser.followers;

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
                    {#if data.resAcc.data == userData.username}
                        <Form action='/api/bio' format={false}>
                            <textarea class='follower' name='bio' on:mouseleave={inputHandler}  on:click={inputHandler} on:keydown={inputHandler}>{userData.pinned || ''}</textarea>
                            <input type='Submit' hidden='true' bind:this={submitter}>
                        </Form>
                    {:else}
                        <p class='data'>
                            <span class='follower'>
                                <PostBody content={userData.pinned || ''} excludeImg={true} />
                            </span>
                        </p>
                    {/if}
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

            <div class='sections'>  
                <div>
                    {#if data.resAcc.data == userData.username}
                        <h2>Set PFP</h2>
                        <FileUpload bind:form={uploadForm} type='small' apiUrl={'/api/pfp'}/>
                    {/if}
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
