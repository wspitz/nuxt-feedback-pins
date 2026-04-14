<template>
  <div style="font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 24px;">
    <nav style="display: flex; gap: 24px; margin-bottom: 48px; border-bottom: 1px solid #eee; padding-bottom: 16px;">
      <NuxtLink to="/" style="color: #666; text-decoration: none;">Startseite</NuxtLink>
      <NuxtLink to="/about" style="color: #666; text-decoration: none;">Über uns</NuxtLink>
      <NuxtLink to="/services" style="font-weight: 600; color: #1a1a1a; text-decoration: none;">Leistungen</NuxtLink>
    </nav>

    <h1 style="font-size: 42px; font-weight: 800; margin: 0 0 12px;">Unsere Leistungen</h1>
    <p style="font-size: 18px; color: #666; margin: 0 0 48px;">Alles was Ihr Unternehmen digital braucht.</p>

    <div style="display: flex; flex-direction: column; gap: 24px; margin-bottom: 64px;">
      <div v-for="service in services" :key="service.title" style="display: grid; grid-template-columns: 80px 1fr; gap: 24px; padding: 32px; background: #f8f8f8; border-radius: 12px;">
        <div style="font-size: 48px;">{{ service.icon }}</div>
        <div>
          <h3 style="margin: 0 0 8px; font-size: 22px;">{{ service.title }}</h3>
          <p style="color: #666; font-size: 15px; margin: 0; line-height: 1.6;">{{ service.desc }}</p>
        </div>
      </div>
    </div>

    <footer style="text-align: center; padding: 24px 0; color: #aaa; font-size: 13px; border-top: 1px solid #eee;">
      © 2026 Muster GmbH — Prototyp erstellt von POINTED. Digital Services
    </footer>
  </div>
</template>

<script setup>
const services = [
  { icon: '🎯', title: 'Digitalstrategie', desc: 'Gemeinsam entwickeln wir eine maßgeschneiderte Digitalstrategie für Ihr Unternehmen. Von der Analyse bis zum Maßnahmenplan.' },
  { icon: '💻', title: 'Webentwicklung', desc: 'Moderne, performante Webseiten und Web-Applikationen mit Nuxt, Vue.js und Headless CMS.' },
  { icon: '🔍', title: 'SEO & GEO', desc: 'Suchmaschinenoptimierung für Google und AI-Suchmaschinen. Damit Sie gefunden werden.' },
  { icon: '📣', title: 'Google Ads', desc: 'Zielgerichtete Werbekampagnen mit messbarem ROI. Von der Keyword-Recherche bis zur laufenden Optimierung.' },
  { icon: '📱', title: 'Social Media', desc: 'Strategische Social-Media-Betreuung die Ihre Zielgruppe erreicht und Reichweite aufbaut.' },
]
</script>
