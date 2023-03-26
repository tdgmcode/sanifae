import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {

    var id = params.post;
    var sort = url.searchParams.get('sort');
    var page = url.searchParams.get('page') * 1;

    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await fetch(`/api/postBulk?id=${id}&page=${page}&sort=${sort}&type=post`);
    const postJson = (await res.json());

    return {postJson, id: page};
}