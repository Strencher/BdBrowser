const createElement = (type, props, children) => {
   const node = document.createElement(type);
   Object.assign(node, props);

   if (Array.isArray(children)) node.append(...children);
   else if (children) node.appendChild(children);

   return node;
};

const Logger = {
   _log(type = "log", ...message) {
      console[type](`%c[BetterDiscord]%c`, "color: #3E82E5; font-weight: 500;", "", ...message);
   },
   log(...message) {
      this._log("log", ...message);
   },
   error(...message) {
      this._log("error", ...message);
   }
};

const script = createElement("script", {
   src: "http://127.0.0.1:5500/dist/index.js",
   onload: () => {
      Logger.log("Successfully injected!");
   },
   onerror: error => {
      Logger.error("Failed to be loaded!\n", error);
   }
});

const injectScript = ({id, url}) => {
   document.head.appendChild(createElement("script", {
      src: url,
      id,
      onload: () => {
         Logger.log(`Successfully loaded script "${id}"!`);
      },
      onerror: error => {
         Logger.error(`Failed to load script "${id}":\n`, error);
      }
   }))
}

window.addEventListener("message", message => {
   if (!message.data?.message) return;
   if (message.data.message === "bd-request-content") {
      fetch(message.data.url).then(res => res.text()).then(text => {
         window.postMessage({
            hash: message.data.hash,
            content: text
         });
      });
   }
});

document.head.appendChild(script);