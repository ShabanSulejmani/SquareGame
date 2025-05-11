# SquareGame
Don't be a Square - Wizardworks uppgift

## PROJEKTÖVERISKT

Detta projekt är en fullständig implementering av Wizardworks rekryteringsuppgift "Don't be a Square".
Applikationen genererar ett interaktivt rutnät där färgade kvadrater kan läggas till sekventiellt med slumpmässiga färger. 
Varje gång en kvadrat läggs till, sparas dess position och färg på servern via ett REST API, så att tillståndet bevaras mellan olika sessioner.

----------------------------------------------------------------------------------
## FUNKTIONER

Klicka på en knapp för att lägga till kvadrater i ett rutnät med slumpmässiga färger.
Persistent lagring av kvadrater via API.
Rensa alla kvadrater med en återställningsknapp.
Responsiv design som fungerar på olika skärmstorlekar.
Felhantering i realtid och återkoppling till användaren.

----------------------------------------------------------------------------
## TEKONOLOGIER

### Frontend (Client)
React
JavaScripit
HTML/CSS
Context API
Fetch API

### Backend (Server)
.NET 7
Minimal API
Entity-validering
Dependency Injection
Strukturerad loggning
Swagger/OpenAPI

-------------------------------------------------------------------------------
## PROJEKTSTRUKTUR

### Client (Frontend)

src/
components/: Innehåller alla React-komponenter som bygger användargränssnittet

context/: Innehåller React Context för global tillståndshantering i applikationen

services/: Innehåller API-tjänster för kommunikation med backend

App.jsx: Huvudkomponenten som fungerar som container för resten av applikationen

main.jsx: Startpunkt för React-applikationen

App.css: Stilar för huvudkomponenten och allmänna stilregler

index.css: Globala CSS-regler och variabler

---------------------------------------------------------------------------------

### Server (Backend)
Endpoints/: Innehåller alla API-endpoints och routinglogik

Models/: Innehåller datamodeller och valideringslogik

Services/: Innehåller affärslogik och datahantering

Program.cs: Konfigurerar och startar API-servern

---------------------------------------------------------------------------------
### Tests
Postman-samling: För testning av backend API-endpoints

---------------------------------------------------------------------------------
## KOM IGÅNG##

Node.js  och Npm

.NET 7

Visual Studio, VS Code Rider eller Webstorm

### Starta Backend
Öppna server-mappen i Visual Studio eller Rider
Återställ NuGet-paket
Bygg och kör projektet
API:et kommer att vara tillgängligt på http://localhost:5015

### Starta Frontend
Öppna client-mappen i VS Code eller WebStorm
Installera beroenden:
npm install
Starta utvecklingsservern:
npm run dev
Kom åt applikationen på http://localhost:5173 (eller din konfigurerade port)


###API-endpoints
Metod ,Endpoint,Beskrivning

### GET
/api/squares
Hämtar alla kvadrater

### POST
/api/squares
Lägger till en ny kvadrat

### DELETE
/api/squares
Tar bort alla kvadrater

### Testa API:et
En Postman-samling finns inkluderad i tests-katalogen för API-testning. Importera denna samling för att testa endpoints direkt.

### Delad utvecklingsmiljö:
Använd Rider eller Visual Studio för backend-utveckling
Använd VS Code eller WebStorm för frontend-utveckling

### API-testning:
Använd den medföljande Postman-samlingen för att testa API-endpoints
Swagger UI är också tillgängligt under utveckling
