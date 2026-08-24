---
name: Protokol
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3f4945'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#707975'
  outline-variant: '#bfc9c4'
  surface-tint: '#29695b'
  primary: '#00342b'
  on-primary: '#ffffff'
  primary-container: '#004d40'
  on-primary-container: '#7ebdac'
  inverse-primary: '#94d3c1'
  secondary: '#5f5e5d'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfdd'
  on-secondary-container: '#636261'
  tertiary: '#4e2013'
  on-tertiary: '#ffffff'
  tertiary-container: '#693527'
  on-tertiary-container: '#e89f8c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#afefdd'
  primary-fixed-dim: '#94d3c1'
  on-primary-fixed: '#00201a'
  on-primary-fixed-variant: '#065043'
  secondary-fixed: '#e5e2e0'
  secondary-fixed-dim: '#c8c6c4'
  on-secondary-fixed: '#1b1c1b'
  on-secondary-fixed-variant: '#474745'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#ffb5a1'
  on-tertiary-fixed: '#370e04'
  on-tertiary-fixed-variant: '#6d382a'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 80px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The design system is engineered to evoke the atmosphere of a high-end, private aesthetic medicine clinic. It prioritizes **clinical authority** and **understated luxury**, moving away from "tech-startup" tropes in favor of a sophisticated editorial aesthetic. 

The brand personality is precise, exclusive, and academic. It seeks to provide a calm, focused environment for licensed physicians to manage complex protocols. The visual style is **Minimalist-Professional**, characterized by generous whitespace (breathing room), a restricted and intentional color palette, and a focus on high-quality typography. There is an absolute avoidance of decorative elements like gradients or heavy shadows; instead, the system relies on perfect alignment and structural integrity to convey value.

## Colors
The palette is rooted in natural, clinical tones that reduce visual fatigue while maintaining a premium feel.

- **Primary Clinical Teal (#004D40):** Used sparingly for primary actions, success states, and key branding moments. It represents medical expertise and safety.
- **Surface Stone (#F5F2F0):** The foundational background color. It is warmer than pure white, suggesting a high-end interior environment and reducing screen glare during long clinical sessions.
- **Deep Charcoal (#1A1A1A):** Used for all primary text and structural borders to ensure maximum legibility and a grounded, serious tone.
- **Muted Stone Accent (#8C7E6D):** A secondary neutral used for subtle borders, disabled states, or secondary UI elements to maintain the "editorial" warmth.

## Typography
This design system utilizes a high-contrast typographic pairing to balance tradition with modernity.

- **Headlines (Noto Serif):** Used for titles, page headers, and important patient names. In Hebrew, this serif face provides a classic, trustworthy "medical journal" feel.
- **Body & Data (Inter):** A utilitarian sans-serif chosen for its exceptional legibility in dense data tables, clinical notes, and interface labels.
- **RTL Optimization:** Special attention is paid to line heights in Hebrew and Arabic to prevent collisions of diacritics and to ensure a comfortable reading rhythm. 
- **Hierarchy:** All labels and "metadata" use the uppercase (where applicable) or bolded Inter font at small sizes to contrast against the elegant Noto Serif headers.

## Layout & Spacing
The layout follows an **Editorial Grid** philosophy. It is not merely functional but seeks to frame content as if it were a high-end publication.

- **Grid Model:** A 12-column system for desktop with wide 24px gutters. Margins are generous (minimum 40px on desktop) to keep content centered and focused.
- **Spacing Rhythm:** Based on a 4px baseline, but favoring larger leaps (e.g., 40px or 80px) between major sections to emphasize the "private clinic" sense of space.
- **Full-Bleed Elements:** Photography (clinical results or lifestyle) should occasionally break the container or span the full width to create a premium, immersive experience.
- **RTL Reflow:** The entire layout flips for Hebrew/Arabic, with logical margins (e.g., `margin-inline-start`) used to ensure consistency across languages.

## Elevation & Depth
This design system rejects traditional shadows. Depth is communicated through **structural layering** and **tonal contrast** rather than light sources.

- **Tonal Tiers:** Surfaces are differentiated by color. The main canvas is `Surface Stone`, while active work areas or modals may use pure White (#FFFFFF) to stand out.
- **Thin Outlines:** Instead of shadows, use 1px solid borders in Deep Charcoal (#1A1A1A) or Muted Stone (#8C7E6D).
- **Zero Blur:** If a shadow is absolutely required for a floating menu, it must be a "Hard Shadow"—a 2px offset with 100% opacity and no blur, maintaining the sharp, precise clinical aesthetic.

## Shapes
The shape language is **sharp and precise**.

- **Corners:** All primary containers, buttons, and input fields use a strict 4px (`rounded-sm`) radius. This provides just enough softness to feel "designed" without losing the professional, medical-grade edge.
- **No Pills:** Pill-shaped buttons or tags are strictly forbidden. All buttons are rectangular with the standard 4px corner.
- **Visual Precision:** The use of sharp corners reinforces the idea of medical accuracy and surgical precision.

## Components
Consistent application of the clinical aesthetic across all UI elements:

- **Buttons:** Primary buttons use a solid Deep Charcoal or Clinical Teal background with white text. Secondary buttons use a 1px border. No gradients. Hover states involve a subtle tonal shift or a 100% fill.
- **Input Fields:** Rectangular, 1px border in Muted Stone. Labels are always positioned above the field in `label-caps` typography. 
- **Cards:** Used for patient summaries or protocol steps. They have no shadow, a 1px border, and a White background against the Stone page surface.
- **Lists:** Data-heavy lists use "Ghost Rows" where dividers are only 1px and very light (#E5E2E0), ensuring the data remains the focal point.
- **Imagery:** Photography should be clinical yet beautiful, using natural light and high-resolution details. Medical diagrams should use the Clinical Teal as the primary stroke color.