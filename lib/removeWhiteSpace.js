function removeWhiteSpace(str) {
    const re = /\s{2,}/
    return str.replace(re, ' ');
}

export default removeWhiteSpace