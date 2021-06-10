// const API_URL = "https://api.github.com/repos/{owner}/{repo}/contents{path}{branch}";

const zip = new JSZip();
const files = {};
let userData = {};

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
    userData = getUserInfo(url);
    console.log(userData);
    if (!userData) return;
    return `https://api.github.com/repos/${userData.owner}/${userData.repo}/contents${userData.path}${userData.branch}`;
};

const getJsonData = async (url) => {
    console.log(getAPIUrl(url));
    const response = await fetch(getAPIUrl(url));
    const json = await response.json();
    return json;
};

const addFile = async (json, folder = zip.folder("")) => {
    if (json["content"]) {
        zip.file(json["name"], json["content"], { base64: true });
    } else {
        console.log(json["url"]);
        await fetch(json["url"]).then((response) => {
            response.json().then((file_json) => {
                folder.file(file_json["name"], file_json["content"], {
                    base64: true,
                });
            });
        });
    }
};

// For current folder ""
const addFolder = async (json, path) => {
    console.log(userData["path"], path);
    const folder = zip.folder(path || "");
    json.forEach((obj) => {
        if (obj["type"] === "file") {
            addFile(obj, folder);
        } else {
            const path = obj["path"]
                .replace(`${userData["path"].slice(1)}/`, "")
                .trim();
            fetch(obj["url"])
                .then((response) => response.json())
                .then((folder_json) => {
                    addFolder(folder_json, path);
                });
        }
    });
};

const download = () => {
    zip.generateAsync({ type: "blob" })
        .then((content) => {
            saveAs(content, "Chatly-CLI.zip");
        })
        .then(() => {
            zip.files = null;
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
    } else {
        addFile(json).then(() => download());
    }
};
