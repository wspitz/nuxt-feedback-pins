<template>
  <div style="font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 24px;">
    <nav style="display: flex; gap: 24px; margin-bottom: 48px; border-bottom: 1px solid #eee; padding-bottom: 16px;">
      <NuxtLink to="/" style="color: #666; text-decoration: none;">Startseite</NuxtLink>
      <NuxtLink to="/about" style="font-weight: 600; color: #1a1a1a; text-decoration: none;">Über uns</NuxtLink>
      <NuxtLink to="/services" style="color: #666; text-decoration: none;">Leistungen</NuxtLink>
    </nav>

    <h1 style="font-size: 42px; font-weight: 800; margin: 0 0 24px;">Über uns</h1>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 48px;">
      <div>
        <p style="font-size: 16px; color: #555; line-height: 1.7;">
          Die Muster GmbH wurde 2018 gegründet und hat sich seither zu einem
          führenden Anbieter digitaler Lösungen in Niederösterreich entwickelt.
          Unser Team aus 12 Expertinnen und Experten arbeitet täglich daran,
          Unternehmen in der digitalen Welt erfolgreich zu machen.
        </p>
        <p style="font-size: 16px; color: #555; line-height: 1.7;">
          Wir glauben daran, dass gute Technologie einfach sein muss.
          Deshalb setzen wir auf modernste Frameworks und bewährte Methoden.
        </p>
      </div>
      <div style="background: #f0f0f0; border-radius: 12px; min-height: 250px; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 14px;">
        [ Team-Foto Platzhalter ]
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 64px;">
      <div style="text-align: center; padding: 24px;">
        <div style="font-size: 36px; font-weight: 800; color: #FF6B35;">120+</div>
        <div style="font-size: 13px; color: #888; margin-top: 4px;">Projekte</div>
      </div>
      <div style="text-align: center; padding: 24px;">
        <div style="font-size: 36px; font-weight: 800; color: #FF6B35;">12</div>
        <div style="font-size: 13px; color: #888; margin-top: 4px;">Mitarbeiter</div>
      </div>
      <div style="text-align: center; padding: 24px;">
        <div style="font-size: 36px; font-weight: 800; color: #FF6B35;">7</div>
        <div style="font-size: 13px; color: #888; margin-top: 4px;">Jahre Erfahrung</div>
      </div>
      <div style="text-align: center; padding: 24px;">
        <div style="font-size: 36px; font-weight: 800; color: #FF6B35;">98%</div>
        <div style="font-size: 13px; color: #888; margin-top: 4px;">Kundenzufriedenheit</div>
      </div>
    </div>

    <footer style="text-align: center; padding: 24px 0; color: #aaa; font-size: 13px; border-top: 1px solid #eee;">
      © 2026 Muster GmbH — Prototyp erstellt von POINTED. Digital Services
    </footer>
  </div>
</template>
