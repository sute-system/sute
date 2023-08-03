import program from "commander";

export const helpOptions = () => {
    program.option('-c --cxw', 'a cxw cli');
    program.on('--help', function () {
        console.log("")
        console.log("Other:")
        console.log("  other options~");
    })
}
