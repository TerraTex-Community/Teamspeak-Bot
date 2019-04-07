console.log(process.version);

require("ts-node").register({
    project: './tsconfig.json'
});

require("./src/index.ts");
