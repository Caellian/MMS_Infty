Za subsetanje fonta je korišten fork glyphhangera:

```sh
# instalacija dependencyja za glyphhanger
pacman -Sy python-fonttools
pacman -Sy brotli # woff2
pacman -Sy zopfli # woff

# dodavanje maintainanog forka glyphhangera kao devDependency u projekt
git clone https://github.com/zachleat/glyphhanger.git
cd glyphhanger
npm pack
mv glyphhanger-*.tgz ..
cd ..
rm -rf glyphhanger/
npm i -D --save ./glyphhanger-*.tgz

npm exec glyphhanger -- ./src/*.html --jsdom --formats=woff2,woff --subset=./public/fonts/*.ttf
# woff je svugdje podržan
rm ./public/fonts/*.ttf
# ukloni '-subset' sufiks
for file in ./public/fonts/*.woff*; mv $file $(echo "$file" | sed "s/-subset//g")
```

Ne koristim "--css" argument jer je podržan samo jedan jezik (engleski) pa nije
korisno navesti `unicode-range` za pojedine `@font-face`eve.
- Inaće dozvoljava dinamično učitavanje dijela fonta kada se pojave pripadajući
  znakovi.
