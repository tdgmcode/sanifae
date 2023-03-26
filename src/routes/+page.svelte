<script>
    import PostList from '$lib/components/PostList.svelte';
    import Button from '$lib/components/Button.svelte';
    import {setLocation} from '$lib/util.js';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<span>
    <Button clickFunc={() => { window.location.search = setLocation(window.location,'type',('all')) }}>All users</Button>
    <Button clickFunc={() => { window.location.search = setLocation(window.location,'type',('follow')) }}>Following only</Button>
</span>

<PostList data={data} />