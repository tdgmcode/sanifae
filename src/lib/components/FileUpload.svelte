<script>
    import Button from '$lib/components/Button.svelte';

    export let form, apiUrl, type;

    let fileInput;
    let files;
    let preview;

    let progress = 0;

    function getBase64(image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
            preview = e.target.result;
            uploadFunction(e.target.result);
        };
    };
    async function uploadFunction(imageD) {
        const imgData = imageD.split(',').pop();

        var images = [];

        var fSize = 1024 * 256;

        for (var i = 0; i * fSize < imgData.length + 1; i++) {
            images.push(imgData.substring(i * fSize, i * fSize + fSize));
        }

        var rId = (Math.random() + 1).toString(36).substring(7);;
        var extension = fileInput.value.split('.').pop();

        for (var i = 0; i < images.length; i++) {
            var fData = (new FormData());

            var image = images[i];
            
            fData.append('img',image);
            fData.append('extension',extension);
            fData.append('last',i == (images.length - 1));
            fData.append('id',rId);

            form = await fetch(apiUrl || `/api/fileCreate`, {
                method: 'POST',
                body: fData,
            }).then(x => x.json());

            progress = (i+1) / (images.length);

            await setTimeout(() => new Promise.resolve(),100);
        }
    };
</script>

<style>

    .hidden {
        display: none;
    }

    img {
        max-width: 250px;
    }

    .small img {
        max-width: 50px;
    }
</style>

<form action='#' method='GET' class='{type || ''}' >
    {#if preview}
        <img src={preview} alt="Image preview"/>
    {:else}
        <img src='/icon_sanifae.svg' alt="Image preview"/>
    {/if}
    <input class="hidden" id="file-to-upload" type="file" bind:files bind:this={fileInput} on:change={() => getBase64(files[0])}/>
    <p>
        Progress: {progress * 100}%
    </p>
    {#if form.success}
        <p>{form.success}</p>
    {/if}
    <p> 
        <Button class="upload-btn" clickFunc={ () => fileInput.click() }>Upload</Button>
    </p>
</form>