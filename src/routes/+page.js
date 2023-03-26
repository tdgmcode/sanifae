/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
    var search = url.searchParams;

    var id = search.get('page') * 1;

    var sort =  search.get('sort') || 'hot';

    var type = search.get('type') || 'all';

    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await fetch(`/api/postBulk?page=${id}&sort=${sort}&type=${type}`);
    const postJson = await res.json();

    return { postJson, id };
}