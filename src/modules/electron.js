export const ipcRenderer = {
   invoke: async event => {
      switch (event) {
         case "bd-config": return {
            version: "0.6.0",
            local: false,
            localPath: "",
            branch: "development",
            bdVersion: "1.0.0",
            minSupportedVersion: "0.3.0",
            hash: "gh-pages",
            dataPath: "AppData/BetterDiscord/"
         };
         case "bd-injector-info": return { version: "1.0.0" };
         default: null;
      }
   }
};

export const remote = {
   app: {
      getAppPath: () => "ElectronAppPath"
   },
   getCurrentWindow: () => null,
   getCurrentWebContents: () => ({ on: () => { } })
}