module.exports = getUniqueObjects = (array) => {
    const jsonStrings = array.map(obj => JSON.stringify(obj));
    const set = new Set(jsonStrings);
    const uniqueJsonStrings = [...set];
    return uniqueJsonStrings.map(string => JSON.parse(string));
}