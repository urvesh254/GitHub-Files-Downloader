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
    const json = await response.json();
    return json;
};

const addFile = async (json, folder = zip.folder("")) => {
    if (json["content"]) {
        zip.file(json["name"], json["content"], { base64: true });
    } else {
        console.log(json["download_url"]);
        await fetch(json["download_url"]).then((response) => {
            response.text().then((data) => {
                folder.file(json["name"], data);
                document.write(`<h2>${json["name"]}</h2>`);
                document.write(`<pre>${data}</pre>`);
            });
        });
    }
};

// For current folder ""
const addFolder = async (json) => {
    const folder = zip.folder("");
    json.forEach((obj) => {
        if (obj["type"] === "file") {
            addFile(obj, folder);
        }
    });
};

const download = () => {
    zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, "Chatly-CLI.zip");
    });
};

const downloadRepoZip = async (btn) => {
    // btn.disabled = true;
    const url = document.getElementById("inputURL").value;
    console.log(url);
    const json = await getJsonData(url);
    console.log(json);
    if (json.length) {
        addFolder(json);
        console.log("folder");
    } else {
        addFile(json).then(() => download());
        console.log("file");
    }

    // json.forEach((value) => {
    //     if (value["type"] == "file") {
    //         files[value["name"]] = value["download_url"];
    //     }
    // });
    // console.log(files);
    // for (const key of Object.keys(files)) {
    //     fetch(files[key]).then((response) => {
    //         response.text().then((data) => {
    //             downloadFile(key, data);
    //             document.write(`<h2>${key}</h2>`);
    //             document.write(`<pre>${data}</pre>`);
    //         });
    //     });
    // }
};
