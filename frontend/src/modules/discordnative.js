export const globals = {
   get releaseChannel() {
      if (location.href.includes("canary")) return "canary";
      if (location.href.includes("ptb")) return "ptb";
      return "stable";
   }
}