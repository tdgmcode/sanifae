<script>
    import PostList from '$lib/components/PostList.svelte';
    import Button from '$lib/components/Button.svelte';
    import Dropdown from '$lib/components/Dropdown.svelte';
    import {setLocation} from '$lib/util.js';

    /** @type {import('./$types').PageData} */
    export let data;
</script>

<style>
    a {
        color: var(--dark-1);
        font-weight: bold;
        font-size: 1rem;
    }

</style>

<span>
    <Dropdown 
        clickFunc={(val) => { window.location.search = setLocation(window.location,'type',val)}}
        selectedKey='Filter by'
        options={[
            {
                'key': 'all',
                'val': 'All users',
            },
            {
                'key': 'follow',
                'val': 'Following only',
            }
        ]}
    />   
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
</span>

<PostList data={data} noRatings={true} />