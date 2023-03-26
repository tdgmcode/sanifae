<script>
    import { io } from 'socket.io-client'
    import { dev } from '$app/environment';
    import PostBody from '$lib/components/PostBody.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let id = data.id;
    let messages = [];
    let input;

    let socket;

    if (dev) {
        socket = io('http://localhost:7272/');
    } else {
        socket = io('https://ws.tdgmdev.net/');
    }
    

    socket.emit('join',id);

    function scroll() {
        setTimeout(function() {
            if (input && input.lastChild)
                input.lastChild.scrollIntoView()
        },200);
    }

    socket.on('load', (message) => {
        messages = message;
        scroll();
    })

    socket.on('chat', (message) => {
        messages = [...messages, message];
        scroll();
    })

    function inputHandler(e) {
        if(e.key == "Enter" && !e.shiftKey) {
            socket.emit('chat',e.target.textContent, id, data.token)
            e.preventDefault();
            e.target.innerText = '';

        }
    }
</script>

<style>
    #mainChat {
        height: 100%;
        width: calc(100vw - 30px);
        padding: 15px;
        overflow: auto;
    }

    #mainInput {
        height: 40px;
        width: calc(100vw - 30px);
        padding: 15px;

        background: var(--dark-2);
    }

    #header {
        display: flex;
        flex-direction: row;
        align-items: center;
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
        margin-left: 0.5rem;
    }

    #mainChat {
        background: var(--light-1);
    }
</style>

<div id='mainChat' bind:this={input}>
    {#each messages as message}
        <div class='message'>
            <div id='header'>
                <img class='pfp' src='/img/pfp/{message.username}.png'/>
                <div><a href='/users/{message.username}'>
                    {message.username}
                </a></div>
                <div class='date'>
                    {(new Date(message.time / 1000) + '').split('GMT')[0]}
                </div>
            </div>
            <PostBody content={message.content}></PostBody>
        </div>
    {/each}
</div>

<div id="mainInput" contenteditable="" autocomplete="off"  on:keydown={inputHandler}></div>