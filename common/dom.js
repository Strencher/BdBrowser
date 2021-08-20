export default class DOM {
    /**@returns {HTMLElement} */
    static createElement(type, options = {}, ...children) {
        const node = document.createElement(type);
        
        Object.assign(node, options);

        for (const child of children) {
            node.append(child);
        }

        return node;
    }

    static injectTheme(id, css) {
        const [bdThemes] = document.getElementsByTagName("bd-themes");

        const style = this.createElement("style", {
            id: id,
            type: "text/css",
            innerHTML: css,
        });

        style.setAttribute("data-bd-native", "");
        bdThemes.append(style);
    }

    static injectCSS(id, css) {
        const style = this.createElement("style", {
            id: id,
            type: "text/css",
            innerHTML: css
        });

        this.headAppend(style);
    }

    static removeCSS(id) {
        const style = document.querySelector("style#" + id);

        if (style) {
            style.remove();
        }
    }

    static injectJS(id, src, silent = true) {
        const script = this.createElement("script", {
            id: id,
            type: "text/javascript",
            src: src
        });

        this.headAppend(script);
        
        if (silent) script.addEventListener("load", () => {script.remove();}, {once: true});
    }
}

DOM.headAppend = document.head.append.bind(document.head);