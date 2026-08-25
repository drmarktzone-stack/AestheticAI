# AestheticAI Studio — Product Blueprint

## Positioning

**AestheticAI Studio** is a clinician-led visual care system for aesthetic consultation, treatment planning and follow-up. It replaces disconnected utilities with an opinionated case workflow. The experience is editorial and calm, but never vague: every visual component resolves to a concrete decision, document, action or next appointment.

## Primary experience: Case Canvas

The default entry point is a single **Case Canvas**, not a landing page. It opens a real-looking but explicitly labelled demo case and answers four questions in one glance: who the patient is, what they want, what has been observed, and what happens next.

| Canvas band | Purpose | Key interaction |
| --- | --- | --- |
| Case header | Identity, consent state, context and current stage. | Change case, open case dossier, see privacy state. |
| Personal brief | Surface desired look, treatment philosophy, concern and key consultation note. | Edit / confirm clinician summary. |
| Visual atlas | Compare standardised frontal, oblique, profile and dynamic captures. | Select lens, launch guided capture, add clinician annotation. |
| Treatment arc | Move from a one-off procedure mindset to a staged plan. | Explore Now, Next and Maintain phases. |
| Care queue | Convert a plan into an action: review plan, send for approval, schedule a follow-up. | Resolve one clearly labelled next action. |

## Information architecture

| Workspace | User outcome | Signature interaction |
| --- | --- | --- |
| Case Canvas | Understand the consultation state in under 30 seconds. | Rich overview with visual atlas and next action. |
| Visual Atlas | Produce reproducible photographic evidence. | Lens selector, standardisation score, annotation layer. |
| Treatment Arc | Explain a phased, clinician-reviewed plan. | Storyline across Now / Next / Maintain. |
| Follow-up | Keep recovery and satisfaction visible without alarming the patient. | Day-based progress curve, message context and guided check-in. |
| Care Queue | Give the clinic a responsible, prioritised response view. | Triage cards with treatment and follow-up context. |

## Visual system

The direction is **Editorial Clinical Gallery**, not dark SaaS or spa wellness. The product uses a warm mineral base, obsidian typography, muted orchid as an intelligence cue and apricot only for human warmth. A generous desktop composition uses a left navigation rail, a broad content canvas and a narrow contextual side rail. On mobile, the rail collapses into a clear bottom navigation without reducing hierarchy.

| Token family | Intent | Proposed direction |
| --- | --- | --- |
| Canvas | Make the product feel tactile, private and considered. | `#F4F1EC` mineral, `#FBFAF7` porcelain. |
| Ink | Create clinical clarity and contrast. | `#171616` obsidian, `#53504C` graphite. |
| Intelligence | Mark AI-assisted and editable insights without overclaiming. | `#6B5CA5` orchid, `#E6E1F6` lavender wash. |
| Human care | Add warmth to the patient relationship. | `#D98063` apricot, `#F8E4DB` blush wash. |
| Safety | Separate routine, review and urgent states. | `#5B8F78` sage, `#C7973A` amber, `#B85252` red. |

## Demo-mode rules

The first rebuilt version must be fully explorable without external credentials. Every illustration, plan, note and status is explicitly labelled **Demo case**. AI items are phrased as "assistant draft" and each carries a clear clinician-review status. No simulated image is presented as an expected clinical result.

## Media plan

The Studio uses one original editorial case portrait and derivative angle cards as a visual anchor. It does not use stock beauty imagery, before/after claims or generic procedure footage. Video will appear only as a workflow item when a clinic uploads or approves a patient education asset, with caption, duration and content-owner metadata.
