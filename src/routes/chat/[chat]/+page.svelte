<script>
    import { io } from 'socket.io-client'
    import { dev, browser } from '$app/environment';
    import PostBody from '$lib/components/PostBody.svelte';
    import Meta from '$lib/components/Meta.svelte';

    /** @type {import('./$types').PageData} */
    export let data;

    let id;
    $: id = data.id;
    let messages = [];
    let input;

    let socket;

    if (dev) {
        socket = io('http://localhost:7272/');
    } else {
        socket = io('https://ws.tdgmdev.net/');
    }
    
    $: if (id) {
        messages = [];
        socket.emit('join',id,data.token);
    }

    function scroll() {
        setTimeout(function() {
            if (input)
                input.scrollIntoView();
            
            if (input && input.lastChild && input.lastChild.scrollIntoView)
                input.lastChild.scrollIntoView()
        },200);
    }

    socket.on('load', (message) => {
        if (!message || message.success) {
            messages = [{
                'username': '!!SYSMSG',
                'content': 'An error ocurred: ' + ((message && message.success) ? message.success : 'Unknown error')
            }]
            return;
        }
        messages = [...messages, ...message];
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

    let channels = [];

    $: if (id && browser) {
        channels = JSON.parse(localStorage.getItem('channels')) || ["main"];

        if (channels.indexOf(id) == -1) channels.push(id);

        localStorage.setItem('channels',JSON.stringify(channels));
    }
    
</script>

<svelte:head>
	<Meta title='Chat {id || "Unknown"}' />
</svelte:head>

<style>
    #mainChat {

        height: 100vh;
        width: 100%;
        overflow: auto;

        display: flex;
        flex-direction: column;
    }

    #wrapper {
        z-index: 10;
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;
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

    .message {
        margin-left: 15px;
    }

    .lmenu {
        height: 100px;
        background: white;
        display: flex;
        align-items: center;
        overflow-x: auto;
    }

    .lmenu a {
        color: black;
        margin: 10px;
    }

    .lmenu a:before {
        content: '%';
        font-weight: bold;
        font-size: 1.3em;
    }

    .minor {
        background: var(--dark-2);
    }
</style>

<div id='wrapper'>
    <div class='lmenu minor'>
        {#each channels as channel} 
            <a href='/chat/{channel}'>{channel}</a>
        {/each}
    </div>
    <div id='mainChat' bind:this={input}>
        <div class='message'></div>
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
</div>

