<style>
    img, video {
        max-width: 200px;
        max-height: 200px;
        margin: 5px;
    }

    .only-img {
        max-width: 300px;
        max-height: 300px;
        display: block;
    }

    p {
        white-space: pre-wrap;
    }

    .bold, .bolditalic {
        font-weight: bold;
    }

    .italic, .bolditalic {
        font-style: italic;
    }
</style>

<script>
    import {formatPost} from '$lib/util.js';

    export let content = '';
    export let excludeImg = false;

    let contentSplit;
    $: contentSplit = formatPost(content || '', excludeImg);

    console.log(contentSplit);
</script>

<span>
    {#each contentSplit as line}
        <p>
            {#each line as elem}
                <span class={elem.format}>
                    {#if elem && elem.type == 'img'}
                        {#if line.filter(x => x.type == 'img').length < 2}
                            <img src={elem.url} class='only-img' alt='Image preview'>
                        {:else}
                            <img src={elem.url} alt='Image preview'>
                        {/if}
                    {:else if elem.type == 'video'}
                        {#if line.filter(x => x.type == 'video').length < 2}
                            <video class='only-img' alt='Video preview' controls>
                                <source src={elem.url}>
                            </video>
                        {:else}
                            <video alt='Video preview' controls>
                                <source src={elem.url}>
                            </video>
                        {/if}
                    {:else if elem.type == 'link'}
                        <a href={elem.url}>{elem.display}</a>
                    {:else if elem.type == 'text'}
                        {elem.content}
                    {/if}
                </span>
            {/each}
        </p>
    {/each}
</span>