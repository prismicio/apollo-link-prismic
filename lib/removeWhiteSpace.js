function removeWhiteSpace(str) {
    const re = /(%0A|%20)*(%20|%7B|%7D)(%0A|%20)*/g
    // const re = /(%0A|%20|%09){2,}/g
    return str.replace(re, (chars, p1, p2) => p2)
}

export default removeWhiteSpace