import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {

    var id = params.chat;

    const token = await fetch(`/api/token`).then(x => x.json());

    return {id, token: token.token};
}