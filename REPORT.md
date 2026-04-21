# 📌 Rättningsrapport – fed25s-the-auction-retry-grupp-9-emma-wilma-mikael

## 🎯 Uppgiftens Krav:
# Gruppuppgift - Auktionsapplikation

Ni skall skapa en auktion-applikation med hjälp av websockets. En användare skall kunna registrera sig på sidan och sedan kunna skapa en (eller flera) auktion(er). En auktion är en sida som använder sig av websockets för att skicka bud och hålla reda på när auktionen går ut. 

En användare måste vara inloggad för att kunna använda någon del av systemet.

## Api:t

Ni skall bygga ett api med hjälp av node.js och express. Denna gång skall ni implementera websocket för att skapa en realtidskommunikation mellan servern och klienten. 

Api:t skall ta emot anrop för att skapa en auktion och kunna ta emot bud samt hålla reda på när auktionen är slut och vem som vann.  

En användare skall kunna logga in. Detta betyder att ni behöver lagra användare i databasen så att ni kan slå upp dessa och logga in vid behov. 

Ni behöver även kunna registrera användare. 

## Klienten

Det finns ett projekt för er frontend i denna mall. Ni behöver göra det minsta möjliga i detta projekt för att få er auktions-site att fungera. 

Klienten behöver även ha funktioner för att registrera användare och logga in användare. 

## Betyg G

- Ett api med node.js och express
- Websockets är implementerat
- Bra kodstruktur för websockets
- Hantering av rum för websockets
- En användare kan skapa en auktion
- En användare kan lägga bud på en auktion (inte sin egen dock)
- En användare kan se information om pågående auktion genom att gå in på auktions-sidan.
- Inloggning av användare med hjälp av cookies
- Registering av användare

Om ca 85% av kraven är uppfyllda anses uppgiften vara godkänd. 
Om ett bra försök har gjorts för att implementera inloggning räcker det. Denna klass är frontendutvecklare, inte backendutvecklare. 

## 🔍 ESLint-varningar:
- /app/repos/fed25s-the-auction-retry-grupp-9-emma-wilma-mikael/frontend/src/pages/login.ts - no-console - Unexpected console statement.
- /app/repos/fed25s-the-auction-retry-grupp-9-emma-wilma-mikael/frontend/src/pages/register.ts - no-console - Unexpected console statement.
- /app/repos/fed25s-the-auction-retry-grupp-9-emma-wilma-mikael/frontend/src/utils/getUser.ts - no-console - Unexpected console statement.
- /app/repos/fed25s-the-auction-retry-grupp-9-emma-wilma-mikael/frontend/src/utils/logout.ts - no-console - Unexpected console statement.
- /app/repos/fed25s-the-auction-retry-grupp-9-emma-wilma-mikael/frontend/src/utils/pageUtils/landingPageUtils.ts - no-console - Unexpected console statement.
- /app/repos/fed25s-the-auction-retry-grupp-9-emma-wilma-mikael/frontend/src/utils/pageUtils/productPageUtils.ts - no-console - Unexpected console statement.

## 🏆 **Betyg: G**
📌 **Motivering:** Backend i `api/src` uppfyller i huvudsak G-kraven för uppgiften: ni har ett Express-baserat API med Mongoose-modeller, samt Socket.io för realtidskommunikation. Websocket-delen är tydligt separerad i egen modul (`setupSocketHandlers`/`socketHandler`) och ni hanterar rum (t.ex. för att ansluta användare till relevanta auktioner). Funktionellt finns stöd för registrering (`/api/users/register`), inloggning med cookie (login sätter cookie och används i auth-flödet), skapa auktion (`POST /auctions`) och lägga bud (`PATCH /auctions/:id`) med centrala affärsregler (inte buda på egen auktion och bud måste vara högre än nuvarande). Ni har också logik för att avgöra om auktioner har avslutats (`checkHasEnded`) och att utse vinnare (`addWinner`).

Det finns brister, främst kring auth-konsekvens och robusthet (t.ex. vissa endpoints är öppna, middleware hanterar ogiltig token med 500 istället för 401/403, och routes riskerar att lita på klientdata som `createdBy`). Dessutom finns en tydlig async-risk i `getAuctions()` (använder `forEach(async ...)` utan await). Trots detta är helheten en fungerande implementation som täcker majoriteten av kraven, och enligt instruktionen räcker ett “bra försök” för inloggning samt ~85% kravuppfyllelse för godkänt. Sammantaget landar arbetet därför på G.

💡 **Förbättringsförslag:**  
1) Auth-middleware: returnera 401/403 vid ogiltig/utgången JWT (inte 500), och sätt en betrodd användare på request (t.ex. `req.user`/`res.locals.user`) så att ni inte behöver lita på `createdBy` från klienten.

2) Skydda routes konsekvent enligt kravtolkning: säkerställ att alla relevanta endpoints kräver inloggning (undantag brukar vara login/register), och undvik att exponera användardata via öppna endpoints om kravet tolkas strikt.

3) Fixa async-buggen i `getAuctions()`: byt `forEach(async ...)` till `await Promise.all(auctions.map(async ...))` eller `for...of` med `await`, så att avslut/vinnare-uppdateringar hinner sparas innan ni returnerar resultat.

4) Validering: lägg inputvalidering på t.ex. `daysToEnd`, `startingBid`, budsumma och att `bids` är korrekt formaterat (Zod/Joi eller enklare manuella kontroller) för att undvika trasig data i DB.

5) Datamodellering: undvik ett extra `id`-fält i `Auction` (Mongoose har redan `_id`), och överväg `bids: { type: [BidSchema], default: [] }` istället för `required: true` för att slippa krav på tom array från klienten.

6) Socket-rum/ledarlogik: `io.socketsLeave('leader'+auctionId)` är aggressivt (alla lämnar). Om ni vill ha “en ledare”, spara föregående ledar-socket och flytta bara den, så att flera flikar/enheter inte får oväntade effekter.

7) JWT/cookie best practices: sätt `expiresIn` vid signering och styr cookie-flaggor (`secure`, `sameSite`) via miljö (dev/prod) för bättre säkerhet och mer förutsägbart beteende.

Bra jobbat: ni har en tydlig struktur (controllers/routes/models/utils) och en fungerande realtidsdel med Socket.io—fortsätt bygga vidare på det genom att göra auth och async-flödena mer robusta.

## 👥 Gruppbidrag

| Deltagare | Antal commits | Commit % | Uppgiftskomplettering | Totalt bidrag |
| --------- | -------------- | -------- | ---------------------- | ------------- |
| mikael-johnsson | 49 | 51% | 0.33 | 0.4 |
| Emma Riklund | 28 | 29.2% | 0.33 | 0.32 |
| WilmaErikssonIllustrations | 19 | 19.8% | 0.33 | 0.28 |


### 📊 Förklaring
- **Antal commits**: Antalet commits som personen har gjort
- **Commit %**: Procentuell andel av totala commits
- **Uppgiftskomplettering**: Poäng baserad på mappning av README-krav mot kodbidrag 
- **Totalt bidrag**: Viktad bedömning av personens totala bidrag (40% commits, 60% uppgiftskomplettering)
