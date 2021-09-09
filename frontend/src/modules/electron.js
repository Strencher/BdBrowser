import DOM from "common/dom";
import fs from "./fs";
import ipcRenderer from "./ipcRenderer";

ipcRenderer.initialize();

export {ipcRenderer};

export const remote = {
   app: {
      getAppPath: () => "ElectronAppPath"
   },
   getCurrentWindow: () => null,
   getCurrentWebContents: () => ({on: () => {}})
};

export const shell = {
   openItem: item => {
      const inputEl = DOM.createElement("input", {type: "file", multiple: "multiple"});
      inputEl.addEventListener("change", () => {
         for (const file of inputEl.files) {
            const reader = new FileReader();
            reader.onload = () => {
               fs.writeFileSync(`AppData/BetterDiscord/${item.split("/").pop()}/${file.name}`, reader.result);
               BdApi.showConfirmationModal("Reload Required", "You need to reload the page that the changes get applied.", {
                  confirmText: "Reload Now",
                  cancelText: "Cancel",
                  onConfirm: () => {location.reload();}
               });
            };
            reader.readAsText(file);
         }
      });
      inputEl.click();
   },
   openExternal: () => {}
}

export const clipboard = {
   writeText: text => navigator.clipboard.writeText(text),
}