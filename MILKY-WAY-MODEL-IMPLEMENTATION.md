# Vintergatsmodell för Space Safari

## Syfte

Det här dokumentet är implementationsspecifikationen för ett visuellt och vetenskapligt motiverat Vintergatslager i `3d-universe.html`.

Modellen ska:

- ge användaren ett galaktiskt sammanhang för stjärnor, nebulosor, stjärnhopar och Sagittarius A*,
- fungera i både logaritmisk och linjär avståndsskala,
- vara tillräckligt lätt för vanliga datorer och mobila enheter,
- använda den befintliga automatiska kvalitetsregleringen,
- kunna slås på och av av användaren,
- vara tekniskt isolerad och enkel att avlägsna,
- skilja mellan observerade positioner, modellerad armgeometri och konstnärlig visualisering,
- aldrig flytta ett verkligt objekt för att få det att passa en spiralarm.

## Grundbeslut

Vintergatan implementeras som ett separat kartlager och inte som en importerad GLB-modell. En färdig polygonmodell kan inte deformeras korrekt när planetariet växlar mellan linjär och logaritmisk skala.

Modellen byggs i stället av GPU-renderade partiklar och enkla procedurgenererade komponenter:

1. spiralarmar,
2. central stav,
3. galaktisk bula,
4. tunn stjärnskiva,
5. ett sparsamt stoftlager,
6. valfria namn på spiralarmarna.

Partiklarna lagrar fysiska positioner i ljusår. Deras visningsposition beräknas med samma skalomvandling som planetariets övriga objekt.

Dan Greenhecks WebGPU Galaxy används som teknisk och visuell inspiration, men hela simuleringen importeras inte. Den innehåller upp till cirka 750 000 partiklar, kontinuerliga GPU-beräkningar, muskrafter, stoft och bloom. Space Safari behöver en statisk kartmodell, inte en fysisk galaxsimulering.

Källa och inspiration:

- [Dan Greenheck – WebGPU Galaxy](https://github.com/dgreenheck/webgpu-galaxy)
- [Interaktiv demonstration](https://dgreenheck.github.io/webgpu-galaxy/)

Greenhecks projekt har MIT-licens. Om kod eller tydligt härledda algoritmer används ska Dan Greenheck anges i gränssnittet och i projektets licens-/källinformation.

## Vetenskaplig modell

Det finns ingen fullständigt säker och slutgiltig karta över hela Vintergatan. Jorden ligger inne i galaxens skiva, interstellärt stoft skymmer sikten och galaxens bortre sida har betydligt sämre observationstäckning.

Space Safari ska därför använda en versionsmärkt hybridmodell. Den ska sammanföra modern armgeometri från flera typer av observationer i stället för att framställa en enskild konstnärlig bild som exakt.

### Primära underlag

- BeSSeL/VLBI-mätningar av maserparallaxer används för den grundläggande spiralstrukturen och massiva stjärnbildningsområden. Resultaten stöder huvudsakligen en struktur med fyra större armar: [Reid med flera, 2019](https://arxiv.org/abs/1910.03357).
- Gaia DR3:s unga stjärnpopulationer används för närliggande armsegment och lokal struktur: [ESA Gaia DR3 – Mapping the asymmetric disc](https://www.cosmos.esa.int/web/gaia/dr3-where-are-the-stars).
- Klassiska cepheider kompletterar delar av galaxen där maserparallaxerna är glesa: [The Milky Way as Seen by Classical Cepheids II, 2024](https://arxiv.org/abs/2406.09127).
- Chandra- och XMM-Newton-mätningar av röntgenljusekon används som underlag för senare justeringar av de yttre armarnas avstånd: [NASA Chandra – Milky Way at Arms' Length](https://science.nasa.gov/missions/chandra/nasas-chandra-examines-milky-way-at-arms-length/).
- NASA:s statistiska COBE/DIRBE-modell är en principiell referens för olika stjärnpopulationers fördelning i skiva, armar och bula: [NASA LAMBDA Milky Way model](https://lambda.gsfc.nasa.gov/product/cobe/vrml_models.html).

### Modellerade strukturer

Följande strukturer ska kunna representeras:

- Perseusarmen,
- Sagittarius–Carina-armen,
- Scutum–Centaurus-armen,
- Norma-/Outer-armens relevanta segment,
- den lokala Orion-sporren,
- den centrala galaktiska staven,
- den centrala bulan,
- den tunna stjärnskivan,
- ett tjockare och mycket svagare skiv-/halolager.

Armarnas form ska lagras som data och inte hårdkodas i renderingslogiken. Modellen ska tillåta både logaritmiska spiralavsnitt och punkt-/splinebaserade korrigeringar där observationerna avviker från en idealisk spiral.

### Versionsinformation

Modellfilen ska innehålla metadata i denna form:

```json
{
  "modelVersion": "Space Safari Milky Way 2026.1",
  "coordinateSystem": "galactocentric-cartesian-light-years",
  "sunDistanceFromCentreLy": 26400,
  "updated": "2026-10",
  "sources": [
    "BeSSeL/VLBI",
    "Gaia DR3",
    "Classical Cepheids 2024",
    "Chandra/XMM-Newton outer-arm constraints"
  ]
}
```

Datum och versionsnummer ska synas i modellens informationsruta. Det gör framtida vetenskapliga uppdateringar spårbara.

## Föreslagen filstruktur

All funktionalitet ska hållas isolerad:

```text
data/
  milky-way-model.json
js/
  milky-way.js
  3d-universe.js
css/
  3d-universe.css
3d-universe.html
MILKY-WAY-MODEL-IMPLEMENTATION.md
```

Ansvarsfördelning:

- `data/milky-way-model.json` innehåller armsegment, bredd, osäkerhet, källor, central stav och modellmetadata.
- `js/milky-way.js` skapar, uppdaterar, visar, döljer och avvecklar Vintergatslagret.
- `js/3d-universe.js` gör endast det lilla integrationsanropet och vidarebefordrar skala, kvalitet och synlighet.
- `3d-universe.html` innehåller kryssrutorna i `View controls`.
- `css/3d-universe.css` innehåller endast gränssnittets styling.

## Modulgränssnitt

Modulen bör exportera ett litet och stabilt API:

```js
const milkyWay = await createMilkyWay({
  scene,
  renderer,
  modelUrl: 'data/milky-way-model.json',
  displayDistance,
  initialQuality: 'medium'
});

milkyWay.setVisible(true);
milkyWay.setLabelsVisible(false);
milkyWay.setScaleMode('logarithmic');
milkyWay.setQuality('medium');
milkyWay.update(camera);
milkyWay.dispose();
```

Alla objekt som modulen skapar placeras i en enda `THREE.Group` med namnet `milkyWayGroup`.

Modulen får inte:

- skriva över globala variabler,
- ändra stjärnornas eller nebulosornas katalogdata,
- ändra kamerakontrollerna,
- skapa en egen render loop,
- kräva WebGPU för planetariets huvudvy,
- göra nätverksanrop efter att modellfilen har laddats.

## Enkel av- och påslagning

Under `View controls` läggs minst följande kontroll:

```text
☑ Show Milky Way
☐ Show spiral-arm names
```

Krav:

- Inställningen ska fungera i normalt läge och fullskärmsläge.
- Valet sparas i `localStorage`.
- När lagret är dolt ska dess animationer och onödiga uppdateringar stoppas.
- Användaren ska alltid kunna stänga av lagret, oberoende av kvalitetsläge.
- Om laddningen misslyckas ska resten av planetariet fortsätta fungera.
- Ett laddningsfel ska ge en diskret statusrad, inte blockera sidan.

Möjlig lagringsnyckel:

```text
space-safari-show-milky-way
```

## Koordinatsystem

Modellen lagras i galaktocentriska kartesiska koordinater med ljusår som fysisk enhet.

För rendering behöver varje punkt kunna omvandlas till en heliocentrisk vektor:

```text
heliocentrisk position = galaktocentrisk position − solens galaktocentriska position
```

Sagittarius A* ska definiera galaxens centrum. Solens placering ska följa samma koordinatkonvention som planetariets befintliga Sagittarius A*-position. Alla axelrotationer mellan astronomiska koordinater och Three.js-världen ska dokumenteras i modulen och testas mot kända riktningar.

### Viktig regel

Objektens observerade koordinater är facit för deras placering. Spiralarmarna är modellen som jämförs med objekten. Objekt får aldrig flyttas eller fästas vid en arm för att förbättra utseendet.

## Linjär och logaritmisk skala

En vanlig skalning av hela `milkyWayGroup` är inte tillräcklig. Logaritmisk skala är en icke-linjär deformation.

Varje partikel ska behålla sin fysiska heliocentriska position. Visningspositionen beräknas från riktningen och det transformerade avståndet:

```text
riktning = normalize(fysiskPosition)
visningsPosition = riktning × displayDistance(length(fysiskPosition))
```

`displayDistance()` måste vara samma avståndsfunktion som används för stjärnor, nebulosor, stjärnhopar, avståndscirklar och Sagittarius A*.

Omvandlingen bör ske i vertex-shadern så att JavaScript inte behöver flytta tiotusentals partiklar när användaren byter skala.

Krav vid skalväxling:

- Spiralarmarna och katalogobjekten ska fortsätta ligga i samma riktningar.
- Avståndet till centrum ska matcha Sagittarius A*.
- Modellen ska uppdateras utan omladdning.
- Ingen ny partikelgeometri ska behöva genereras.
- Övergången får gärna interpoleras kort, men ett direkt byte är acceptabelt om det är stabilare.

## Partikelmodell

### Lager

Modellen delas upp i separata draw calls eller logiska lager:

1. `armStars` – ljusa och unga stjärnpopulationer längs spiralarmarna.
2. `diskStars` – svag, bred exponentiell stjärnskiva.
3. `bulgeStars` – tät ellipsoidisk population runt centrum.
4. `barStars` – avlång central struktur.
5. `dustClouds` – sparsamt lager som antyder mörka stoftband.
6. `armLabels` – valfria CSS2D-etiketter eller motsvarande.

### Visuell princip

- Partiklar ska vara subtila och inte konkurrera med katalogstjärnor.
- Katalogstjärnor och valbara objekt ska alltid ligga visuellt över bakgrundsmodellen.
- Spiralarmarna ska uppfattas som sannolikhets-/täthetsområden, inte som fasta rör.
- Osäkra armsegment kan göras svagare eller bredare.
- Den bortre sidan får inte ges falskt hög detaljgrad.
- Den centrala bulan ska vara synlig men inte täcka Sagittarius A*.

## Prestanda och adaptiv kvalitet

Modellen ska använda planetariets befintliga lägen `Auto`, `High`, `Medium` och `Low`.

Rekommenderade startvärden:

| Kvalitet | Armstjärnor | Skiva och bula | Stoft | Eftereffekter |
|---|---:|---:|---:|---|
| Low | 12 000–15 000 | 5 000 | 1 000–1 500 | Ingen bloom |
| Medium | 30 000–40 000 | 12 000 | 3 000–4 000 | Enkel shaderglöd |
| High | 70 000–100 000 | 25 000 | 6 000–8 000 | Mjuk, begränsad glöd |

Den första implementationen ska hellre börja i den nedre delen av intervallen och därefter mätas på verklig hårdvara.

### Prestandaregler

- Använd `THREE.Points`, buffergeometrier och shaderbaserad punktstorlek.
- Skapa inte ett Three.js-objekt per partikel.
- Använd inga JavaScript-loopar per partikel i varje bildruta.
- Återanvänd samma geometri mellan kvalitetsnivåerna när det är möjligt.
- Växla antal synliga partiklar med `geometry.setDrawRange()`.
- Undvik kontinuerlig galaxfysik; strukturen ska vara en kartmodell.
- Uppdatera endast uniforms för skala, tid, kamera och synlighet.
- Stäng av eller reducera glöd och stoft före armarnas grundstruktur när prestandan sjunker.
- Respektera `prefers-reduced-motion`.
- Pausa tidsbaserade effekter när fliken inte är synlig.

### Auto-läget

Auto ska kopplas till den befintliga bildtidsmätningen. Vid försämrad prestanda ska modellen i denna ordning:

1. minska eller stänga av stoft,
2. minska extra skivpartiklar,
3. minska armarnas partikelantal,
4. reducera glöd,
5. behålla armarnas grundform så länge som möjligt.

Användarens manuella `High`, `Medium` eller `Low` ska ha företräde framför automatiken.

## Spiralarmstillhörighet för objekt

Armstillhörighet ska vara metadata och inte en positionskorrigering.

### Beräkningsmetod

För varje katalogobjekt:

1. Läs RA, deklination och avstånd.
2. Omvandla till galaktisk longitud och latitud.
3. Omvandla till heliocentriska kartesiska koordinater.
4. Omvandla vidare till modellens galaktocentriska koordinater.
5. Beräkna kortaste avståndet till varje relevant spiralsegments centrumlinje.
6. Jämför avståndet med armens lokala bredd och osäkerhet.
7. Spara närmaste arm, avstånd till armcentrum, metod och säkerhetsgrad.
8. Kontrollera kända objekt manuellt mot publicerade kataloguppgifter.

Föreslagen metadata:

```json
{
  "galacticStructure": {
    "classification": "Orion Spur",
    "confidence": "high",
    "method": "position-and-literature",
    "modelVersion": "Space Safari Milky Way 2026.1"
  }
}
```

### Säkerhetsnivåer

- `high` – publicerad tillhörighet och positionen ligger tydligt inom armens modellerade bredd.
- `medium` – positionen överensstämmer med modellen men litteraturen är inte entydig.
- `low` – objektet ligger nära en möjlig arm men avstånd eller armgeometri är osäker.
- `not applicable` – objektstypen ska inte ges spiralarmstillhörighet.

Informationspanelen kan visa:

```text
Galactic structure: Orion Spur
Confidence: High
Model: Space Safari Milky Way 2026.1
```

eller:

```text
Nearest modeled arm: Perseus
Membership: Uncertain
```

### Objektstyper måste behandlas olika

- Unga massiva stjärnor är goda spiralarmsspårare.
- Stjärnbildningsnebulosor och unga öppna stjärnhopar är ofta relevanta för armklassificering.
- Äldre stjärnor kan ha rört sig långt från födelsearmen.
- Planetariska nebulosor ska normalt inte få en säker armklassificering enbart från närhet.
- Supernovarester bedöms efter stamstjärna, ålder, position och litteratur.
- Klotformiga stjärnhopar tillhör huvudsakligen den galaktiska halon och ska inte pressas in i spiralarmarna.
- Sagittarius A* klassificeras som `Galactic Centre`, inte som medlem i en arm.

### Förväntade exempel att verifiera

Följande är startantaganden och måste kontrolleras mot källor före publicering:

- Orionnebulosan: Orion-sporren/lokala armen.
- Plejaderna: lokal galaktisk struktur; exakt etikett ska källkontrolleras.
- Rho Ophiuchi: lokal struktur nära solen; säkerhetsgrad ska anges.
- Carinanebulosan och Eta Carinae: Sagittarius–Carina-strukturen.
- Krabbnebulosan: jämför positionen med Perseusarmen och publicerad klassificering.
- planetariska nebulosor som Ring-, Helix-, Owl- och Dumbbellnebulosan: normalt ingen stark armklassificering.
- klotformiga stjärnhopar: galaktisk halo eller bula beroende på population och position.

## Gränssnitt och information

### View controls

Kontrollerna placeras tillsammans med övriga visningsinställningar, längst upp i panelen även i fullskärmsläge.

Minimikrav:

- `Show Milky Way`
- `Show spiral-arm names`
- status som vid behov visar att modellen kör reducerad kvalitet

Möjliga senare kontroller:

- `Milky Way opacity`
- `Show dust lanes`
- `Show model uncertainty`

Den första versionen bör inte innehålla för många reglage.

### Kredit

Informationsrutan bör innehålla en kort kredit:

```text
Milky Way structure: Space Safari model based on BeSSeL/VLBI,
Gaia DR3, Cepheid and X-ray constraints. Visual technique inspired
by Dan Greenheck's WebGPU Galaxy.
```

Länkar ska gå till modellens källor och Greenhecks källkod.

## Felhantering

- Modellfilen laddas asynkront efter att grundplanetariet har startat.
- Ett fel får inte stoppa stjärnkatalogen, kameran eller objektvalet.
- Vid JSON-fel visas planetariet utan Vintergatslagret.
- Om shaders inte kan kompileras ska modulen avveckla delvis skapade resurser.
- `dispose()` ska vara säker att anropa även efter en ofullständig initiering.
- WebGL context loss ska inte orsaka en oändlig återladdningsloop.

## Säker borttagningsplan

Funktionen implementeras i en separat, avgränsad Git-commit.

För att avlägsna den manuellt ska det räcka att:

1. ta bort importen och `createMilkyWay()`-anropet i `js/3d-universe.js`,
2. ta bort Vintergatskontrollerna i `3d-universe.html`,
3. ta bort tillhörande CSS-regler,
4. radera `js/milky-way.js`,
5. radera `data/milky-way-model.json`.

Inga befintliga stjärn- eller nebulosdata ska behöva återställas eftersom modellen aldrig får ändra dem.

Git-committen ska kunna återställas separat utan att påverka Sagittarius A*-simuleringen eller den adaptiva kvalitetsfunktionen.

## Implementationsordning

### Fas 1 – vetenskaplig och teknisk prototyp

- Definiera koordinatkonventionen.
- Skapa den versionsmärkta JSON-modellen.
- Rendera ett mycket glest spiralarmsskelett.
- Kontrollera solens och Sagittarius A*:s relativa positioner.
- Verifiera linjär och logaritmisk skala.

### Fas 2 – visuella lager

- Lägg till armstjärnor.
- Lägg till tunn skiva, central stav och bula.
- Lägg till begränsat stoft.
- Säkerställ att katalogobjekten förblir tydligast.

### Fas 3 – gränssnitt och kvalitet

- Lägg till `Show Milky Way`.
- Lägg till armnamn.
- Koppla `Low`, `Medium`, `High` och `Auto` till draw ranges och effekter.
- Spara användarens val.

### Fas 4 – objektklassificering

- Beräkna närmaste modellerade arm för katalogobjekt.
- Kontrollera vetenskapligt relevanta objekt manuellt.
- Lägg till säkerhetsgrad och modellversion i informationspanelen.
- Undanta objekt där armmedlemskap inte är meningsfullt.

### Fas 5 – test och publicering

- Testa på dator och mobil.
- Testa med och utan WebGL-hårdvaruacceleration där det är möjligt.
- Mät bildtid i samtliga kvalitetslägen.
- Testa fullskärm och normal vy.
- Testa av/på upprepade gånger och kontrollera GPU-minne.
- Testa direkt växling mellan linjär och logaritmisk skala.
- Publicera som en separat commit.

## Acceptanskriterier

Implementationen är färdig när följande är uppfyllt:

- Vintergatan kan slås på och av utan omladdning.
- Planetariet fungerar även om Vintergatsmodulen eller modellfilen saknas.
- Linjär och logaritmisk skala använder samma fysiska koordinater.
- Sagittarius A* ligger i modellens centrum.
- Solen ligger på avsedd plats i Orion-sporren.
- Katalogobjekt behåller sina observerade positioner.
- Armklassificering visar säkerhetsgrad och modellversion.
- Klotformiga stjärnhopar felklassificeras inte som armobjekt.
- `Low`, `Medium`, `High` och `Auto` påverkar partikelantal och effekter.
- `Low` fungerar utan bloom och med reducerat stoft.
- Dold modell orsakar inga kontinuerliga onödiga uppdateringar.
- Alla skapade GPU-resurser frigörs av `dispose()`.
- Dan Greenheck och de vetenskapliga huvudkällorna krediteras.
- Funktionen kan återställas som en separat Git-ändring.

## Sådant som inte ingår i första versionen

- full gravitations- eller N-kroppssimulering,
- 750 000 kontinuerligt simulerade partiklar,
- individuell simulering av galaxens verkliga stjärnor,
- påståenden om exakt armgeometri där observationsunderlaget är svagt,
- fysisk modellering av varje molekylmoln,
- automatisk förflyttning av objekt till närmaste spiralarm,
- krav på WebGPU i huvudplanetariet.

## Framtida utbyggnader

När grundmodellen är stabil kan följande läggas till:

- visualisering av armarnas osäkerhetsområden,
- valbara vetenskapliga modellversioner,
- guidad resa från solen till galaxens centrum,
- filtrering efter galaktisk struktur,
- särskild halovisning för klotformiga stjärnhopar,
- jämförelse mellan unga stjärnor, gas, stoft och äldre stjärnpopulationer,
- delbara länkar som sparar skala, kamera, markerat objekt och Vintergatslagrets synlighet.

