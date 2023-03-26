<style>
    .button {
        padding: 0.35rem;
        border: none;
        border-bottom: solid var(--dark-3) 3px;
        box-shadow: 0px 3px 5px 3px rgba(0,0,0,0.1);

        font-family: 'Open Sans';

        margin: 0.2rem;
        margin-top: 0.5rem;
        margin-bottom: 0rem;
    }

    .button a {
        color: var(--dark-1);
        font-weight: bold;
        font-size: 1rem;
    }

</style>

<script>
    export let clickFunc = () => {};
    export let button = '';
</script>

<button on:click={clickFunc} class='button'>
    <a href='#'><slot/></a>
</button>