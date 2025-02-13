## Finance database schema design

Had this laying around and think its a very good schema desgin wise. As I plan on building a finance feature this is just a temporary place to store the design untill I get to implement it.

Schema is in SQLite Prisma but that is easily converted to drizzle.

## Prisma models setup

Usually people who use prisma have one big `schema.prisma` file. Which gets messy over time. I am big into seperation of concerns, I try to folow a single purpose for each file.

I've created a script that can be run with `pnpm prisma:seperate` that checks which approach is used in the project. And either seperates all the models into seperate files (best practice IMO), or when all seperated it will combine them into one file again so u can easily switch between them. Having all models in one file can make relations a bit easier to see, but after that I would want to seperate.

<small>It's a very small quick script which could be improved with custom cli commands, grouping certain models etc but thats up to anyone who sees the need.</small>

xxx

Remco stoeten

ToDo:

Add drizzle version of schema
Some zod implementation for validation
Built finance MVP
<small>The higher the number (1-5) the higher the priority</small> - create queries (1) - create mutations (1) - create subscriptions (x) - create ui layer (2) - create page views (3) - dashboard (3) - settings (4) - transactions (2) - expenses (2) - recurring - one time - income (2) - recurring - one time - categories (4) - for transactions - for income - for expenses - for savings (goals?) - savinsg (2,5) - different saving accounts - goals - set main goal - set deadline - set sub goals inside main goal - set deadline - set amount - set amount - future prediction - based on recurring saving - have a editor to change the prediction based on how likely you're to skip a monthly (periodical) saving deposit or expect change of incomes, huge expenses etc. - reocrring - individual one time entrys - substranctions - type of withdrawal - emergency - other

            -
