---
layout: base.njk
title: Pocket Guide to the Empire - Skyrim
---

# Pocket Guide

<p style="
  font-family: 'Crimson Pro', serif;
  font-weight: 700;
  font-size: 2.0rem;
  text-align: center;
  color: #323232;
  text-transform: uppercase;
  margin-top: 0;">
  to the Empire
</p>

<div class="map-wrapper">
  <div class="map-viewport">
<div
  class="map-raster"
  role="img"
  aria-label="Map of Tamriel by CrynwrDrwg"
  style="background-image: url('{{ '/images/tamriel.webp' | url }}');
    opacity: 0.75; mix-blend-mode: multiply;
    filter: brightness(110%) saturate(50%);
    --map-size: 225% auto; --map-position: 52.5% 5.0%;">
</div>
    <svg viewBox="0 0 1000 1000" class="map-overlay">
      <desc>PROVINCE NAMES ------------------------------------- </desc>
      <text x="570" y="900"
        class="imglab imglab-grey" font-size="36" stroke-width="5px"
        stroke="var(--body-bg-color)" paint-order="stroke fill">
        Cyrodiil</text>
      <text x="-10" y="900"
        class="imglab imglab-grey" font-size="36" text-anchor="middle"
        stroke-width="5px" stroke="var(--body-bg-color)"
        paint-order="stroke fill">Hammerfell</text>
      <desc>CITY NAMES ----------------------------------------- </desc>
      <circle cx="300" cy="197.5" r="6.25" fill="var(--heading-color)"/>
      <text x="300" y="177.5"
        class="imglab" font-size="36" text-anchor="middle" stroke-width="5px"
        stroke="var(--body-bg-color)" paint-order="stroke fill">
        Haafingar</text>
      <circle cx="896.25" cy="712.5" r="6.25" fill="var(--heading-color)"/>
      <text x="896.25" y="692.5"
        class="imglab" font-size="36" text-anchor="middle" stroke-width="5px"
        stroke="var(--body-bg-color)" paint-order="stroke fill">
        Riften</text>
      <circle cx="792.5" cy="376.25" r="6.25" fill="var(--heading-color)"/>
        <text x="792.5" y="356.25"
        class="imglab" font-size="36" text-anchor="middle" stroke-width="5px"
        stroke="var(--body-bg-color)" paint-order="stroke fill">
        Windhelm</text>
  </svg>
</div>

## Skyrim





<footer class="footer-bar">
  <nav class="footer-grid" aria-label="Footer">
    <a href="{{ '/md/pocketguide-cyrodiil/' | url }}" class="nav-left">
      <svg
        class="footer-icon"
        viewBox="0 0 24 24"
        width="32" height="32"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
      </svg>
      Cyrodiil
    </a>
    <span class="nav-spacer" aria-hidden="true">
      &boxv;</span>
    <a href="{{ '/md/pocketguide/' | url }}" class="nav-middle">Pocket Guide</a>
    <span class="nav-spacer" aria-hidden="true">&boxv;</span>
    <!-- <span></span> -->
    <a href="{{ '/md/pocketguide-elsweyr/' | url }}" class="nav-right">
      Elsweyr
      <svg
        class="footer-icon"
        viewBox="0 0 24 24"
        width="32" height="32"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
      </svg>
    </a>
  </nav>
</footer>