<template>
  <div style="font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 24px;">
    <nav style="display: flex; gap: 24px; margin-bottom: 48px; border-bottom: 1px solid #eee; padding-bottom: 16px;">
      <NuxtLink to="/" style="font-weight: 600; color: #1a1a1a; text-decoration: none;">Startseite</NuxtLink>
      <NuxtLink to="/about" style="color: #666; text-decoration: none;">Über uns</NuxtLink>
      <NuxtLink to="/services" style="color: #666; text-decoration: none;">Leistungen</NuxtLink>
    </nav>

    <h1 style="font-size: 48px; font-weight: 800; line-height: 1.1; margin: 0 0 16px;">
      Willkommen bei<br>
      <span style="color: #FF6B35;">Muster GmbH</span>
    </h1>

    <p style="font-size: 18px; color: #555; line-height: 1.6; max-width: 600px; margin-bottom: 48px;">
      Wir sind Ihr Partner für digitale Lösungen. Von der Strategie bis zur
      Umsetzung — alles aus einer Hand.
    </p>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 64px;">
      <div style="background: #f8f8f8; border-radius: 12px; padding: 32px;">
        <h3 style="margin: 0 0 8px; font-size: 20px;">Beratung</h3>
        <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.5;">
          Strategische Digitalberatung für Ihr Unternehmen.
        </p>
      </div>
      <div style="background: #f8f8f8; border-radius: 12px; padding: 32px;">
        <h3 style="margin: 0 0 8px; font-size: 20px;">Webentwicklung</h3>
        <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.5;">
          Moderne Webseiten und Web-Applikationen.
        </p>
      </div>
      <div style="background: #f8f8f8; border-radius: 12px; padding: 32px;">
        <h3 style="margin: 0 0 8px; font-size: 20px;">SEO & Ads</h3>
        <p style="color: #666; font-size: 14px; margin: 0; line-height: 1.5;">
          Sichtbarkeit die messbare Ergebnisse liefert.
        </p>
      </div>
    </div>

    <section style="background: #1a1a1a; color: white; border-radius: 16px; padding: 48px; margin-bottom: 64px;">
      <h2 style="font-size: 32px; margin: 0 0 12px;">Bereit durchzustarten?</h2>
      <p style="color: #aaa; font-size: 16px; margin: 0 0 24px;">Kontaktieren Sie uns für ein unverbindliches Erstgespräch.</p>
      <button style="background: #FF6B35; color: white; border: none; border-radius: 8px; padding: 12px 28px; font-size: 16px; font-weight: 600; cursor: pointer;">
        Kontakt aufnehmen
      </button>
    </section>

    <footer style="text-align: center; padding: 24px 0; color: #aaa; font-size: 13px; border-top: 1px solid #eee;">
      © 2026 Muster GmbH — Prototyp erstellt von POINTED. Digital Services
    </footer>
  </div>
</template>
