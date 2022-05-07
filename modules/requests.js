function xGet(url) {
    return fetch(`${window.origin}${url}`, {
        method: "GET",
    });
}


function xPost(url, data) {
    return fetch(`${window.origin}${url}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data || {})
    });
}


module.exports = { xGet, xPost }