export function compileFunction(code, args = []) {
    return `((${args.join(", ")}) => {
        try {
            ${code}
        } catch (e) {
            console.error("Could not load:", e);
        }
    })`;
}