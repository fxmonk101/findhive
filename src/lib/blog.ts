export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  category: "News" | "Release Updates" | "Buying Guides" | "Collecting 101";
  date: string;
  readMinutes: number;
  author: string;
  /** Markdown body — rendered with the shared markdown renderer. */
  body: string;
};

export const POSTS: Post[] = [
  {
    slug: "pokemon-tcg-set-release-calendar",
    title: "Pokémon TCG Release Calendar: What's Landing Next",
    metaTitle: "Pokémon TCG Release Calendar & Set Guide | findhive",
    metaDescription:
      "A plain-English guide to how Pokémon TCG sets are released, what a set rotation means for prices, and how to time sealed booster purchases.",
    excerpt:
      "Sets arrive on a predictable rhythm — once you understand it, you stop overpaying for sealed product in week one.",
    category: "Release Updates",
    date: "2026-02-18",
    readMinutes: 6,
    author: "findhive editorial",
    body: `Pokémon TCG releases follow a rhythm that barely changes from year to year. Learn the rhythm and you stop guessing about when to buy sealed product.

## How the release cycle actually works

A main expansion lands roughly every three months, with smaller special sets, tins and battle deck refreshes filling the gaps. Each main set opens with heavy print runs, then reprints follow if demand holds. This is why a chase card can cost double in week one and settle 30-40% lower by week six.

## The three windows that matter

1. **Pre-release week.** Stock is thin, hype is loudest, prices peak. Worth it only if you want a specific promo tied to the launch event.
2. **Weeks two to eight.** Distribution catches up. This is where sealed [booster packs](/collections/pokemon-booster-packs) are usually at their fairest price.
3. **Post-rotation.** Once a set leaves standard play, competitive demand drops but collector demand for [ultra rares](/collections/pokemon-ultra-rares) keeps climbing on the strongest illustrations.

## What to buy in each window

If you are playing, [battle decks](/collections/pokemon-battle-decks) give you a legal 60-card list immediately and cost far less than assembling one from singles. If you are collecting, singles beat packs on cost-per-card almost every time — the exception being sealed product you intend to keep sealed.

## Reading a set's long-term prospects

Look for three signals: an iconic Pokémon line in the chase slot (a [Charizard](/collections/charizard-vault) alt art moves differently to a mid-tier card), a genuinely new art style, and print-run noise. Sets that were short-printed hold value; sets that were reprinted twice rarely do.

## Where prices come from

Public sales data is the honest baseline. [TCGplayer](https://www.tcgplayer.com/) and [eBay](https://www.ebay.com/) sold listings show what people actually paid, not what sellers hope for. The official [Pokémon TCG site](https://www.pokemon.com/us/pokemon-tcg/) confirms set legality and release dates.

## Practical takeaway

Buy sealed in the second window, buy singles when you can see the exact card and condition, and ignore anyone who tells you a set is guaranteed to appreciate. Browse the current [Pokémon TCG range](/category/trading-cards/pokemon-tcg) to see what's on the shelf right now.`,
  },
  {
    slug: "how-to-grade-pokemon-cards",
    title: "Grading Pokémon Cards: What Graders Actually Look At",
    metaTitle: "How to Grade Pokémon Cards: Centring, Edges & Surface | findhive",
    metaDescription:
      "Learn the four criteria professional graders use — centring, corners, edges and surface — and how to pre-screen cards before paying submission fees.",
    excerpt:
      "Four criteria decide a grade. Checking them yourself before you submit saves the fee on cards that were never going to gem.",
    category: "Collecting 101",
    date: "2026-02-11",
    readMinutes: 7,
    author: "findhive editorial",
    body: `Grading turns a card into a sealed, comparable asset. It also costs money per submission, so pre-screening matters.

## The four criteria

### Centring
Graders measure the border width on all four sides. A 55/45 split usually still gems; 60/40 rarely does. Hold the card at arm's length — misalignment is easier to see from a distance than under a loupe.

### Corners
Look for whitening and softness. A single fuzzed corner caps most cards at a 9. Corners are also the damage that happens *after* you pull the card, which is why sleeving immediately matters.

### Edges
Run your eye along each edge against a dark background. Factory cutting can leave nicks that were never your fault but still cost you a point.

### Surface
Tilt the card under a single light source and rotate it. Print lines, dimples, scratches and holo scuffing all show up in reflection, never flat-on.

## Pre-screening workflow

1. Sleeve the card in a penny sleeve straight from the pack.
2. Inspect under one directional lamp, not overhead room light.
3. Reject anything with a visible surface line — it will not gem.
4. Only then load into a semi-rigid holder for submission.

## Is it worth grading?

Rough rule: grading pays when the graded-to-raw price gap exceeds the submission fee by a comfortable margin, and when the card is realistically a 9 or 10. Bulk commons never qualify. Chase [full arts and hyper rares](/collections/pokemon-ultra-rares) frequently do, and [promo cards](/collections/pokemon-promos) can be strong candidates because populations are smaller.

## Where to submit

The major graders are [PSA](https://www.psacard.com/), [Beckett](https://www.beckett.com/grading) and [CGC Cards](https://www.cgccards.com/). Turnaround and pricing tiers change often — check current service levels before you commit, and always insure the outbound shipment.

## Storage between pulls and submission

Flat, cool, out of sunlight, in a rigid holder. Cards do not improve in a drawer, but they can absolutely get worse. If you need supplies, our [card accessories](/category/trading-cards/card-accessories) section covers sleeves and toploaders.`,
  },
  {
    slug: "sealed-vs-singles",
    title: "Sealed vs Singles: Which Should You Actually Buy?",
    metaTitle: "Sealed Product vs Singles: A Buyer's Guide | findhive",
    metaDescription:
      "Compare sealed booster packs against buying singles — expected value, risk, collecting goals and what makes sense for players versus investors.",
    excerpt:
      "Packs sell the feeling of opening. Singles sell the card. Knowing which you're buying changes what you should spend.",
    category: "Buying Guides",
    date: "2026-02-04",
    readMinutes: 5,
    author: "findhive editorial",
    body: `The sealed-versus-singles question has a clean answer once you name your goal.

## If your goal is a specific card

Buy the single. Every time. Pack odds on a modern chase card are steep, and the money spent chasing it almost always exceeds the card's market price. Browse [ultra rares](/collections/pokemon-ultra-rares) or the [Charizard vault](/collections/charizard-vault) and you'll usually find the card cheaper than the expected cost of pulling it.

## If your goal is playing

Buy a [battle deck](/collections/pokemon-battle-decks) first, then upgrade with singles. A pre-built deck is legal, coherent and cheap. Packs give you a random pile that rarely forms a functioning list.

## If your goal is the experience

Then packs are exactly right, and expected value is beside the point — you are buying twenty minutes of anticipation, not an asset. Just budget it as entertainment. [Sealed boosters](/collections/pokemon-booster-packs) in multi-pack bundles usually give a better per-pack rate than singles packs at the till.

## If your goal is holding value

Sealed product from short-printed sets has historically outperformed most singles, because supply only ever decreases. The catch: it must stay sealed, stored flat and away from light, and you need patience measured in years. Graded high-population singles are the weakest of the three options here.

## The honest maths

| Goal | Best buy | Main risk |
| --- | --- | --- |
| Specific card | Single | Condition misgrading |
| Competitive play | Battle deck + singles | Set rotation |
| Opening experience | Sealed packs | Expected value below spend |
| Long hold | Sealed set product | Storage damage, reprints |

## Verify prices before you commit

Cross-check any single against sold data on [TCGplayer](https://www.tcgplayer.com/) or [eBay](https://www.ebay.com/) before buying — including here. A fair retailer has nothing to fear from a price check.

Ready to look? Start with the full [Pokémon TCG category](/category/trading-cards/pokemon-tcg).`,
  },
  {
    slug: "protecting-your-collection",
    title: "Protecting a Card Collection: Sleeves, Cases and Climate",
    metaTitle: "How to Store & Protect Trading Cards Properly | findhive",
    metaDescription:
      "Practical storage advice for trading card collections — sleeve types, toploaders versus semi-rigids, humidity, light exposure and long-term boxing.",
    excerpt:
      "Most card damage happens at home, not in transit. Storage is the cheapest value protection there is.",
    category: "Collecting 101",
    date: "2026-01-28",
    readMinutes: 5,
    author: "findhive editorial",
    body: `A card loses value faster in a shoebox than in the post. Here is the storage stack that actually works.

## Layer one: penny sleeves

Every card worth keeping goes into a soft sleeve immediately. Load from the side, never force the card down onto the seam. Cheap, and it prevents the majority of surface scratching.

## Layer two: rigid protection

- **Toploaders** for display and everyday handling.
- **Semi-rigid holders** for anything heading to a grader — they are the accepted submission format.
- **Team bags** over a toploader for a final dust seal.

## Layer three: the box

Store cards vertically, never stacked flat under weight. Fill empty space so cards cannot slide and rub. Cardboard boxes are fine indoors; plastic cases are better if humidity swings.

## Climate matters more than people expect

Aim for stable room temperature and moderate humidity. Attics and garages are the two worst places in most homes — heat cycles warp card stock and humidity swells it. Direct sunlight fades holo foil permanently and quickly.

## Sealed product is a different problem

Sealed boxes want flat, cool, dark and undisturbed. Shrink wrap creases are permanent and visibly reduce value. Do not stack heavy items on sealed product, and do not "just check" the wrap repeatedly.

## Insurance and inventory

Photograph anything significant, front and back, and keep a simple spreadsheet with purchase date and price. If your collection crosses into serious money, check whether your home contents policy covers collectibles — many cap them low. The [Collectors Universe](https://www.collectorsuniverse.com/) and [PSA](https://www.psacard.com/) resources are useful references for population and valuation context.

## Supplies

Sleeves, toploaders and storage are stocked under [card accessories](/category/trading-cards/card-accessories). If you are buying [promos](/collections/pokemon-promos) or [Japanese exclusives](/collections/japanese-pokemon), order protection in the same basket — they should not sit loose even overnight.`,
  },
  {
    slug: "choosing-your-first-automatic-watch",
    title: "Choosing Your First Automatic Watch",
    metaTitle: "First Automatic Watch Buying Guide: Movements & Sizing | findhive",
    metaDescription:
      "What to look for in a first automatic watch — movement types, case sizing, water resistance ratings, crystal materials and realistic accuracy expectations.",
    excerpt:
      "Automatic watches are mechanical objects, not gadgets. Knowing the five specs that matter makes the first purchase easy.",
    category: "Buying Guides",
    date: "2026-01-21",
    readMinutes: 6,
    author: "findhive editorial",
    body: `An automatic watch winds itself from the motion of your wrist. No battery, no charging — but a set of trade-offs worth understanding before you buy.

## Movement: automatic vs quartz

Automatics are mechanical and typically run within -20 to +40 seconds a day. Quartz is far more accurate and cheaper to service. Choosing automatic is a preference for craft and sweep, not for precision.

## Case size and how it wears

Measure your wrist. As a rough guide: 34-38mm suits wrists under 16.5cm, 39-42mm is the modern all-rounder, 43mm+ reads as a statement. Lug-to-lug distance matters more than diameter — a short-lugged 42mm can wear smaller than a long-lugged 39mm.

## Water resistance, honestly

- **30m / 3ATM** — splashes only.
- **50m / 5ATM** — handwashing, rain.
- **100m / 10ATM** — swimming.
- **200m+** — diving, and expect a screw-down crown.

Numbers assume fresh gaskets. Any watch that has been open needs a pressure test before you trust it.

## Crystal

Sapphire resists scratches best and is the standard worth holding out for. Mineral glass is acceptable at lower prices. Acrylic scratches easily but polishes out and suits vintage-styled pieces.

## Bracelet and clasp

A solid-link bracelet with screwed pins and a machined clasp is a strong quality signal. Hollow end-links and folded clasps are where cost is usually cut.

## Care and expectations

Wear it regularly or use a winder; a stopped automatic is not broken. Service intervals run roughly five to seven years depending on movement. For deeper technical reading, [Hodinkee](https://www.hodinkee.com/) and [Watchfinder](https://www.watchfinder.co.uk/) both publish accessible movement explainers.

Browse the current [men's watches](/category/watches/mens-watches) and [women's watches](/category/watches/womens-watches) selections, or see the wider [watch category](/category/watches) for straps and tools.`,
  },
  {
    slug: "vibration-plate-training-guide",
    title: "Vibration Plate Training: What the Machines Actually Do",
    metaTitle: "Vibration Plate Guide: Specs, Programmes & Safety | findhive",
    metaDescription:
      "How whole-body vibration plates work, which specifications matter, sensible session lengths, and who should avoid them.",
    excerpt:
      "Vibration plates are a low-impact conditioning tool, not a shortcut. Here's what to look for on the spec sheet.",
    category: "Buying Guides",
    date: "2026-01-14",
    readMinutes: 5,
    author: "findhive editorial",
    body: `Whole-body vibration plates transmit rapid oscillation through the body, triggering repeated reflexive muscle contractions. Used sensibly they are a useful low-impact addition to a routine.

## What the specs mean

- **Motor power (W)** — sets how much load the plate can drive. Heavier users need more.
- **Frequency range (Hz)** — the speed of oscillation. Wider ranges give you more usable settings.
- **Amplitude** — how far the platform travels. Higher amplitude means a more intense session.
- **Weight limit** — respect it. Exceeding it kills motors and warranties.
- **Programmes and speed levels** — convenience features; a plate with 99 speeds is not 99 times better than one with 20.

## A realistic session

Start at 10 minutes, low frequency, feet planted, knees slightly bent — never locked. Progress by adding static holds (squat, plank with forearms on the plate, calf raise) rather than by cranking the speed. Two to four sessions a week is plenty alongside other training.

## Who should be cautious

Pregnancy, recent surgery, implants, cardiovascular conditions, retinal conditions and acute joint injury are all reasons to check with a clinician first. This is genuine medical territory, not marketing caution — [the NHS](https://www.nhs.uk/live-well/exercise/) has general activity guidance worth reading alongside professional advice.

## Floor and placement

Plates transmit vibration into the building. On upper floors, use a dense rubber mat and keep the plate away from walls and glass shelving. Check the machine is level before every session.

## What to expect

Evidence supports modest gains in circulation, balance and perceived recovery, especially in less active users. It does not replace resistance training or cardio. Treat it as a complement.

Browse the current [vibration plate range](/collections/vibration-training), or the wider [outdoor and fitness category](/category/outdoor-fitness) for other home training equipment.`,
  },
  {
    slug: "spotting-fake-trading-cards",
    title: "Spotting Fake Trading Cards Before You Pay",
    metaTitle: "How to Spot Fake Pokémon & Sports Cards | findhive",
    metaDescription:
      "Practical authentication checks for trading cards — light test, texture, font weight, back-print colour and rip test alternatives.",
    excerpt:
      "Counterfeits have improved. These checks still catch almost all of them in under a minute.",
    category: "Collecting 101",
    date: "2026-01-07",
    readMinutes: 4,
    author: "findhive editorial",
    body: `Counterfeit cards have got better, but they still fail predictable tests. Run these before money changes hands.

## The light test

Hold the card up to a bright light. Genuine cards use a black core layer that blocks most light. Fakes are usually noticeably translucent, and you can often see the reverse artwork through the front.

## Texture and finish

Real modern cards have a fine linen texture you can feel with a fingernail across the surface. Counterfeits frequently feel glassy, over-glossed, or oddly slick.

## Font and colour

Compare against a known-genuine card from the same set. Fakes commonly get letter weight slightly wrong — too bold, too thin, or spaced unevenly. Energy symbols and set icons are where errors cluster.

## Back print

Look at the blue and the concentric detail on the reverse. Off-hue blues, blurred edges and mushy small text are strong signals. The back is harder to counterfeit accurately than the front.

## Weight and edges

A genuine card sits in a narrow weight range. Edges should be cleanly cut with no visible layer separation. Peeling at a corner is decisive.

## Buying safely

Buy from sellers who photograph the actual card, front and back, under normal light — not stock images. Ask for a light-test photo if the value justifies it. Cross-reference set numbering against the official [Pokémon TCG database](https://www.pokemon.com/us/pokemon-tcg/) or [Beckett's](https://www.beckett.com/) price guides for sports cards.

Every single we list is photographed as-received and inspected before it ships. Browse [ultra rares](/collections/pokemon-ultra-rares), [promos](/collections/pokemon-promos) or the full [trading cards category](/category/trading-cards).`,
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export const POST_CATEGORIES = ["News", "Release Updates", "Buying Guides", "Collecting 101"] as const;
