import { backend, backendProxy } from '../../../../lib/db/db.js';

import { readFile, writeFile } from 'node:fs/promises';

const FILE_DIRS = [
    'upload',
    'pfp'
]

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, cookies, params }) {
    var imgName = params['img'];

    imgName = imgName.replace(/(\s+)/g, '\\$1');

    var dir = params['dir'];

    if (FILE_DIRS.indexOf(dir) == -1) dir = FILE_DIRS[0];

    var res;

    res = await readFile(`${process.cwd()}/db/files/${dir}/${imgName}`).catch(() => {});

    if (!res && dir == 'pfp') res = await readFile(`${process.cwd()}/static/pfp.png`);

    var response = new Response(res);
    var extension = imgName.split('.').pop();

    if (extension == 'svg') {
        response = new Response(res, {'headers': {
            'Content-Type':  'image/svg+xml'
        }});
    }
    return response;
}
