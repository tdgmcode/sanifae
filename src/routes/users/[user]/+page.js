/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
    var search = url.searchParams;

    var voteType = search.get('vote');
    var sort = search.get('sort');

    var id = search.get('page') * 1;

    var user = params.user + '';

    await new Promise(resolve => setTimeout(resolve, 100));

    const res = await fetch(`/api/postBulk?user=${user}&page=${id}&sort=${sort}&type=user`);
    const postJson = await res.json();

    const resUser = await fetch(`/api/userGet?user=${user}`);
    const postJsonUser = (await resUser.json()) || {};

    const resUserBio = await fetch(`/api/userBio?user=${user}`);
    const postJsonUserBio = (await resUserBio.json()) || {};

    const resAccData = await fetch(`/api/token`);
    const resAcc = (await resAccData.json()) || {};

    return { resAcc, postJson, id, postJsonUser, postJsonUserBio, user };
}