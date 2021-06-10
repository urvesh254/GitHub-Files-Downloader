// const url = "https://api.github.com/repos/urvesh254/Chatly-CLI/contents";
const url = "https://api.github.com/repos/dhhruv/vac-cowin/contents";

const files = {};
let anchor = "";
const getJsonData = async (url) => {
    const response = await fetch(url);
    return await response.json();
};

const downloadFile = (fileName, data) => {
    const a = document.createElement("a");
    const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
    a.href = `data:text/${fileExtension},${data}`;
    a.title = fileName;
    a.download = fileName;
    a.click();
};

getJsonData(url).then((json) => {
    json.forEach((value) => {
        if (value["type"] == "file") {
            files[value["name"]] = value["download_url"];
        }
    });

    for (const key of Object.keys(files)) {
        fetch(files[key]).then((response) => {
            response.text().then((data) => {
                // downloadFile(key, data);
                // console.log(data);
                document.write(`<h2>${key}</h2>`);
                document.write(`<pre>${data}</pre>`);
            });
        });
    }
});
