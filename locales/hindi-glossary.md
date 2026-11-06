# Hindi style glossary

How to write Hindi for the WeSkate Co storefront (`/hi`). Use it whenever you
add or change Hindi text, whether you write it yourself or have an LLM draft
it, so the wording stays consistent across the site.

## Where Hindi text lives

| Text                                                                 | Where it's stored                                | Notes                                                                                                                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Product and collection titles, descriptions, SEO fields              | Shopify translations (locale `hi`)               | Edit in Shopify's Translate & Adapt app, or with the Admin API's `translationsRegister`. The storefront requests them with `@inContext(language: HI)`. |
| Interface text (menus, buttons, labels, footer)                      | `locales/hi.json`, mirrored by `locales/en.json` | Every key must exist in both files. A missing key shows the raw key name on the page.                                                                  |
| Admin-managed content (hero, Newly Released, Shop Now, social posts) | Database                                         | English only for now.                                                                                                                                  |

## Tone

Everyday spoken Hindi, the way Indian skaters talk. Skate and product terms
are written phonetically in Devanagari, not replaced with formal Hindi words.
Interface labels are short and natural.

## Keep in Latin script, unchanged

- Brand, artist and product names: WeSkate Co, Sphere, Toucan, Spitfire, Shake Junt, Girl, Disorder, Primitive, Baker, MACBA Life, Wasted Angels, Mon Amour, JaysDead, Snapmint, GoKwik, LEFT, MIA, A-Kill, Anusha.
- In product titles, the brand and model part, in its original casing. Translate only the generic noun: "SPHERE SHAMAN WHITE PRO DECK" → "SPHERE SHAMAN WHITE प्रो डेक".
- Model and line names: Toucan Pro, Classic, Steel, Tropical, Jungle, Double Hollow, Black Pro, Original, Conical Full, S6. "PRO" is a model name in "Toucan Pro", but a generic word (प्रो) in "Sphere … Pro Deck".
- Codes, sizes and units: 52mm, 95A, 80AB, ABEC-9, OS780, GSM, mm, kg, CNC, UK shoe sizes, 8.25", 2'-0", prices.
- Email addresses, links, and all HTML tags and attributes.
- Titles that are only a brand ("Girl Skateboards") or a brand plus codes ("TOUCAN JUNGLE CLASSIC 100A 53mm / 55mm"). Leave these untranslated.

## Never translate in Shopify

- Product option names and values (Size, Concave, Mellow, Medium). The variant selector matches on them, puts them in URLs and adds to the cart by them. Their on-screen Hindi comes from the `option.*` keys in `locales/hi.json` instead: the key is the English text in lower case with spaces as underscores ("Wheel Size" → `option.wheel_size`). A new option name or value with no key is shown in English.
- Handles and URLs. Hindi pages live at `/hi/<same path>`.

## Terms

| English                                                  | Hindi                                                  |
| -------------------------------------------------------- | ------------------------------------------------------ |
| deck / decks                                             | डेक / डेक्स                                            |
| complete / completes                                     | कम्प्लीट / कम्प्लीट्स                                  |
| beginner / pro                                           | बिगिनर / प्रो                                          |
| skateboard(s) / surfskate(s)                             | स्केटबोर्ड(्स) / सर्फ़स्केट(्स)                        |
| trucks / wheels / bearings                               | ट्रक्स / व्हील्स / बेयरिंग्स                           |
| griptape / grip                                          | ग्रिपटेप / ग्रिप                                       |
| hardware / bushings                                      | हार्डवेयर / बुशिंग्स                                   |
| accessories / apparel                                    | एक्सेसरीज़ / अपैरल                                     |
| concave (Mellow / Medium)                                | कॉन्केव (मेलो / मीडियम)                                |
| popsicle / double kick / old school                      | पॉप्सिकल / डबल किक / ओल्ड स्कूल                        |
| rounded / squared end                                    | राउंडेड / स्क्वेयर्ड एंड                               |
| nose / tail / wheelbase                                  | नोज़ / टेल / व्हीलबेस                                  |
| ply / plies / Canadian maple                             | प्लाई / कैनेडियन मेपल                                  |
| cold-pressed / epoxy                                     | कोल्ड-प्रेस्ड / एपॉक्सी                                |
| stain / graphic / artwork                                | स्टेन / ग्राफ़िक / आर्टवर्क                            |
| graffiti artist                                          | ग्रैफ़िटी आर्टिस्ट                                     |
| tech deck / carbon-fibre / fibreglass                    | टेक डेक / कार्बन-फ़ाइबर / फ़ाइबरग्लास                  |
| ollie / push / turn                                      | ओली / पुश / टर्न                                       |
| carve / carving / pump                                   | कार्व / कार्विंग / पंप                                 |
| ledges / ramps                                           | लेजेस / रैम्प्स                                        |
| quarter pipe / kicker / flat rail / ledge / lip / coping | क्वार्टर पाइप / किकर / फ़्लैट रेल / लेज / लिप / कोपिंग |
| marine plywood / laminate                                | मरीन प्लाईवुड / लैमिनेट                                |
| fishtail / riser                                         | फ़िशटेल / राइज़र                                       |
| kingpin / hollow / solid / baseplate                     | किंगपिन / हॉलो / सॉलिड / बेसप्लेट                      |
| axle / hanger                                            | एक्सल / हैंगर                                          |
| spring-loaded / pivot / swivel / tension                 | स्प्रिंग-लोडेड / पिवट / स्विवल / टेंशन                 |
| speed washers / axle nuts / mounting hardware            | स्पीड वॉशर्स / एक्सल नट्स / माउंटिंग हार्डवेयर         |
| sold as a pair                                           | जोड़ी में बिकते हैं                                    |
| races / cage / shield / seal / spacers                   | रेसेज़ / केज / शील्ड / सील / स्पेसर्स                  |
| ceramic / chrome steel / silicon nitride                 | सिरेमिक / क्रोम स्टील / सिलिकॉन नाइट्राइड              |
| urethane / durometer / high rebound                      | यूरेथेन / ड्यूरोमीटर / हाई-रिबाउंड                     |
| grit / grain                                             | ग्रिट / ग्रेन                                          |
| perforated / abrasive / adhesive                         | पर्फ़ोरेटेड / एब्रेसिव / एडहेसिव                       |
| assembled / set up with                                  | असेंबल किया हुआ / के साथ सेट-अप                        |
| tee / T-shirts                                           | टी-शर्ट / टी-शर्ट्स                                    |
| T-tool                                                   | T-टूल                                                  |
| colours (in titles)                                      | phonetic: पिंक, ब्लैक, ब्लू, रेड, येलो, कोरल           |

## Recurring phrases

| English                                                 | Hindi                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------- |
| Specs / Notes / Dimensions (inches)                     | स्पेसिफ़िकेशन / नोट्स / माप (इंच)                             |
| width / length / height / depth                         | चौड़ाई / लंबाई / ऊँचाई / गहराई                                |
| In the box                                              | बॉक्स में क्या है                                             |
| Good to know                                            | ध्यान रखें                                                    |
| Best for                                                | किसके लिए बेस्ट है                                            |
| Made by X. Distributed in India by Toucan Distribution. | X द्वारा निर्मित। भारत में Toucan Distribution द्वारा वितरित। |
| Buy at WeSkate Co                                       | WeSkate Co पर खरीदें                                          |
| fast India shipping                                     | भारत में फ़ास्ट शिपिंग                                        |
| Add to Cart / Buy Now                                   | कार्ट में जोड़ें / अभी खरीदें                                 |
| Shop / View All / Contact Us                            | शॉप / सब देखें / संपर्क करें                                  |
| Language                                                | भाषा                                                          |

## Artist credits

Write a deck's artist credit in a Hindi description as `डेक आर्टवर्क: <artist>` on its own line (the English is `Deck Artwork by <artist>`), with the artist's name in Latin script. The product page turns either form into the artist badge. It also reads `डेक कलाकृति: <artist>` and drops a trailing `द्वारा`, since the store's existing Hindi uses both; any other wording shows as plain text.

## Collection titles

On the store page, a subcategory pill drops its parent's leading word, so "Skateboard Decks" shows as "Decks". In Hindi this works when the title starts with the word as written in the terms table (स्केटबोर्ड, सर्फ़स्केट, अपैरल…); other titles are shown whole.

## Formatting

- Use Western digits (2,899.00), not Devanagari digits. Prices are formatted with `en-IN`, which gives Indian grouping (₹1,23,456).
- In product copy, end sentences with the Hindi full stop "।".
- Keep SEO descriptions at 160 characters or fewer. Devanagari vowel signs count as characters.
- Use ordinary spaces, not non-breaking ones, unless the English source has them.
- Keep every HTML tag, attribute, link and table row exactly as in the English. Translate only the visible text.

## Open wording questions

These have been flagged for a native speaker to settle:

- "products": older dictionary entries say "उत्पाद", newer ones "प्रोडक्ट".
- `academy.title` is "वीस्केट अकादमी". That writes the brand in Devanagari; the rule above would make it "WeSkate अकादमी".
- "Relevance" (sort) → "सबसे सही मैच"; "NEWLY RELEASED" → "नए लॉन्च".
