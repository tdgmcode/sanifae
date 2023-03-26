<script>
    import Form from '$lib/components/Form.svelte';
</script>

<Form action='/api/register' name='Register'>
    <p>
        <input name='user' placeholder='Username'>
    </p>
    <p>
        <input type='password' name='pass' placeholder='Password'>
    </p>
    <p>
        <input type='password' name='pass2' placeholder='Password (confirm)'>
    </p>
    <p>
        <input type='submit' value='Register'>
    </p>
</Form>