# Build

Za igraditi stranicu je potrebno pokrenuti

```
npm run build
```

te prenijeti generirane datoteke iz `_site` direktorija na poslužitelj.

# Framework

Za izgradnju stranice je korišten [11ty](https://www.11ty.dev/). Nije bio tražen
ikakav frontent framework, no stranica ima neke ponavljajuće elemente (navbar),
te je zbog toga donesena odluka koristiti neki minimalni framework koji
pojednostavljuje uključivanje dijelova HTMLa na više mjesta.

11ty je SSG koji se koristi primatno za blogove, no prikladan je i za ovu
namjenu zbog svoje jednostavnosti.

# Fontovi

Kao izvor fontova je korišten [Google Fonts](fonts.google.com), fontovi su
preuzeti te je zadržan samo subset glifova koji se nalaze na web sjedištu kako
bi se dodatno smanjila veličina woff datoteke.

# Gotovi sadržaj

Sljedeći sadržaj je preuzet s interneta:

- `public/polyfill`
  - polyfill za IE11+ i browsere koji ne koriste blink browser engine kako bi [houdini](https://github.com/WICG/css-parser-api) radio svugdje.
  - **polyfill daje error** prilikom učitavanja stranice, no radi jer je animacija pozadine hero sectiona radi
- mapa USa, dodane su pobojane točke i linije (nakon komentara u SVGu).
