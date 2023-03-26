import { backend } from '../../../lib/db/handlers.js';
import { backendProxy } from '../../../lib/db/db.js';


/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, params, fetch }) {
    const formEntries = url.searchParams;
    return await handleReq({
        cookies,
        params: formEntries,
        route: params.route,
        fetch
    });
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request, params, fetch }) {

    const formEntries = (await request.formData()).entries();
    
    return await handleReq({
        cookies,
        params: formEntries,
        route: params.route,
        fetch
    });
}

async function handleReq({ cookies, params, route, fetch }) {
    var backendParams = {cookies,fetch};

    for (const [key, value] of params) {
        backendParams[key] = value + '';
    }

    return await mainApi({backendParams, route: route});
}

async function mainApi({backendParams, route, fetch}) {
    if (Object.keys(backend).indexOf(route) == -1) {
        return new Response(JSON.stringify({success: 'route doesn\'t exist'}));
    }

    var resData = await backendProxy({ route, backendParams });

    return new Response(JSON.stringify(resData));
};