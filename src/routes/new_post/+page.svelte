<script>
    import { page } from '$app/stores'

    import Area from '$lib/components/Area.svelte';
    import FileUpload from '$lib/components/FileUpload.svelte';
    import PostBody from '$lib/components/PostBody.svelte';
    import Button from '$lib/components/Button.svelte';

    import { handleSubmit, formatPost } from '$lib/util.js';

    /** @type {import('./$types').ActionData} */
    export let form;
    let formBody, anchor;

    $: if (anchor && form?.success && form?.href) {
        anchor.click();
    }
    
    let uploadForm = {};

    let formContent = $page.url.searchParams.get('init') || '';

    let currentState = 'editor';

    let edit = $page.url.searchParams.get('edit') || '';

    function setState(editor) {
        currentState = editor;
    }

    $: if (uploadForm.href) {
        currentState = 'editor';
        formContent += `\nimg||${uploadForm.href.split('/').pop()}`;
        uploadForm.href = false;
    }
</script>

<style>
    textarea {
        width: 10rem;
        height: 10rem;
    }

    .wrapper {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .barrier {
        width: 20px;
    }
</style>

<Area>
    <p slot="header">
        Create Post
    </p>
    <div class='main' slot='main'>
        <div class='wrapper'>
            <Button clickFunc={() => { setState('upload')}}>Media</Button>
            <div class='barrier'></div>
            <Button clickFunc={() => { formContent += ' *Italic*'}}><i>Italics</i></Button>
            <Button clickFunc={() => { formContent += ' **Bold**'}}>Bold</Button>
            <div class='barrier'></div>
            <Button clickFunc={() => { formContent += ' #main'}}>#Tag</Button>
            <Button clickFunc={() => { formContent += ' @tdgmdev'}}>@User</Button> 
            <Button clickFunc={() => { formContent += ' %main'}}>%Chatroom</Button>     
        </div>
        <form action='/api/postCreate' 
            method='POST' 
            on:submit|preventDefault={async e => form = JSON.parse(await handleSubmit(e)) }
        >
            <textarea name='edit' style='display: none;' value={edit}></textarea>
            <textarea name='content' style='display: none;' value={formContent}></textarea>
            <input formaction="?/create" type='submit' value='Post'  bind:this={formBody} style='display: none;'>
            {#if currentState == 'editor'}
                <p>
                    <textarea name='content' bind:value={formContent}></textarea>
                </p>
            {:else if currentState == 'visual'}
                <PostBody content={formContent} />
            {:else}
                <FileUpload bind:form={uploadForm} />
            {/if}
        </form>
        <div class='wrapper'>
            <Button clickFunc={() => { setState('editor')}}>Edit</Button>
            <Button clickFunc={() => { setState('visual')}}>View</Button>
            <Button clickFunc={() => formBody.click()}>Create</Button>
        </div>
    </div>
    <span slot="footer">
        <p>
            {#if form?.success}
                {#if form?.href}
                    <a href='{form?.href}' bind:this='{anchor}'>{form?.success}</a>
                {:else}
                    {form?.success}
                {/if}
            {/if}
        </p>
        <p>Create a post for the world to see.</p>
    </span>
</Area>