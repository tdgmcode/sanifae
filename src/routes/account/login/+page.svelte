<script>
    import Form from '$lib/components/Form.svelte';
</script>

<Form action='/api/login' name='Log in'>
    <p>
        <input name='user' placeholder='Username'>
    </p>
    <p>
        <input type='password' name='pass'  placeholder='Password'>
    </p>
    <p>
        <input type='submit' value='Log in'>
    </p>
</Form>