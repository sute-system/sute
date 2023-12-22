
import marked from "marked"
import hljs from "highlight"

module.exports = function (content) {
    marked.setOptions({
        highlight: function (code, lang) {
            return hljs.highlight(lang, code).value;
        }
    })
    const htmlContent = marked.parse(content);
    const innerContent = "`" + htmlContent + "`";
    const moduleCode = `var code=${innerContent}; export default code;`
    return moduleCode;
}