
<script>
    import Area from '$lib/components/Area.svelte';
</script>

<Area handleSubmit=''>
    <span slot="header">
        Terms of Service
    </span>
    <span slot='main'>
        <h3>1. Do not ruin the community's image</h3>
        <p>1A. Lewd content is prohibted in public posts</p>
        <p>1B. Sanifae is not a platform for raiding other communities</p>

        <h3>2. Obey the hierarchy; respect the services and moderators</h3>
        <p>2A. Do not repost content that was deleted by a moderator</p>
        <p>2B. Do not evade any forms of punishment</p>

        <h3>3. What happens here stays here, what happens there stays there</h3>
        <p>3A. This rule may be void in extreme cases of malicious users</p>

        <h3>4. Rules are subject to change at any time</h3>
        <p>4A. Moderators may take action against loopholing</p>

        <h3>5. Do not disrupt the services of Sanifae</h3>
        <p>5A. Do not DDOS the Sanifae servers or overload them intentionally</p>
        
        <h3>6. Illegal activity is prohibited</h3>
    </span>
    <p slot="footer">
       
    </p>
</Area>