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

const getAPIUrl = (url) => {
    let obj = getUserInfo(url);
    if (!obj) return;
    return `https://api.github.com/repos/${obj.owner}/${obj.repo}/contents${obj.path}${obj.branch}`;
};

const getJsonData = async (url) => {
    const response = await fetch(getAPIUrl(url));
    return await response.json();
};

const downloadFile = (fileName, data) => {
    zip.file(fileName, data);
};

const download = () => {
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "Chatly-CLI.zip");
    });
};

const downloadRepoZip = (btn) => {
    console.log("hello");
    // btn.disabled = true;
    const url = document.getElementById("inputURL").value;
    console.log(url);
    getJsonData(url).then((json) => {
        console.log(json);
        json.forEach((value) => {
            if (value["type"] == "file") {
                files[value["name"]] = value["download_url"];
            }
        });
        console.log(files);
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
};
