import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export async function load({ url, fetch, cookies }) {
    let data = url.searchParams.get('data');

    await fetch(
        '/api/auth'
    );

    cookies.set('token',data, { path: '/', maxAge: 60 * 60 * 24 * 7 });

    throw redirect(302, '/');
}