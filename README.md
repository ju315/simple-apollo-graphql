# graphql-apollo tutorial

- https://www.howtographql.com/typescript-apollo/0-introduction/

## intall package

- `npm install --save-dev typescript ts-node-dev`
- `npm install apollo-server graphql nexus`
- `npm install prisma@^3.5.0 --save-dev`
- `npm install @prisma/client@^3.5.0`

## add tsconfig.json file

```json
{
  "compilerOptions":{
    ...
  }
}
```

## package.json add scripts

```json
{
  ...
  "scripts":{
    ...
    "start": "npm run dev",
    "dev": "ts-node-dev --transpile-only --no-notify --exit-child src/index.ts",
    "generate": "ts-node --transpile-only src/schema/schema"
  }
}
```

## prisma command

- migration: `npx prisma migrate dev --name "init"`
- run sript: `npx ts-node src/script.ts`
