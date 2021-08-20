export const globals = {
   get releaseChannel() {
      if (location.href.includes("canary")) return "canary";
      if (location.href.includes("ptb")) return "ptb";
      return "stable";
   }
}

export const app = {
   getReleaseChannel() {return globals.releaseChannel;},
   getVersion() {return "1.0.9002"}
};