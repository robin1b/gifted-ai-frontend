# GiftedAI – frontend

Next.js-frontend van GiftedAI, een blogplatform rond cadeau-ideeën. Gebruikers maken een account aan en beheren hun eigen blogposts; bezoekers lezen de publieke blog. Gebouwd in december 2025 als frontend bij de Laravel-API in [giftedai-backend](https://github.com/robin1b/giftedai-backend).

*English: Next.js frontend for GiftedAI (December 2025): auth, a dashboard to manage blog posts and a public blog, backed by the giftedai-backend Laravel API.*

## Wat erin zit
- Registreren en inloggen tegen de Laravel-API; het Sanctum-token wordt in een httpOnly-cookie bewaard
- Next.js API-routes (`app/api/*`) als tussenlaag, zodat de browser het token nooit rechtstreeks ziet
- `proxy.ts` schermt `/dashboard` af voor niet-ingelogde gebruikers en stuurt onbekende routes door
- Dashboard: eigen posts bekijken, aanmaken (titel, inhoud, optionele afbeelding) en verwijderen; er is een bewerkformulier, maar de route `app/api/posts/[id]` stuurt nog enkel verwijderverzoeken door, dus opslaan na bewerken werkt niet
- Publieke blog met overzicht en detailpagina, inclusief Open Graph- en Twitter-metadata per post
- UI met Tailwind CSS 4 en shadcn/ui-componenten (Radix, lucide-react)

## Techniek
Next.js 16 (App Router, canary), React 19, TypeScript, Tailwind CSS 4, shadcn/ui.

## Lokaal draaien
```bash
npm install
npm run dev
```
Open http://localhost:3000. De URL van de backend staat momenteel rechtstreeks in de API-routes en pagina's (Hostinger-omgeving); er is geen `.env` nodig.

## Status
Prototype, december 2025.

---
_Nagekeken in november 2026 door Robin, met hulp van een AI-agent._
