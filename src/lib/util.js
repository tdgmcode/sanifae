const EXTENSION_MAP = {
    'png': 'img',
    'jpg': 'img',
    'jpeg': 'img',
    'gif': 'img',
    'svg': 'img', 
    'mp4': 'video',
    'mov': 'video'
}

const formats = [
    'italic',
    'bold',
    'bolditalic'
];

const postTypes = {
    '@': 'users',
    '#': 'post',
    '%': 'chat'
}

let checkLength = function(string, field, lowerBound, upperBound) {
    if (string.length < lowerBound) {
        if (string.length == 0) {
            return { success: `${field} cannot be blank.` }
        }
        return { success: `${field} is too short (minimum length: ${lowerBound} characters).` }
    }

    if (string.length > upperBound) {
        return { success: `${field} is too long (maximum length: ${upperBound} characters).` }
    }

    return false;
}

let checkRegex = function(string, field, regex) {
    if (string.search(regex) != -1) {
        return { success: `${field} contains illegal characters.` }
    }
    return false;
}

let calcVote = function(up,down, type) {
    var upPadded = up + 3;
    var downPadded = down + 3;
    var totalPadded = Math.max(up + down, 3);

    var rating =  -Math.log((1 / ((((upPadded - downPadded) / (upPadded + downPadded)) + 1) / 2)) - 1) / Math.log(Math.E);

    rating = Math.min(rating,10);

    if (type != 'user') {
        rating = Math.max(rating,-1);

        rating = (rating + 11) / 1.1;

        rating = rating * Math.log(totalPadded);
    } else {
        rating = Math.round(rating * Math.log(totalPadded) * 10);
    }

    return rating;
}

let handleSubmit = async e => {
    const ACTION_URL = e.target.action

    const formData = new FormData(e.target)
        
    return await fetch(ACTION_URL, {
        method: 'POST',
        body: formData
    }).then(x => x.text());
}

let safeName = function (text) {
    return text.replaceAll(/[^A-Za-z0-9\-\_]/g, '');
}

let formatPostText = function(post) {
    post = post.map(x => (x === x + '') ? x.split(/(\*)/).filter(x => x != '') : x).flat();

    let inc = false;
    let formatType = -1;
    let wasInc = false;
    let dir = 1;
    
    let newArr = [];

    for (var i = 0; i < post.length; i++) {
        inc = (post[i] == '*');

        if (inc) {
            formatType += dir;
        } else {
            if (wasInc) dir = !dir + 0;
            if (dir) formatType = -1;

            let formatTypeStr = formats[formatType] || 'default';

            if (post[i] === post[i] + '') {
                let lastEntry = (newArr.length > 0) ? newArr[newArr.length - 1] : {};
                if (lastEntry.type == 'text' && lastEntry.format == formatTypeStr) {
                    newArr[newArr.length - 1].content += post[i];
                } else {
                    newArr.push({'type': 'text', 'format': formatTypeStr, 'content': post[i]})
                }
            } else {
                let content = post[i];
                content.format = formatTypeStr;
                newArr.push(content);
            }
        }

        wasInc = inc;
    }

    return newArr;
}

let formatPost = function(post, ignoreImg) {

    post = post.split('\n');

    post = post.map(subPost => {
        return subPost.split(/( )/);
    });

    post = post.map(line => {
        line = line.map(subPost => {
            var splitPost = subPost.split('||');
            

            if (splitPost.length > 1 && !ignoreImg) {
                var cap1 = splitPost[0];
    
                if (cap1 == 'img') {
                    var matchCleaned = safePath(splitPost[1]);
                    var extension = matchCleaned.split('.').pop().toLowerCase();

                    extension = safeName(extension);

                    splitPost = {'type': EXTENSION_MAP[extension] || 'none', 'url': `/img/file/${matchCleaned}`};

                    return splitPost;
                }
            } else if (postTypes[subPost[0] + '']) {
                var subPostIn = safeName(subPost.substring(0));

                var type = postTypes[subPost[0]];

                splitPost = {'type': 'link', 'display': subPost, 'subtype': type, 'url': `/${type}/${subPostIn}`};

                return splitPost;
            } else if (subPost.startsWith('https://')) {
                var url;
                var extension = subPost.split('.').pop().toLowerCase();

                if (EXTENSION_MAP[extension] && !ignoreImg) {
                    url = `/embed?url=${encodeURIComponent(subPost)}`;
                    splitPost = [
                        {'type': 'link', 'display': subPost, 'url': url},
                        {'type': EXTENSION_MAP[extension] || 'link', 'display': subPost, 'url': url}
                    ];
                } else {
                    url = subPost;
                    splitPost = {'type': EXTENSION_MAP[extension] || 'link', 'display': subPost, 'url': url};
                }

                return splitPost;
            }

            return subPost;
        })
        return formatPostText(line.flat());
    });

    return post;
}

let block = function(bool) {
    return (bool) ? 'block' : 'inline';
}

let safePath = function(path) {
    if (path == '..' || path == '.') return '';
    return path.replace(/[\/]+/g, '')
}

let setLocation = function(location, key, value) {
    var loc = new URL(location).searchParams;

    loc.set('page',0);
    loc.set(key,value);
    return loc.toString();
}

export {
    checkLength,
    checkRegex,
    calcVote,
    handleSubmit,
    formatPost,
    block,
    safePath,
    setLocation
};