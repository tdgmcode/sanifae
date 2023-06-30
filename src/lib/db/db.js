import { backend } from './handlers.js';
import { mkdir, access } from 'node:fs/promises';

const AUTH_ACTIONS = [
    'postCreate',
    'fileCreate',
    'vote',
    'postDelete',
    'pfp',
    'follow',
    'chatAdd'
];

const FILE_DIRS = [
    '/db',
    '/db/files/upload',
    '/db/files/pfp'
]

import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

var db;

async function newDir(dir) {
    await access(newDir)
        .then(() => {})
        .catch(async () => await mkdir(dir, { recursive: true }));
}

async function initFolders() {
    for (var i = 0; i < FILE_DIRS.length; i++) {
        await newDir( `${process.cwd()}/${FILE_DIRS[i]}`);
    }
}

async function initDb() {
    await initFolders();

    db = await open({
      filename: `${process.cwd()}/db/main.db`,
      driver: sqlite3.Database
    });

    await db.run('CREATE TABLE IF NOT EXISTS auth ( \
        username CHAR(64), \
        password CHAR(1024) \
    )');

    await db.run('CREATE TABLE IF NOT EXISTS token ( \
        username CHAR(64), \
        token CHAR(1024) \
    )');

    await db.run('CREATE TABLE IF NOT EXISTS post ( \
        username CHAR(64), \
        id CHAR(64), \
        content CHAR(10240), \
        upvotes INTEGER, \
        downvotes INTEGER, \
        rating REAL, \
        reply CHAR(64), \
        time INTEGER, \
        tetra CHAR(64) \
    )');

    await db.run('CREATE TABLE IF NOT EXISTS tag ( \
        id CHAR(64), \
        reply CHAR(64) \
    )');

    await db.run('CREATE TABLE IF NOT EXISTS chat ( \
        username CHAR(64), \
        content CHAR(10240), \
        time INTEGER, \
        room CONTENT(64) \
    )');

    await db.run('CREATE TABLE IF NOT EXISTS vote ( \
        id CHAR(64), \
        username CHAR(64), \
        type INTEGER \
    )'); 

    await db.run('CREATE TABLE IF NOT EXISTS user ( \
        username CHAR(64), \
        followers INTEGER, \
        following INTEGER, \
        upvotes INTEGER, \
        downvotes INTEGER, \
        reputation REAL, \
        roles INTEGER, \
        pinned CHAR(64) \
    )'); 

    await db.run('CREATE TABLE IF NOT EXISTS follow (\
        username CHAR(64), \
        following CHAR(64) \
    )');  

    await db.run('CREATE TABLE IF NOT EXISTS messages (\
        username CHAR(64), \
        content CHAR(10240), \
        time INTEGER, \
        read INTEGER \
    )');  
}

let getToken = async (cookies, fetch) => {
    const token = cookies.get('token');

    let username;
    if (!token) {
        username = '???'
    } else {
        username = await fetch('https://auth.montidg.net/api/account/token/', {
            'method': 'POST',
            'headers': {
                "Content-Type": "application/json",
            },
            'body': JSON.stringify({
                token: token,
                scope: 'sanifae'
            })
        }).then(x => x.json());
        if (!username.data || username.data.length < 1) return '???';
        username = username.data[0].username;
    }

    return username;
}

let backendProxy = async ({route, backendParams}) => {
    if (!db) await initDb();

    let extraParams = {};

    extraParams['db'] = db;

    let jason = {cookies: backendParams.cookies};

    if (backendParams.token)
        jason.token = backendParams.token;

    let user = await getToken(backendParams.cookies, backendParams.fetch);

    console.log(user);
    
    if ((!user || user == '') && AUTH_ACTIONS.indexOf(route) != -1) return {'success': 'Not authorized.' };

    let isAdmin = false; 
    if (user && user != '') isAdmin = ((await backend.userRoles({user}, {db})) || []).indexOf('Admin') != -1;

    extraParams['admin'] = isAdmin;
    extraParams['user'] = user;

    return backend[route](backendParams, extraParams) || {};
}

export {
    backendProxy
};