function removeWhiteSpace(str) {
    return str.replace(/(%0A|%20|%09){2,}/g, (chars) => chars.substr(0, 3))
}

export default removeWhiteSpace