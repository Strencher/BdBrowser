import fs from "./fs";

function getSelected() {
    const selected = document.querySelector(".ui-tab-bar-item.selected");
    return selected.textContent == "Plugins" ? "plugins" : "themes";
}

function openFileDialog(callback) {
    const input = Object.assign(document.createElement("input"), {
        type: "file",
        onchange: () => callback(input.files)
    });
    input.click();
};

async function browseFiles(selected) {
    const files = await new Promise(resolve => {
        openFileDialog(files => {
            let final = [];
            for(const file of files) {
                const reader = new FileReader();
                reader.addEventListener("load", () => {
                    final.push({filename: file.name, content: reader.result});
                    if (final.length === files.length) resolve(final);
                });
                reader.readAsText(file, "utf8");
            }
        })
    });

    for(const file of files) installAddon(file, selected);
}

function installAddon(file, type) {
    console.log(type);
    const ret = fs.writeFileSync(`AppData/BetterDiscord/${type}/${file.filename}`, file.content);
    console.log(ret);
}

const observer = new MutationObserver(() => {
    if (document.getElementById("openFolder")) return;
    const match = document.querySelector(".theme-dark #bd-settingspane-container h2.ui-form-title")?.parentElement;
    if (!match) return;
    const button = match.querySelector("button");
    if (!button) return;
    const label = button.textContent;
    const classList = button.className;
    button.remove();
    match.insertBefore(Object.assign(document.createElement("button"), {
        innerText: label,
        className: classList,
        id: "openFolder",
        onclick: () => {
            browseFiles(getSelected());
        }  
    }), match.childNodes[1]);
});
observer.observe(document.body, {childList: true, subtree: true});