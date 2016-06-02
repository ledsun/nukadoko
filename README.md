[textae](https://github.com/pubannotation/textae)のテストの入れ替えるスクリプトです。

テスト項目はMarkdownで記述します。
テストはH2単位で記述します。

# setup

```
git clone git@github.com:ledsun/nukadoko.git
cd nukadoko
npm install
```

ユーザーディレクトリでテスト項目を`git clone`します。

```
git clone https://github.com/pubannotation/textae.wiki.git
```


# run

```
npm start
```

# adopt

```
npm run adopt
cd ~/textae.wiki
git add .
git commit -m 'Daily update'
git push origin master
```
