# Inner Child

> :warning: **For committing your work use `pnpm commit` command!**

### Steps

> :warning: **Ensure you're using `node@lts` and `pnpm@latest`!**

Clone the repo

```bash
git clone git@github.com:BogdanGuyAvrahamCom/inner-child.git
```

Cd into it and install dependencies

```bash
cd inner-child
pnpm i
pnpm db:generate
```

Create `.env` and fill the necessary values.  
To start the trpc server run

```bash
pnpm dev:server
```

To start the mobile application (in parallel) run

```bash
pnpm dev:app:ios
```

or

```bash
pnpm dev:app:android
```
