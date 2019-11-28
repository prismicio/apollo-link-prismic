function removeWhiteSpace(str) {
    const regexp = /(%0A|%20)*(%20|%7B|%7D)(%0A|%20)*/g

    const [path, query] = str.split('?');
    if(!query) return str;

    const shortQuery = query.split('&').map((param) => {
        const [name, value] = param.split('=');
        if (name === 'query') {
            return name + '=' + value.replace(regexp, (chars, spaces, brackets) => brackets);
        }
        return param;
    }).join('&');

    return [path, shortQuery].join('?');
}

export default removeWhiteSpace;
