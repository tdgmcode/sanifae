import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, url }) {
    var page = url.searchParams.get('page') * 1;

    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await fetch(`/api/messages?isRead=1`);
    const postJson = (await res.json()).data.msg;
    return {postJson, id: page};
}