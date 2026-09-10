// Measures how much horizontal space is available beside the main text column
// and exposes it via CSS custom properties so sidenotes can render in the
// margin. Falls back to a stacked layout when there isn't enough room for
// a sidenote to stay readable.
//
// WIDE_MODE_BREAKPOINT must stay in sync with style.css's
// @media (max-width: 1050px) - below that width, CSS already owns
// the stacked/toggle layout and this script steps back and does nothing.

(function () {
  'use strict';

  const WIDE_MODE_BREAKPOINT = 1050;  // px; keep in sync with latex.css value

  const GAP = 24;             // px; between text column and sidenote
  const EDGE_BUFFER = 24;     // px; of breathing room before the viewport edge

  const MIN_READABLE_CH = 16; // ch; minimum readable line length for sidenotes
  const MAX_WIDTH_CH = 32;    // ch; cap so notes don't sprawl on huge screens

  const root = document.documentElement;
  let frame = null;           // pending requestAnimationFrame id, used to
                              // coalesce rapid events

// Measures the pixel width of one ch unit (the width of the 0 glyph) for
// contextEl's rendered font, using an offscreen probe element. Font is
// copied via individual longhand properties rather than the "font"
// shorthand. getComputedStyle(el).font can serialize to an empty
// string when a sub-property (e.g. a non-"normal" font-stretch) isn't
// representable in the shorthand - that would silently make the probe
// fall back to the browser default font and throw off downstream measurements.

  function measureCh(contextEl) {
    const cs = getComputedStyle(contextEl);
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.whiteSpace = 'pre';
    probe.style.fontStyle = cs.fontStyle;
    probe.style.fontVariant = cs.fontVariant;
    probe.style.fontWeight = cs.fontWeight;
    probe.style.fontStretch = cs.fontStretch;
    probe.style.fontSize = cs.fontSize;
    probe.style.fontFamily = cs.fontFamily;
    probe.textContent = '0';
    contextEl.appendChild(probe);
    const width = probe.getBoundingClientRect().width;
    contextEl.removeChild(probe);
    return width;
  }

  function clearProps() {
    root.style.removeProperty('--sidenote-width');
    root.style.removeProperty('--sidenote-offset');
  }

  function measure() {
    const viewportWidth = root.clientWidth;
    // Below the breakpoint, CSS's own media query already handles the
    // stacked layout - undo anything this script previously set and
    // get out of the way.
    if (viewportWidth <= WIDE_MODE_BREAKPOINT) {
      root.classList.remove('sidenotes-stacked');
      clearProps();
      return;
    }

    const body = document.body;
    const rect = body.getBoundingClientRect();
    const cs = getComputedStyle(body);
    const paddingLeft = parseFloat(cs.paddingLeft) || 0;
    const paddingRight = parseFloat(cs.paddingRight) || 0;

    const measureContext = document.querySelector('.sidenote') || body;
    // One DOM probe gives us the ch to px ratio. Both thresholds are then
    // plain multiplication instead of two separate forced reflows.
    const oneCh = measureCh(measureContext);

    const minReadableWidth = oneCh * MIN_READABLE_CH;
    const maxWidth = oneCh * MAX_WIDTH_CH;

    const contentLeft = rect.left + paddingLeft;
    const contentRight = rect.right - paddingRight;

    const rightSpace = viewportWidth - contentRight;
    const leftSpace = contentLeft;
    const space = Math.min(rightSpace, leftSpace);
    let width = space - GAP - EDGE_BUFFER;

    if (width < minReadableWidth) {
      root.classList.add('sidenotes-stacked');
      clearProps();
      return;
    }

    width = Math.min(width, maxWidth);
    root.classList.remove('sidenotes-stacked');
    root.style.setProperty('--sidenote-width', width + 'px');
    root.style.setProperty('--sidenote-offset', -(width + GAP) + 'px');
  }

  // Coalesce bursts of resize/orientationchange events into at most one
  // measure() per animation frame.
  function scheduleMeasure() {
    if (frame) return;
    frame = requestAnimationFrame(function () {
      frame = null;
      measure();
    });
  }

  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('orientationchange', scheduleMeasure);
  window.addEventListener('load', measure);

  // Web fonts can swap in after first paint and change character widths.
  // Re-measure once they've settled.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }

  // Run once immediately: synchronously if the DOM is already parsed,
  // otherwise as soon as it is.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', measure);
  } else {
    measure();
  }
})();