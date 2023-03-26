
/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch }) {
    const urlParam = url.searchParams.get('url');

    const output = await fetch(urlParam);

    return new Response(await output.blob(), {'headers': {
        'Content-Type': output.headers.get("Content-Type")
    }});
}