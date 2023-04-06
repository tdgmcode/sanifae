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
            Settings
        </span>
        <span slot="main">
            <div class='sections'>
                <div>
                    <h2>Bio</h2>
                    <Form action='/api/bio' format={false}>
                        <textarea class='follower' name='bio' on:mouseleave={inputHandler}  on:click={inputHandler} on:keydown={inputHandler}>{userData.pinned || ''}</textarea>
                        <input type='Submit' hidden='true' bind:this={submitter}>
                    </Form>
                </div>
  
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
