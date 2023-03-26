/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const res = await fetch(`/api/token`);

    const username = await res.json();

    const res2 = await fetch(`/api/messages`);
    const read = (await res2.json()).data.read;

    return { username: username.data, read };
}