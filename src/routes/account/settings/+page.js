/** @type {import('./$types').PageLoad} */
export async function load({ fetch, params, url }) {
    var search = url.searchParams;

    var voteType = search.get('vote');
    var sort = search.get('sort');

    var id = search.get('page') * 1;

    var user = params.user + '';

    await new Promise(resolve => setTimeout(resolve, 100));

    const resAccData = await fetch(`/api/token`);
    const resAcc = (await resAccData.json()) || {'data': ''};

    const resUser = await fetch(`/api/userGet?user=${resAcc.data}`);
    const postJsonUser = (await resUser.json()) || {};

    const resUserBio = await fetch(`/api/userBio?user=${resAcc.data}`);
    const postJsonUserBio = (await resUserBio.json()) || {};

    return { resAcc, id, postJsonUser, postJsonUserBio, user };
}