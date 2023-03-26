const ROW_COUNT = 5;

const LEGAL_SORTS = {
    'time': 'time',
    'rating': 'rating',
    'hot': `rating / (%d - time + 24000)`
}

const roles = [
    'Owner',
    'Admin',
    'Veteran'
]

const FILE_SIZE_LIMIT = 1024*1024*16;

const VALID_EXTENSIONS = ['png','jpg','jpeg','gif','svg', 'mp4', 'mov'];


import { hash, compare } from 'bcrypt'
import { randomBytes, createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { calcVote, checkLength, checkRegex, safePath, formatPost } from '../util.js';

var ridArray = {};

let updateUser = async ({user},{db}) => {
    let allPosts = await db.all('SELECT * from post WHERE username = ?', [
        user
    ]);

    let upvotes = 0;
    let downvotes = 0;

    allPosts.forEach(post => {
        upvotes += post.upvotes || 0;
        downvotes += post.downvotes || 0;
    });

    await db.run('DELETE FROM user WHERE username = ?', [
        user
    ]);

    await db.run('INSERT INTO user (username,followers,following,upvotes,downvotes,reputation) VALUES (?,?,?,?,?,?)', [
        user,
        0,
        0,
        upvotes,
        downvotes,
        calcVote(upvotes,downvotes,'user')
    ]);
}

let fileCreate = (type) => {
    return async ({img, extension,id, last}, {user}) => {
        let validExtensions = VALID_EXTENSIONS;

        if (type == 'pfp') validExtensions = ['png'];

        if (ridArray[id] !== '' && !(ridArray[id])) {
            ridArray[id] = img;
        } else {
            ridArray[id] += img;
        }
    
        const imgData = ridArray[id];
    
        if (last != 'true') {
            return {'success': 'Image still proccessing...'}
        } else {
            ridArray[id] = false;
        }
    
        const imgHash = createHash('md5').update(imgData).digest('hex');
    
        if (!imgHash)
            return {'success': 'Image not provided.'}
    
        if (imgHash.length > FILE_SIZE_LIMIT)
            return {'success': 'Image too big.'}
    
        const extensionSafe = safePath(extension);
    
        if (validExtensions.indexOf(extensionSafe) == -1)
            return { success: 'Illegal file extension. Permitted file extensions are: ' + validExtensions.join(', ') };
    
        let fileName = (type == 'post') ? `upload/${imgHash}.${extensionSafe}` : `pfp/${user}.png`

        writeFile(`${process.cwd()}/db/files/${fileName}`,imgData,{encoding: 'base64'});
    
        return { success: 'Successfully uploaded file.', 'href': `/img/${imgHash}.${extensionSafe}`};
    }    
} 

var backend = {};

backend.fileCreate = fileCreate('post');
backend.pfp = fileCreate('pfp');

backend.userRoles = async ({user},{db}) => {
    var rolesLocal = await db.all('SELECT roles from user WHERE username = ?', [
        user
    ] );

    if (rolesLocal.length == 0) rolesLocal = [{}];
    
    let rolesLocalList = rolesLocal[0].roles;

    return roles.filter((elem,i) => ((rolesLocalList % (1<<(i+1))) > ((1<<i) - 1)) );
};

backend.register = async ({user, pass, pass2},{db}) => {
    var lengthCheck = false;

    lengthCheck = 
      checkLength(pass,'Password',4,1024) ||
      checkLength(user,'Username',1,64) ||
      checkRegex(user,'Username',/[^A-Za-z0-9\-\_]/g);

    if (lengthCheck) return lengthCheck;

    if (pass != pass2) return {'success': 'Passwords don\'t match.'};

    var existingAccounts = await db.all('SELECT username FROM auth WHERE username = ?',[
        user
    ]);

    if (existingAccounts && existingAccounts.length > 0)
        return { success: 'Account already exists.' };

    var passHash = await hash(pass,10);

    await db.run('INSERT INTO auth (username, password) VALUES (?, ?)', [
        user,
        passHash
    ])

    await updateUser({user: user}, {db});

    return { success: 'Successfully created account.', location: '/'};
}

backend.login = async ({user, pass, cookies},{db}) => {
    var existingAccounts = await db.all('SELECT username, password FROM auth WHERE username = ?',[
        user
    ]);

    if (!existingAccounts || existingAccounts.length < 1)
        return { success: 'Account does not exist.' };

    var passHash = await compare(pass,existingAccounts[0].password);

    if (!passHash) 
        return { success: 'Incorrect password.' };

    var token = randomBytes(256).toString('hex');

    await db.run('INSERT INTO token (username, token) VALUES (?, ?)', [
        user,
        token
    ])

    if (token) {
        cookies.set('token',token, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/'
        });
    };

    return { success: 'Successfully logged into account.', data: token, location: '/'};
}

backend.postCreate = async ({content, edit}, {user,db}) => {
    if (!content) return {'success': 'No post provided.'}

    var lengthCheck = checkLength(content,'Post content',1,10240);

    if (lengthCheck)
        return lengthCheck;

    let userData = (await db.all('SELECT * FROM post WHERE id = ?', [
        edit || ''
    ]));

    var id = randomBytes(10).toString('hex');

    if (edit && userData[0] && userData[0].username === user)
        id = edit;

    var postFlatten = formatPost(content).flat();
    var reply = postFlatten.filter(x => x.subtype == 'post').map(x => x.url.split('/').pop());
    var firstReply = reply[0];

    await db.run('DELETE from tag WHERE id = ?', [
        id
    ])

    if (firstReply) {
        let replyData = (await db.all('SELECT * FROM post WHERE id = ?', [
            firstReply
        ]));

        let replyUser = '';
        if (replyData && replyData[0])
            replyUser = replyData[0].username;

        if (replyUser && !edit) {
            await db.run('INSERT INTO messages (username, content, time,read) VALUES (?, ?, ?, ?)', [
                replyUser,
                `@${user} replied to #${firstReply} on #${id}`,
                Math.floor(new Date() * 1000),
                0
            ]);
        }

    }
        
    if (id === edit) {
        await db.run('UPDATE post SET content = ? WHERE id = ?', [
            content,
            id
        ])
    
    } else {
        await db.run('INSERT INTO post (username, id, content, rating, reply, time) VALUES (?, ?, ?, ?, ?, ?)', [
            user,
            id,
            content,
            calcVote(0,0),
            firstReply || '',
            Math.floor(new Date() * 1000)
        ])
    
    }

    
    for (var i = 0; i < reply.length; i++) {
        await db.run('INSERT INTO tag (id, reply) VALUES (?, ?)', [
            id,
            reply[i]
        ])
    }
    

    return {'success': 'Your post has been broadcasted!', 'href': `/post/${id}` };
}

backend.postDelete = async ({id}, {user, admin, db}) => {
    if (admin) {
        let postUser = await db.all('SELECT * from post where id = ?',[
            id
        ]) || {};

        postUser = postUser[0].username;

        await db.run('DELETE FROM post WHERE id = ?', [
            id
        ])

        await db.run('INSERT INTO messages (username, content, time,read) VALUES (?, ?, ?, ?)', [
            postUser,
            `#${id} was deleted by an admin for rule violations.`,
            Math.floor(new Date() * 1000),
            0
        ]);

    } else {
        await db.run('DELETE FROM post WHERE username = ? AND id = ?', [
            user,
            id
        ])
    }

    return {'success': 'Your post has been deleted!', 'href': `/post/${id}` };
}

backend.userGet = async ({user},{db}) => {
    var posts = await db.all('SELECT * from user WHERE username = ?', [
        user
    ])

    if (!posts || posts.length < 1) {
        return {'success': 'User does not exist.'}
    }

    var following = await db.all('SELECT * from follow WHERE username = ?', [
        user
    ]);

    var followers = await db.all('SELECT * from follow WHERE following = ?', [
        user
    ]);

    if (!following) following = [];

    if (!followers) followers = [];

    posts[0].rolesArr = await backend.userRoles({user},{db});

    return {data: posts[0], following, followers };
}

backend.postBulk = async ({page, id, user, cookies, sort, type}, {admin, db}) => {
    var posts;

    var userAuth = (await backend.token({cookies}, {db})).data || '';

    sort = (LEGAL_SORTS[sort]) || 'rating';

    if (sort + '' !== sort) sort = 'rating';

    sort = sort.replaceAll('%d',Math.floor(new Date() * 1000));

    let pageParams = [
        page*ROW_COUNT,
        ROW_COUNT
    ]

    if (type == 'all') {
        posts = await db.all('SELECT * from post ORDER BY '+sort+' DESC LIMIT ?, ?', [
            ...pageParams
        ])
    } else if (type == 'post') {
        posts = await db.all('SELECT * from post WHERE id = ?', [
            id
        ]);

        if (posts.length == 0) posts.push({});

        posts.push(...(await db.all('SELECT * from post WHERE id IN (SELECT id FROM tag WHERE reply = ?) ORDER BY '+sort+' DESC LIMIT ?, ?', [
            id,
            ...pageParams
        ])))

    } else if (type == 'user') {
        posts = await db.all('SELECT * from post WHERE username = ? ORDER BY '+sort+' DESC LIMIT ?, ?', [
            user,
            ...pageParams
        ])
    } else if (type == 'follow') {
        posts = await db.all('SELECT * from post WHERE username IN (SELECT following FROM follow WHERE username = ?) ORDER BY '+sort+' DESC LIMIT ?, ?', [
            userAuth,
            ...pageParams
        ])
    }

    posts = posts.map(post => {
        return {...post, isAuthor: userAuth == post.username || admin};
    })

    return {data: posts};
}

backend.vote = async ({id, vote}, {user, db}) => {
    if (!id || (vote != 'down' && vote != 'up')) return {success: 'fail' };
    
    var isCreator = (await db.all('SELECT * from post WHERE id = ?', [
        id
    ]))[0].username;

    if (isCreator == user)
        return {success: 'fail' };

    await db.run('DELETE FROM vote WHERE username = ? AND id = ?', [
        user,
        id
    ]);

    await db.run('INSERT INTO vote (id, username, type) VALUES (?,?,?)', [
        id,
        user,
        vote == 'up' ? 1 : 2
    ]);

    var votes = await db.all('SELECT type from vote WHERE id = ?', [
        id
    ]) || [];

    var up = votes.filter(x => x.type == 1).length;
    var down = votes.filter(x => x.type == 2).length;

    await db.run('UPDATE post SET upvotes = ?, downvotes = ?, rating = ? WHERE id = ?', [
        up,
        down,
        calcVote(up,down),
        id
    ]);

    await db.run('INSERT INTO messages (username, content, time,read) VALUES (?, ?, ?, ?)', [
        isCreator,
        `@${user} ${vote == 'up' ? 'upvoted' : 'downvoted'} #${id}`,
        Math.floor(new Date() * 1000),
        0
    ]);

    var user = await db.all('SELECT * from post WHERE id = ?', [
        id
    ]) || [];

    if (!user[0])
        return {success: 'fail' };

    await updateUser({user: user[0].username}, {db});

    return {data: {up,down}};
}

backend.token = async ({cookies, token}, {db}) => {
    var tokenIn;
    if (token) {
        tokenIn = token;
    } else {
        tokenIn = cookies.get('token');
    }

    var existingAccounts = await db.all('SELECT username from token WHERE token = ?',[
        tokenIn
    ]);
    
    if (!existingAccounts || existingAccounts.length < 1)
        return false;

    return {data: existingAccounts[0].username, token: tokenIn};
}

backend.follow = async ({target}, {user, db}) => {
    var userExists = ((await db.all('SELECT * FROM user WHERE username = ?',[
        target
    ])) || []).length;
    
    if (userExists < 1) return;

    var isFollowing = await db.all('SELECT * FROM follow WHERE username = ? AND following = ?',[
        user,
        target
    ]);

    let unfollowed = (isFollowing && isFollowing.length > 0);

    if (unfollowed) {
        await db.run('DELETE FROM follow WHERE username = ? AND following = ?',[
            user,
            target
        ]);
    } else {
        await db.run('INSERT INTO follow (username, following) VALUES (?, ?)',[
            user,
            target
        ]);
    }

    var following = await db.all('SELECT * from follow WHERE username = ?', [
        target
    ]);

    var followers = await db.all('SELECT * from follow WHERE following = ?', [
        target
    ]);

    await db.run('INSERT INTO messages (username, content, time,read) VALUES (?, ?, ?, ?)', [
        target,
        `@${user} ${unfollowed ? 'is now following' : 'unfollowed'} you`,
        Math.floor(new Date() * 1000),
        0
    ]);

    return {'success': 'User followed/unfollowed.', 'data': {following, followers}};
};

backend.bio = async ({bio}, {user, db}) => {
    var lengthCheck = checkLength(bio,'Post content',1,256);

    if (lengthCheck)
        return lengthCheck;

    await db.run('UPDATE user SET pinned = ? WHERE username = ?', [
        bio,
        user
    ]) || [];

    return;
};

backend.messages = async ({isRead}, {user, db}) => {
    var msg = await db.all('SELECT * FROM messages WHERE username = ? ORDER BY time DESC', [
        user
    ]) || [];

    if (isRead) {
        await db.run('UPDATE messages SET read = 1 WHERE username = ?', [
            user
        ]);
    }

    let read = msg.filter(x => !x.read).length;

    return {'data': {msg, read}};
};

backend.chatAdd = async ({content, room}, {user,db}) => {
    if (!content) return {'success': 'No message provided.'}

    var lengthCheck = checkLength(content,'Post content',1,10240);

    if (lengthCheck)
        return lengthCheck;
        
    let time = Math.floor(new Date() * 1000);

    await db.run('INSERT INTO chat (username, content, time, room) VALUES (?, ?, ?, ?)', [
        user,
        content,
        time,
        room
    ])

    return {'data': {content, username: user, time, room}};
}

backend.chatGet = async ({room}, {user,db}) => {
    let messages = await db.all('SELECT * from chat WHERE room = ? ORDER BY time LIMIT 1000', [
        room
    ])

    return {'data': messages};
}

export {
    backend,
    VALID_EXTENSIONS
}