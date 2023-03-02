# How to run ts scripts

Install `ts-node` with

```bash
npm i -g ts-node
```

Use the following command. The `--transpileOnly` option is used to avoid some typing error.

```bash
ts-node --log-error yourScript.ts
```

Alternatively, you can use `nodemon` which allows you to rerun the script on change.

```bash
npm i -g nodemon
```

```bash
nodemon --transpileOnly yourScript.ts
```
