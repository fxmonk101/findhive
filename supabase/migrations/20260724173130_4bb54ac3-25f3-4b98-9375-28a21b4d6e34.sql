
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  image_url TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  review_count INTEGER NOT NULL DEFAULT 0,
  source_retailer TEXT NOT NULL,
  source_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX products_category_idx ON public.products (category);
CREATE INDEX products_subcategory_idx ON public.products (subcategory);
CREATE INDEX products_title_trgm_idx ON public.products USING gin (title gin_trgm_ops);

GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON public.products FOR SELECT
  USING (true);

INSERT INTO public.products (title, category, subcategory, price, original_price, image_url, rating, review_count, source_retailer, source_url, description) VALUES
('Pokémon TCG Scarlet & Violet Booster Box (36 Packs)', 'trading-cards', 'pokemon-tcg', 143.99, 179.99, 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=800&auto=format&fit=crop', 4.8, 2341, 'Amazon', 'https://amazon.com', 'Sealed booster box containing 36 packs of Scarlet & Violet series Pokémon trading cards.'),
('Pokémon Elite Trainer Box - Paldea Evolved', 'trading-cards', 'pokemon-tcg', 49.95, 59.99, 'https://images.unsplash.com/photo-1628960198207-c30a1e837faa?w=800&auto=format&fit=crop', 4.9, 1802, 'Target', 'https://target.com', 'Contains 9 booster packs, 65 card sleeves, energy cards, and a collector guide.'),
('Charizard VMAX Rainbow Rare Single Card PSA 10', 'trading-cards', 'pokemon-tcg', 899.00, 1200.00, 'https://images.unsplash.com/photo-1647892750076-24e6e56fed9c?w=800&auto=format&fit=crop', 5.0, 214, 'eBay', 'https://ebay.com', 'PSA 10 graded Charizard VMAX Rainbow Rare from Champion Path. Investment-grade collectible.'),
('Pikachu Illustrator Reprint Promo Card', 'trading-cards', 'pokemon-tcg', 24.99, NULL, 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop', 4.6, 512, 'TCGPlayer', 'https://tcgplayer.com', 'Officially licensed reprint promo of the iconic Pikachu Illustrator card.'),
('2023 Panini Prizm NBA Basketball Hobby Box', 'trading-cards', 'nba-cards', 379.99, 449.99, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop', 4.7, 892, 'Dave and Adams', 'https://dacardworld.com', '12 packs per box with 12 cards per pack. Chase rookie cards, autographs, and parallels.'),
('Victor Wembanyama Rookie Card Prizm Silver', 'trading-cards', 'nba-cards', 249.00, NULL, 'https://images.unsplash.com/photo-1518650860-4bfc21f4a58c?w=800&auto=format&fit=crop', 4.8, 341, 'eBay', 'https://ebay.com', 'Silver Prizm parallel rookie card of Victor Wembanyama.'),
('Panini NBA Hoops Blaster Pack (6 Packs)', 'trading-cards', 'nba-cards', 19.99, 24.99, 'https://images.unsplash.com/photo-1494178270175-e96de2971df9?w=800&auto=format&fit=crop', 4.3, 1231, 'Walmart', 'https://walmart.com', 'Affordable entry into NBA card collecting.'),
('LeBron James Autographed Rookie Card BGS 9.5', 'trading-cards', 'nba-cards', 4499.00, 5200.00, 'https://images.unsplash.com/photo-1552667466-07770ae110d0?w=800&auto=format&fit=crop', 5.0, 47, 'PWCC', 'https://pwccmarketplace.com', 'BGS 9.5 graded LeBron James autographed rookie card.'),
('2023 Panini Prizm NFL Football Hobby Box', 'trading-cards', 'nfl-cards', 599.99, 699.99, 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop', 4.6, 421, 'Steel City Collectibles', 'https://steelcitycollectibles.com', 'Premium hobby box containing autographs, Silver Prizms, and top rookie chase cards.'),
('Patrick Mahomes Rookie Card Optic Refractor', 'trading-cards', 'nfl-cards', 189.00, 220.00, 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&auto=format&fit=crop', 4.9, 178, 'eBay', 'https://ebay.com', 'Sharp centered Optic refractor rookie of Patrick Mahomes.'),
('NFL Retail Blaster Box - Score 2023', 'trading-cards', 'nfl-cards', 29.99, NULL, 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop', 4.2, 612, 'Target', 'https://target.com', 'Value retail box packed with 132 cards, rookies, and inserts.'),
('Ultra Pro Deck Sleeves 100ct Matte Black', 'trading-cards', 'card-accessories', 8.99, NULL, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop', 4.9, 8842, 'Amazon', 'https://amazon.com', 'Standard-size premium matte sleeves.'),
('BCW 3-Ring Trading Card Binder with 20 Pages', 'trading-cards', 'card-accessories', 24.95, 29.99, 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=800&auto=format&fit=crop', 4.7, 1421, 'BCW Supplies', 'https://bcwsupplies.com', 'Heavy-duty binder holding up to 360 cards.'),
('Ultra Pro Toploaders 3x4 Regular 25ct', 'trading-cards', 'card-accessories', 6.49, NULL, 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop', 4.8, 5321, 'Amazon', 'https://amazon.com', 'Rigid PVC toploaders for storing single cards.'),
('PSA Grading Submission Prep Kit', 'trading-cards', 'card-accessories', 19.99, 24.99, 'https://images.unsplash.com/photo-1595079676339-1534801b6740?w=800&auto=format&fit=crop', 4.6, 302, 'PSA', 'https://psacard.com', 'Includes semi-rigid card savers and packing supplies.'),
('Casio G-Shock GA-2100 CasiOak Men Watch', 'watches', 'mens-watches', 99.00, 130.00, 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800&auto=format&fit=crop', 4.8, 12452, 'Amazon', 'https://amazon.com', 'Slim octagonal G-Shock with 200m water resistance.'),
('Seiko 5 Sports SRPD Automatic Diver', 'watches', 'mens-watches', 189.99, 250.00, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop', 4.9, 3241, 'Jomashop', 'https://jomashop.com', '42mm automatic dive-style watch with 100m water resistance.'),
('Apple Watch Series 10 46mm GPS', 'watches', 'mens-watches', 399.00, 429.00, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop', 4.7, 8210, 'Apple', 'https://apple.com', 'Latest Apple Watch with a larger display and advanced health sensors.'),
('Tissot PRX Powermatic 80 Automatic', 'watches', 'mens-watches', 725.00, 795.00, 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&auto=format&fit=crop', 4.9, 1102, 'Tissot', 'https://tissotwatches.com', 'Integrated-bracelet 40mm automatic with an 80-hour power reserve.'),
('Rolex Submariner Date 41mm Pre-Owned', 'watches', 'mens-watches', 12500.00, 13800.00, 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&auto=format&fit=crop', 5.0, 89, 'Bobs Watches', 'https://bobswatches.com', 'Authenticated pre-owned Rolex Submariner Date.'),
('Garmin Fenix 7 Solar GPS Multisport Smartwatch', 'watches', 'mens-watches', 599.99, 799.99, 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop', 4.8, 2140, 'REI', 'https://rei.com', 'Rugged solar-charging multisport GPS watch with mapping.'),
('Michael Kors Runway Rose Gold Watch', 'watches', 'womens-watches', 189.00, 275.00, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&auto=format&fit=crop', 4.6, 4210, 'Macys', 'https://macys.com', '38mm rose-gold-tone stainless steel bracelet watch.'),
('Daniel Wellington Petite Melrose 32mm', 'watches', 'womens-watches', 149.00, 199.00, 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=800&auto=format&fit=crop', 4.5, 2130, 'Daniel Wellington', 'https://danielwellington.com', 'Minimalist 32mm mesh-bracelet watch.'),
('Apple Watch Series 10 42mm Aluminum', 'watches', 'womens-watches', 379.00, 399.00, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop', 4.7, 5502, 'Best Buy', 'https://bestbuy.com', 'Smaller 42mm Apple Watch Series 10 with GPS.'),
('Fossil Carlie Mini Three-Hand Watch', 'watches', 'womens-watches', 95.00, 135.00, 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800&auto=format&fit=crop', 4.4, 1841, 'Fossil', 'https://fossil.com', '28mm rose-gold-tone dress watch with a slim mesh bracelet.'),
('Barton Quick-Release Silicone Watch Band 20mm', 'watches', 'watch-accessories', 14.99, 19.99, 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&auto=format&fit=crop', 4.7, 21300, 'Amazon', 'https://amazon.com', 'Waterproof soft-silicone quick-release band.'),
('Wolf Cub Single Watch Winder Black', 'watches', 'watch-accessories', 249.00, 299.00, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop', 4.8, 512, 'Wolf', 'https://wolf1834.com', 'Silent single-watch winder with programmable rotation modes.'),
('Pelican Vault V200 Watch Travel Case', 'watches', 'watch-accessories', 79.99, NULL, 'https://images.unsplash.com/photo-1533603208986-24fd819e196f?w=800&auto=format&fit=crop', 4.6, 342, 'B and H', 'https://bhphotovideo.com', 'Crush-proof travel case with foam insert holding up to 4 watches.'),
('14K Gold Cuban Link Bangle Bracelet', 'jewelry', 'bangles-bracelets', 349.00, 499.00, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop', 4.8, 421, 'Zales', 'https://zales.com', 'Solid 14K gold Cuban link bangle with box clasp.'),
('Pandora Moments Sterling Silver Charm Bracelet', 'jewelry', 'bangles-bracelets', 89.00, 110.00, 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&auto=format&fit=crop', 4.9, 8140, 'Pandora', 'https://pandora.net', 'Iconic sterling-silver charm bracelet.'),
('Set of 6 Indian Bangles Rose Gold Kada', 'jewelry', 'bangles-bracelets', 34.99, 49.99, 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&auto=format&fit=crop', 4.5, 612, 'Etsy', 'https://etsy.com', 'Traditional set of 6 rose-gold bangles with CZ detailing.'),
('Tiffany T Smile Diamond Pendant Necklace', 'jewelry', 'necklaces', 1450.00, NULL, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&auto=format&fit=crop', 5.0, 132, 'Tiffany and Co', 'https://tiffany.com', 'Iconic Tiffany T Smile pendant in 18K rose gold with diamonds.'),
('Sterling Silver Layered Chain Necklace Set', 'jewelry', 'necklaces', 29.99, 45.00, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop', 4.4, 3421, 'Amazon', 'https://amazon.com', 'Trendy 3-piece layered necklace set in sterling silver.'),
('Mejuri Croissant Dome Ring 14K Gold Vermeil', 'jewelry', 'rings', 75.00, NULL, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop', 4.8, 1210, 'Mejuri', 'https://mejuri.com', 'Bold sculptural dome ring in 14K gold vermeil.'),
('1-Carat Round Diamond Solitaire Engagement Ring', 'jewelry', 'rings', 3450.00, 4200.00, 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&auto=format&fit=crop', 4.9, 214, 'Blue Nile', 'https://bluenile.com', 'GIA-certified 1ct round brilliant diamond solitaire.'),
('Kendra Scott Elisa Pendant Necklace', 'jewelry', 'necklaces', 65.00, 80.00, 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&auto=format&fit=crop', 4.7, 4210, 'Kendra Scott', 'https://kendrascott.com', 'Signature drop pendant necklace.'),
('Diamond Studs 0.5ct 14K White Gold', 'jewelry', 'earrings', 599.00, 799.00, 'https://images.unsplash.com/photo-1535632066274-36f5c799afaf?w=800&auto=format&fit=crop', 4.8, 1521, 'James Allen', 'https://jamesallen.com', 'Classic diamond stud earrings, 0.5ct total weight.'),
('Gold Hoop Earrings 1-inch 14K', 'jewelry', 'earrings', 129.00, 179.00, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop', 4.7, 3120, 'Macys', 'https://macys.com', 'Timeless 14K gold click-top hoop earrings.'),
('Coach Willow Tote 24 in Signature Canvas', 'bags', 'handbags', 395.00, 550.00, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop', 4.8, 921, 'Coach', 'https://coach.com', 'Structured mid-size tote in signature canvas with leather trim.'),
('Michael Kors Jet Set Large Crossbody', 'bags', 'handbags', 149.00, 298.00, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop', 4.7, 5420, 'Michael Kors', 'https://michaelkors.com', 'Saffiano-leather crossbody bag with multiple compartments.'),
('Longchamp Le Pliage Original Tote', 'bags', 'handbags', 145.00, 165.00, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop', 4.9, 8214, 'Longchamp', 'https://longchamp.com', 'Iconic foldable nylon tote with leather handles.'),
('Osprey Atmos AG 65 Backpack', 'bags', 'backpacks', 289.95, 340.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', 4.9, 1841, 'REI', 'https://rei.com', 'Award-winning multi-day backpacking pack with Anti-Gravity suspension.'),
('Herschel Little America Backpack 25L', 'bags', 'backpacks', 109.99, 129.99, 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop', 4.7, 6421, 'Herschel', 'https://herschel.com', 'Signature mountaineering-inspired daypack with padded laptop sleeve.'),
('Peak Design Everyday Backpack V2 20L', 'bags', 'backpacks', 279.95, NULL, 'https://images.unsplash.com/photo-1585916420730-d7f95e942d43?w=800&auto=format&fit=crop', 4.9, 2140, 'Peak Design', 'https://peakdesign.com', 'Premium 20L everyday camera backpack.'),
('Patagonia Black Hole 55L Duffel', 'bags', 'travel-bags', 159.00, 179.00, 'https://images.unsplash.com/photo-1585916420730-d7f95e942d43?w=800&auto=format&fit=crop', 4.9, 3120, 'Patagonia', 'https://patagonia.com', 'Weather-resistant 55L travel duffel with removable backpack straps.'),
('Away The Bigger Carry-On Luggage', 'bags', 'travel-bags', 295.00, NULL, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop', 4.7, 4210, 'Away', 'https://awaytravel.com', 'Polycarbonate hard-shell carry-on with 360 degree wheels.'),
('Bellroy Slim Sleeve Wallet Leather', 'bags', 'wallets', 89.00, 99.00, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop', 4.8, 6842, 'Bellroy', 'https://bellroy.com', 'Ultra-slim front-pocket leather wallet.'),
('Ridge Wallet Aluminum Cardholder', 'bags', 'wallets', 105.00, 125.00, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop', 4.7, 12420, 'The Ridge', 'https://ridge.com', 'RFID-blocking aluminum minimalist wallet.'),
('MSR Hubba Hubba NX 2-Person Backpacking Tent', 'outdoor-fitness', 'camping-hiking', 449.95, 549.95, 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop', 4.8, 1421, 'REI', 'https://rei.com', 'Award-winning ultralight freestanding 2-person tent.'),
('YETI Rambler 20oz Tumbler Stainless Steel', 'outdoor-fitness', 'camping-hiking', 35.00, 40.00, 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop', 4.9, 32120, 'YETI', 'https://yeti.com', 'Double-wall vacuum insulated 20oz stainless steel tumbler.'),
('Black Diamond Spot 400 Headlamp', 'outdoor-fitness', 'camping-hiking', 49.95, NULL, 'https://images.unsplash.com/photo-1516981879613-9f5da904015f?w=800&auto=format&fit=crop', 4.7, 2841, 'Black Diamond', 'https://blackdiamondequipment.com', '400-lumen waterproof headlamp with PowerTap technology.'),
('Bowflex SelectTech 552 Adjustable Dumbbells', 'outdoor-fitness', 'fitness-equipment', 429.00, 549.00, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&auto=format&fit=crop', 4.8, 21420, 'Bowflex', 'https://bowflex.com', 'Pair of adjustable dumbbells 5 to 52.5 lbs per dumbbell.'),
('Manduka PRO Yoga Mat 6mm', 'outdoor-fitness', 'fitness-equipment', 138.00, NULL, 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=800&auto=format&fit=crop', 4.9, 8214, 'Manduka', 'https://manduka.com', 'Legendary lifetime-warranty yoga mat.'),
('TRX All-In-One Suspension Training System', 'outdoor-fitness', 'fitness-equipment', 199.95, 229.95, 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop', 4.8, 4210, 'TRX', 'https://trxtraining.com', 'Complete bodyweight suspension trainer.'),
('WHOOP 4.0 Fitness Tracker Band', 'outdoor-fitness', 'fitness-equipment', 239.00, 299.00, 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop', 4.6, 3120, 'WHOOP', 'https://whoop.com', 'Screenless wearable tracking recovery, sleep, and strain 24/7.'),
('Trek FX 2 Disc Hybrid Bike', 'outdoor-fitness', 'cycling', 849.99, 949.99, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop', 4.7, 621, 'Trek Bikes', 'https://trekbikes.com', 'Fast, lightweight hybrid bike with hydraulic disc brakes.'),
('Bell Stratus MIPS Cycling Helmet', 'outdoor-fitness', 'cycling', 89.99, 120.00, 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800&auto=format&fit=crop', 4.7, 3421, 'Competitive Cyclist', 'https://competitivecyclist.com', 'Well-ventilated road cycling helmet with MIPS protection.'),
('Garmin Edge 540 GPS Cycling Computer', 'outdoor-fitness', 'cycling', 349.99, 399.99, 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&auto=format&fit=crop', 4.8, 812, 'Garmin', 'https://garmin.com', 'Advanced GPS cycling computer with mapping and training metrics.'),
('Spikeball Pro Kit Tournament Edition', 'outdoor-fitness', 'sports-recreation', 89.99, 99.99, 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop', 4.8, 6420, 'Amazon', 'https://amazon.com', 'Official tournament Spikeball kit.'),
('Wilson NCAA Official Basketball', 'outdoor-fitness', 'sports-recreation', 59.95, 74.95, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&auto=format&fit=crop', 4.7, 4210, 'Dicks Sporting Goods', 'https://dickssportinggoods.com', 'Official NCAA game ball.');
