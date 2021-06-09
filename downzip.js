const test_urls = [
    "https://github.com/urvesh254/",
    "https://github.com/urvesh254/Chatly-CLI",
    "https://github.com/urvesh254/Chatly-CLI/tree/main/com/ukpatel",
    "https://github.com/urvesh254/Chatly-CLI/tree/android",
    "https://github.com/urvesh254/Chatly-CLI/tree/android/app/src/androidTest/java/com/ukpatel/chatly",
    "https://gub.com/urvesh254/Chatly-CLI/tree/android/app/src/androidTest/java/com/ukpatel/chatly",
];

let url =
    "https://api.github.com/repos/urvesh254/chatly-cli/contents?ref=android";
const API_URL =
    "https://api.github.com/repos/{owner}/{repo}/contents{path}{branch}";

const zip = new JSZip();
const files = {};

const getUserInfo = (url) => {
    const data = url.split("/");
    if (!data[4] || !data[2].includes("github.com") || data.length < 5) return;

    const obj = {};
    obj.owner = data[3];
    obj.repo = data[4] || "";
    let branch = data[6] || "";
    obj.branch = branch ? `?ref=${branch}` : branch;
    let path = data.slice(7).join("/");
    obj.path = path ? `/${path}` : path;
    return obj;
};

const getAPIUrl = (obj) => {
    if (!obj) return;
    return `https://api.github.com/repos/${obj.owner}/${obj.repo}/contents${obj.path}${obj.branch}`;
};

const getJsonData = async (url) => {
    // const final_api_url = make_api_url(url);
    const response = await fetch(url);
    return await response.json();
};

const downloadFile = (fileName, data) => {
    zip.file(fileName, data);
};
/* 
getJsonData(url).then((json) => {
    json.forEach((value) => {
        if (value["type"] == "file") {
            files[value["name"]] = value["download_url"];
        }
    });
    for (const key of Object.keys(files)) {
        fetch(files[key]).then((response) => {
            response.text().then((data) => {
                downloadFile(key, data);
                document.write(`<h2>${key}</h2>`);
                document.write(`<pre>${data}</pre>`);
            });
        });
    }
});
 */
function download() {
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "Chatly-CLI.zip");
    });
}
