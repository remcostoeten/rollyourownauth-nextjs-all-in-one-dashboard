## gen secret agnostic

```bash
secret=$(openssl rand -hex 32)
echo "Generated JWT Secret: $secret"

# Ask if the user wants to copy the secret to the clipboard
read -p "Do you want to copy this secret to clipboard? (Y/n) " answer

if [[ "$answer" == "Y" || "$answer" == "y" || -z "$answer" ]]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "$secret" | pbcopy
    echo "Secret copied to clipboard!"
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if command -v xclip &> /dev/null; then
      echo "$secret" | xclip -selection clipboard
      echo "Secret copied to clipboard!"
    elif command -v xsel &> /dev/null; then
      echo "$secret" | xsel --clipboard --input
      echo "Secret copied to clipboard!"
    else
      echo "No clipboard utility found. Please install xclip or xsel."
    fi
  elif [[ "$OSTYPE" == "cygwin" || "$OSTYPE" == "msys" ]]; then
    echo "$secret" | clip
    echo "Secret copied to clipboard!"
  else
    echo "Clipboard copy not supported on this OS."
  fi
fi
```

### Refactor to sharedprompt

```
can u please do a git add . and git commit -m and pair files untill no changes left in like 2 o3 commits.

BUT DONT commit this ENV STUFF

As after that I want you to rethink this shared config architecutre because there are a couple things wich we need to streamline.

First do git then dicsuss with me a plan to do the following:

Have  a way to share 1 env .ts file in multiple repos (rollyourownatuh+aio + task)

Than also have a .prettierrc, .prettierignore,

iN THE SAME LOCATION WHERE WE HAVE THOSE FILES I ALSO WANT the site-config file which currently sits over at package/configuration/site-config.ts

Also the mocked user (untill we have full working auth) which sits at packages/configuration/mock-user./indndex.ts



So to recap:
1- revert the .env changes
2- Git add . + git commit -m " feat/chore/fix + message" in 2-3 cmmits untill all changes are gone. Right before the last commit run prettier --write . in all apps and make it part of the last commit

3- Rethink the sahred architecutre. Delete whats not needed and start over with this shared stuff. If anything WE WANT A CLEAN REPO WITHOUT BLOAT AND REDUNDACY. However oyu are going to create this I don'tcare. as long the monorepo dir looks soemthing like this:

apps/documentation
apps/simple-task
apps/rollyourownauth....
shared/ (or whatever is a good name)
shared/config/index.ts (exports all files with * patern
shared/config/mock-user.ts
shared/config/pretierrc (or .ts whatever is handy)
shared/config/.prettierignore
shared/config/site-config.ts
shared/config/env.ts <---- env validation using t3 oss which currently only has DATABASE_URL tosqlite and long string for JWT_SECRET
Idealy a shared .tsconfig which contains path aliasses which all repos share

"ui":"src/shared/components/ui/inde.ts"
"env""path to new env file"
"helpers": "./src/shared/helpers/inde.ts"
"@/*":["./"]
"db" : [./src/server/db/inde.ts] <---
"config": path/to/shared/index.ts which repoxtst all config files you just created


This isa big enough task but i think you are able to  restucutre this. its important you first commit all other changes, git push it, then do a merge to master, checkout master, and then do `git heckout -b chore/shared-strucure" and start working on that.

In an ideal situtation i'd liek to get rid of apps/simple-task/shared/components/ui
and apps/simple-task/shared/helpers/*

entierly as i will need EXACT same files +  folders for the rollyourownauth app so ideally we would also migrate those to

root/shared (and base the tsconfig aliasses on that).


Pleasse follow what i said, revert current .evv stuff, commit the rest, push it, merge to master, create new branch, migrate env and onfiguration, prettier, tsconfig to a shaed dir, make sure all repos use that setup and try  to moe ui and helpers also
```
