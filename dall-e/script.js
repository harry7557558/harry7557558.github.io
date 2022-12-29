const OBJECTS = [
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/993723030071148614/craiyon_234008_Cat_eat_cephalopod_nbsp_.jpg.png",
        "date": "07/04/2022",
        "text": "Cat eat cephalopod",
        "comment": "As a joke with my mom, this is my first input to the DALL-E model."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998671475148083260/craiyon_151723_conch__website_logo.png",
        "date": "07/18/2022",
        "text": "conch, website logo",
        "comment": "Looking for inspiration for a nicer logo for my website."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998671474766389358/craiyon_151855_conch__app_icon.png",
        "date": "07/18/2022",
        "text": "conch, app icon",
        "comment": "Someone showed me that this AI is good at generating APP icons."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998763843872358511/craiyon_152017_conch_pfp.png",
        "date": "07/18/2022",
        "text": "conch pfp",
        "comment": "Inspired by my new [url=https://www.shadertoy.com/view/Nt2yW3]profile photo[/url]. Try to see whether this AI is more creative than me. 👀"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998672422838476901/craiyon_152520_hermit_crab__app_icon.png",
        "date": "07/18/2022",
        "text": "hermit crab, app icon",
        "comment": "Try more APP icon prompts after discovering that this AI is good at generating them."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998673860847206471/craiyon_153306_nautilus__app_icon.png",
        "date": "07/18/2022",
        "text": "nautilus, app icon",
        "comment": "I have been fascinated with the spiral shells of mollusks, especially symmetrical and mathematical nautilus shells. I'm quite satisfied with these results. I may consider the middle-right one as a composition for my new website logo."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998749393048043520/craiyon_203313_natural_scenery_from_Xinjiang__China.png",
        "date": "07/18/2022",
        "text": "natural scenery from Xinjiang, China",
        "comment": "My dad gave this prompt. He's a fan of natural landscapes in China. I was impressed by these photorealistic results."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998763844262441080/craiyon_211935_a_cloud_floating_under_the_sea_with_a_red_fish_on_it__photorealistic_style.png",
        "date": "07/18/2022",
        "text": "a cloud floating under the sea with a red fish on it, photorealistic style",
        "comment": "I tried to use this example to convince my dad that the model does not search the web for images but generated them."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998763408126136390/craiyon_212734_Elsa_fighting_Te_Ka_from_Moana.png",
        "date": "07/18/2022",
        "text": "Elsa fighting Te Ka from Moana",
        "comment": "[i]Frozen[/i] and [i]Moana[/i] are two of my favorite Disney movies. I don't see lava or Moana, but I wonder whether the AI memorized all frames from the movie with faces uglified?"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/999524570652483604/craiyon_235312_a_still_display_of_the_skeleton_of_a_cephalopod.png",
        "date": "07/20/2022",
        "text": "a still display of the skeleton of a cephalopod",
        "comment": "The skeletons of mollusks with tentacles are scary."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000495179905630319/craiyon_160837_protests_outside_SparkNotes_office_after_Shakespeare_translation_become_paywalled.png",
        "date": "07/23/2022",
        "text": "protests outside SparkNotes office after Shakespeare translation become paywalled",
        "comment": "Based protest."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000499665910898810/craiyon_162548_a_marble_with_a_spiral_on_it.png",
        "date": "07/23/2022",
        "text": "a marble with a spiral on it",
        "comment": "I have created numerous marbles using CGI, where two Shadertoy examples are [url=https://www.shadertoy.com/view/fdVfW1]this[/url] and [url=https://www.shadertoy.com/view/NscXRj]this[/url]. The marbles here are not as shiny but look more realistic."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000499666233851955/craiyon_162718_a_marble_with_a_Discord_logo_on_it.png",
        "date": "07/23/2022",
        "text": "a marble with a Discord logo on it",
        "comment": "I was thinking about marble balls, but I don't hate marble rocks."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000500430918393956/craiyon_163119_a_palace_made_of_ice_with_fire_beneath_it__photorealistic_style.png",
        "date": "07/23/2022",
        "text": "a palace made of ice with fire beneath it, photorealistic style",
        "comment": "Although there isn't fire, I'm still stunned by these compositions, especially the top right and the bottom right ones."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000820863857344592/craiyon_134418_A_flame_ball_in_the_shape_of_the_Stanford_Bunny.png",
        "date": "07/24/2022",
        "text": "A flame ball in the shape of the Stanford Bunny",
        "comment": "This deviates from what was in my mind, but it's cool to see fire and bunny together on a stadium."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000825247957786624/craiyon_140159_a_beetle_trapped_inside_transparent_glass.png",
        "date": "07/24/2022",
        "text": "a beetle trapped inside transparent glass",
        "comment": "Insects and plants embedded inside transparent resin is also my fascination."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000856518989729892/craiyon_160540_icy_force__award_winning_photography.png",
        "date": "07/24/2022",
        "text": "icy force, award-winning photography",
        "comment": "I was thinking about glaciers. But these images do like award-winning photos I saw on art/photography sites. With water prints."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000863650803896320/craiyon_163432_photorealistic_rendering_of_an_underwater_palace_of_mermaids.png",
        "date": "07/24/2022",
        "text": "photorealistic rendering of an underwater palace of mermaids",
        "comment": "\"Would you rather be able to fly, or have the ability to live in water?\""
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000864899402043412/craiyon_163915_fantasy_eye__a_universe_within.png",
        "date": "07/24/2022",
        "text": "fantasy eye, a universe within",
        "comment": "I was inspired by the [url=https://harry7557558.github.io/Graphics/UI/Homework/AVI3M/index.html]eye drawing project[/url] in my grade 11 visual art class."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000906429345054730/craiyon_192231_butterflies_surround_a_broken_glass_cup_with_miniature_blooms_inside_it.png",
        "date": "07/24/2022",
        "text": "butterflies surround a broken glass cup with miniature blooms inside it",
        "comment": "Based on an overused idea from my junior high school art teacher."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1001848900233211914/craiyon_094914_a_miniature_house_with_warm_light_coming_from_its_windows__on_the_back_of_a_snail.png",
        "date": "07/27/2022",
        "text": "a miniature house with warm light coming from its windows, on the back of a snail",
        "comment": "I wanted it to create a snail with a house on its back. This is what I get after rephrasing my prompt several times."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1001849652716503101/craiyon_095229_a_snail_made_of_blue__curly_orchid.png",
        "date": "07/27/2022",
        "text": "a snail made of blue, curly orchid",
        "comment": "I did not expect a dark background, although it doesn't look bad."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1001850555544654026/craiyon_095555_an_underwater_coral_realm__in_the_style_of_Monet.png",
        "date": "07/27/2022",
        "text": "an underwater coral realm, in the style of Monet",
        "comment": "Being stylish looks nicer than being realistic."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1001851647175168000/craiyon_100022_an_underwater_coral_realm__Chinese_traditional_painting.png",
        "date": "07/27/2022",
        "text": "an underwater coral realm, Chinese traditional painting",
        "comment": "I had been learning Chinese traditional painting for years in my childhood. But to be honest, I have forgotten most of it."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1001889186120478821/craiyon_122937_the_call_of_the_vast__award_winning_photography.png",
        "date": "07/27/2022",
        "text": "the call of the vast, award-winning photography",
        "comment": "Another award-winning photograph series."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002039270627872839/craiyon_222525_glassware_on_a_table_with_sophisticated_refractive_caustics.png",
        "date": "07/27/2022",
        "text": "glassware on a table with sophisticated refractive caustics",
        "comment": "Refractive caustics are sophisticating yet challenging to render. But... Where are they?"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002041927740440606/craiyon_223505_a_photograph_of_an_origami_crane_floating_on_water__surrounded_by_lily_leaves.png",
        "date": "07/27/2022",
        "text": "a photograph of an origami crane floating on water, surrounded by lily leaves",
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002249042455183501/craiyon_121928_a_dragonfly_with_alternating_cyan__magenta__and_yellow_stripes_on_its_body.png",
        "date": "07/28/2022",
        "text": "a dragonfly with alternating cyan, magenta, and yellow stripes on its body",
        "comment": "I discovered that vibrant CMY color scheme looks cool not so long ago, and I just found a dead dragonfly that morning. DALL-E disappoints me slightly."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002405129095479376/craiyon_223939_a_running_figure_made_of_liquid_water_with_splash_behind.png",
        "date": "07/28/2022",
        "text": "a running figure made of liquid water with splash behind",
        "comment": "I was thinking about a liquid running figure with beautiful body flow created with fluid simulation."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002405995659677737/craiyon_224321_beautiful_and_colorful_microscopic_photography_of_plant_cells.png",
        "date": "07/28/2022",
        "text": "beautiful and colorful microscopic photography of plant cells",
        "comment": "Reminds me of my childhood memory of placing almost everything under a microscope. I [i]did[/i] get some images that are more satisfying than these."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002406965588262993/craiyon_224713_a_tearful_burning_candle_in_front_of_a_skull_made_of_blue_ice.png",
        "date": "07/28/2022",
        "text": "a tearful burning candle in front of a skull made of blue ice",
        "comment": "When will I be able to write my own code to simulate candle tears?"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002410470239653988/craiyon_230106_a_fairy_studying_computer_graphics_in_its_miniature_fantasy_flower_garden.png",
        "date": "07/28/2022",
        "text": "a fairy studying computer graphics in its miniature fantasy flower garden",
        "comment": "You see vivid colors at your first glance. But once you stare at it, you encounter the faces of monsters."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002657677014483034/craiyon_132827_abstract_colored_geometry_inside_a_crystal_cube.png",
        "date": "07/29/2022",
        "text": "abstract colored geometry inside a crystal cube"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002660013942259896/craiyon_153222_several_colored_glass_pieces__in_the_shape_of_gem_crystals.png",
        "date": "07/29/2022",
        "text": "several colored glass pieces, in the shape of gem crystals",
        "comment": "I didn't expect this many pieces in a picture. I like the bottom left one most."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002661797666496602/craiyon_153945_fish_and_mollusk_artworks_made_from_colored_glass.png",
        "date": "07/29/2022",
        "text": "fish and mollusk artworks made from colored glass",
        "comment": "Not what I'm looking for, but they look artistic."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1002662405907685476/craiyon_154211_colored_miniature_fishes_and_mollusks__glass_blowing_artwork.png",
        "date": "07/29/2022",
        "text": "colored miniature fishes and mollusks, glass-blowing artwork",
        "comment": "This is what was in my mind, although I think there are too many items in a picture, making them look less nice than the previous one."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003075821361180752/craiyon_190448_scientific_illustration_of_a_creature_with_fish_body_and_bird_beak.png",
        "date": "07/30/2022",
        "text": "scientific illustration of a creature with fish body and bird beak",
        "comment": "Inspired by [url=https://www.thisiscolossal.com/2022/07/beto-val-surreal-illustrations/]this[/url]."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003077379754823760/craiyon_190837_a_boy_walking_with_his_dog__in_the_path_of_an_underwater_coral_forest.png",
        "date": "07/30/2022",
        "text": "a boy walking with his dog, in the path of an underwater coral forest",
        "comment": "Based on the dog my mom's friend left for me before leaving for a trip. Keeping such an active creature is uneasy."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003078327092916244/craiyon_191457_the_giant_sea_monster__indigenous_painting.png",
        "date": "07/30/2022",
        "text": "the giant sea monster, indigenous painting",
        "comment": "Indigenous art is cool, even for sea monsters. Not based but this reminds me of me drawing a sea monster for an assignment in grade 9 art class."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003083637664776242/craiyon_193602_the_giant_sea_monster__from_a_CGI_movie.png",
        "date": "07/30/2022",
        "text": "the giant sea monster, from a CGI movie",
        "comment": "Try to see what photorealistic giant sea monsters look like. A bit scary, aren't they?"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003340064945872917/craiyon_123425_a_seashell_on_a_beach__in_the_style_of_Pixar.png",
        "date": "07/31/2022",
        "text": "a seashell on a beach, in the style of Pixar",
        "comment": "I can't tell whether these are bivalves or gastropods 🤡"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003342145832358009/craiyon_124143_a_specie_under_the_class_Cypraeidae_in_its_natural_habitat.png",
        "date": "07/31/2022",
        "text": "a specie under the class Cypraeidae in its natural habitat",
        "comment": "I expected some variety like the images on [url=https://blueanimalbio-mirror.github.io/ruantidongwu/baobei.htm]this page[/url]. But it's nice to see that AI has knowledge of taxonomy, and it gives the correct result even though Cypraeidae is a family, not a class."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003343780033867796/craiyon_124905_a_specie_under_the_family_Cypraeidae_in_a_coral_reef.png",
        "date": "07/31/2022",
        "text": "a specie under the family Cypraeidae in a coral reef",
        "comment": "Rephrase my previous query. It's funny to see species made of 90% fish and 10% gastropod."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003344995257958410/craiyon_125243_beautiful_sea_slugs.png",
        "date": "07/31/2022",
        "text": "beautiful sea slugs",
        "comment": "Despite the query being simple, the results are satisfying. Not as varied as [url=https://www.google.com/search?q=beautiful+sea+slugs&tbm=isch]results on Google Images[/url] but still as beautiful with a rich background."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003379661952266310/craiyon_151016_artwork_made_of_rainbow_colored_leaves.png",
        "date": "07/31/2022",
        "text": "artwork made of rainbow-colored leaves",
        "comment": "Return from the sea and try some land stuff. These [i]are[/i] what I'm looking for, although the stems look a bit weird."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003381256144289833/craiyon_151808_a_flying_bird__with_its_tail_and_wings_made_of_leaves.png",
        "date": "07/31/2022",
        "text": "a flying bird, with its tail and wings made of leaves",
        "comment": "I expected photorealistic ones, but the illustrations also look cool."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003384284717002783/craiyon_153029_opalized_nautilus__necklace_pendant.png",
        "date": "07/31/2022",
        "text": "opalized nautilus, necklace pendant",
        "comment": "Back to the sea. I like how this AI can generate images that are more creative than what I found on Google Images."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003385738756366387/craiyon_153628_nautilus__colored_nbsp_glass_blowing_artwork.png",
        "date": "07/31/2022",
        "text": "nautilus, colored glass-blowing artwork",
        "comment": "More creative than Google Image. I like the color and the shadow/reflection on the white ground."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003692304852332594/craiyon_115421__nbsp_a_fantasy_glass_water_bottle_containing_planets_and_the_milky_way.png",
        "date": "08/01/2022",
        "text": "a fantasy glass water bottle containing planets and the milky way"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003693286210404352/craiyon_115831_a_sci_fi_character_unleashing_his_ice_power__freezing_the_ocean_and_the_planet.png",
        "date": "08/01/2022",
        "text": "a sci-fi character unleashing his ice power, freezing the ocean and the planet",
        "comment": "I often dreamed about what would happen and what I would do if I had freezing power."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003693943902449724/craiyon_120054_University_of_Toronto_Engineering_2T6_logo.png",
        "date": "08/01/2022",
        "text": "University of Toronto Engineering 2T6 logo",
        "comment": "Try this after seeing someone designing the 2T6 logo using DALL-E 2. It's nice to recognize the letter \"T\" and the purple color."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003696303412367431/craiyon_120816_a_color_wheel_inside_the_silhouette_of_a_girl_s_head.png",
        "date": "08/01/2022",
        "text": "a color wheel inside the silhouette of a girl's head",
        "comment": "A bit disappointing. I expected something like [url=https://saved-work.desmos.com/calc_thumbs/production/w4thzt4ofr.png]this[/url], which was inspired by a painting of my high school art teacher."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003698233937248396/craiyon_121803_beautiful_3D_fractal_made_of_ice.png",
        "date": "08/01/2022",
        "text": "beautiful 3D fractal made of ice"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1003699548167868456/craiyon_122203_fruit_in_the_shape_of_an_octahedron.png",
        "date": "08/01/2022",
        "text": "fruit in the shape of an octahedron",
        "comment": "I like how a vivid, detailed, seemly tasty fruit is based on a simple geometric primitive."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004088698415087656/craiyon_140830_beautiful_butterflies_resting_on_a_pile_of_poop.png",
        "date": "08/02/2022",
        "text": "beautiful butterflies resting on a pile of poop",
        "comment": "The contrast between beauty and feces isn't a rare sight on trails. Although the feces on trails don't have this regular shape."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004090540159139930/craiyon_141611_a_hermit_crab_inside_a_paper_boat_filled_with_sand__with_an_Nvidia_chip_in_its_claw.png",
        "date": "08/02/2022",
        "text": "a hermit crab inside a paper boat filled with sand, with an Nvidia chip in its claw",
        "comment": "I was thinking about [url=https://harry7557558.github.io/AVI4M-ISP/index.html]this[/url]. These images are more visually pleasing."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004094895050469436/craiyon_143424_an_octopus_holding_a_pencil_doing_calculus_on_paper.png",
        "date": "08/02/2022",
        "text": "an octopus holding a pencil doing calculus on paper"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004095834763300884/craiyon_143651_a_girl_looking_into_a_mirror__seeing_a_fairy_with_wings.png",
        "date": "08/02/2022",
        "text": "a girl looking into a mirror, seeing a fairy with wings",
        "comment": "Is the AI discouraging me from having all sorts of fantasy thoughts?"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004097604566655126/craiyon_144345_a_small_figure_standing_on_the_graph_of_gamma_function_on_the_complex_plane.png",
        "date": "08/02/2022",
        "text": "a small figure standing on the graph of gamma function on the complex plane",
        "comment": "An idea for CG. Combining human figures and iconic 3D mathematical figures."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004098751008354355/craiyon_144943_a_crescent_moon_made_of_water.png",
        "date": "08/02/2022",
        "text": "a crescent moon made of water"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004102005524017182/craiyon_150207_path_traced_Cornell_box_flooded_with_water__with_a_goldfish_inside_it.png",
        "date": "08/02/2022",
        "text": "path-traced Cornell box flooded with water, with a goldfish inside it",
        "comment": "How did you generate so realistic results with path tracing?"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004121677908688896/craiyon_162008_seashell_made_of_shiny_metal.png",
        "date": "08/02/2022",
        "text": "seashell made of shiny metal",
        "comment": "I have done some renderings similar to these. I can't find them right now."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004202488007766138/craiyon_214057_three_translucent_glass_spheres__respectively_red__green__and_blue.png",
        "date": "08/02/2022",
        "text": "three translucent glass spheres, respectively red, green, and blue",
        "comment": "I like the refractive appearance and the caustics cast on the floor."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004437549936283730/craiyon_131445_an_apple_melted_into_a_puddle.png",
        "date": "08/03/2022",
        "text": "an apple melted into a puddle",
        "comment": "The AI doesn't seem to understand what I'm thinking about. What was in my mind is something similar to [url=https://www.thisiscolossal.com/2022/02/yosuke-amemiya-apple-sculptures/]this[/url]."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004439742047338616/craiyon_132333_a_glass_blown_electrical_plug_with_vibrant_color.png",
        "date": "08/03/2022",
        "text": "a glass-blown electrical plug with vibrant color",
        "comment": "This is my attempt to enter an idea that avoids cliche after being reminded by my art teacher's slides."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004444031025160262/craiyon_133827_an_old_clock_with_numbers_arranged_in_a_Fibonacci_spiral.png",
        "date": "08/03/2022",
        "text": "an old clock with numbers arranged in a Fibonacci spiral",
        "comment": "I was thinking about something like what I found on [url=https://www.google.com/search?q=infinite+time+spiral+clock&tbm=isch]Google Image[/url] but in a classic style. This is the best I got after rephrasing multiple times."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004448577612959814/craiyon_135935_a_glass_ball_with_the_reflection_of_the_Eiffel_tower_within.png",
        "date": "08/03/2022",
        "text": "a glass ball with the reflection of the Eiffel tower within"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004451049718947910/craiyon_140401_a_depressed_girl_sitting_against_a_closed_door_with_her_face_covered_by_hair.png",
        "date": "08/03/2022",
        "text": "a depressed girl sitting against a closed door with her face covered by hair",
        "comment": "I was thinking about the movie [i]Frozen[/i], how Elsa and Anna sat against the door after their parent's funeral. In these images, I like how depression is revealed through the dark cyan color."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004570965914701884/craiyon_220435_jellyfishes_flying_over_the_clouds__hyperrealistic_photography_composition.png",
        "date": "08/03/2022",
        "text": "jellyfishes flying over the clouds, hyperrealistic photography composition",
        "comment": "I just noticed that Craiyon added videos on how to generate better images. Adding \"hyperrealistic...\" makes the images much more stunning."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004574285899247778/craiyon_221744_barnacles_growing_on_a_cellphone__still_life_photography.png",
        "date": "08/03/2022",
        "text": "barnacles growing on a cellphone, still life photography",
        "comment": "I could barely see cell phones, but I appreciate these realistic \"photographs\". I always thought these \"horse teeth\" are some mollusks until I saw them under crustaceans when looking at a website that introduces biodiversity."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004578785179488318/craiyon_223527_fantasy_eye__an_ocean_within__hyperrealistic_digital_art.png",
        "date": "08/03/2022",
        "text": "fantasy eye, an ocean within, hyperrealistic digital art",
        "comment": "Pretty impressive clearness with 256×256. Although I expected to see some sea creatures"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004580700449685524/craiyon_224446_a_seahorse_surrounded_by_blossom__watercolor.png",
        "date": "08/03/2022",
        "text": "a seahorse surrounded by blossom, watercolor"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004828236120854758/craiyon_150718_3D_quadratic_form__black_pencil_drawing.png",
        "date": "08/04/2022",
        "text": "3D quadratic form, black pencil drawing",
        "comment": "I was thinking about stuff like a hyperbolic paraboloid with axes."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1004829500967759943/craiyon_151206_a_nautilus_made_of_ice_cream__food_photography.png",
        "date": "08/04/2022",
        "text": "a nautilus made of ice cream, food photography",
        "comment": "Impressive. I would be too reluctant to eat them."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1005158485488566302/craiyon_130023_nautilus__abstract_geometric_sculpture.png",
        "date": "08/05/2022",
        "text": "nautilus, abstract geometric sculpture"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1005511955324354570/craiyon_122459_a_pile_of_rocks_arranged_in_a_sophisticated_nbsp_spiral__dark_room_photography.png",
        "date": "08/06/2022",
        "text": "a pile of rocks arranged in a sophisticated spiral, dark room photography",
        "comment": "Where are the spirals?"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1005514585828245707/craiyon_123305_opalized_calcareous_operculum_of_a_sea_gastropod__jewelry_photography.png",
        "date": "08/06/2022",
        "text": "opalized calcareous operculum of a sea gastropod, jewelry photography",
        "comment": "I have been wondering what these \"spiral rocks\" on beaches are until I saw them on the opening of turban conches in a seafood market."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1005516459180564612/craiyon_124238_a_girl_wearing_a_crown_decorated_with_seashells__19th_century_oil_painting.png",
        "date": "08/06/2022",
        "text": "a girl wearing a crown decorated with seashells, 19th-century oil painting",
        "comment": "I could barely recognize the details of the seashells, but they do look like paintings from the 19th century."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1005519545659834429/craiyon_125516_a_huge_conch_above_the_sea_with_complex_architecture_inside_its_opening__surrealistic.png",
        "date": "08/06/2022",
        "text": "a huge conch above the sea with complex architecture inside its opening, surrealistic oil painting"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1005519629457834034/craiyon_125548_a_huge_nautilus_shell_above_the_sea_with_complex_architecture_on_it__surrealistic_oil.png",
        "date": "08/06/2022",
        "text": "a huge nautilus shell above the sea with complex architecture on it, surrealistic oil painting"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1005521704598114367/craiyon_130235_a_pearl_oyster_bearing_human_embryos__surreal_oil_on_canvas.png",
        "date": "08/06/2022",
        "text": "a pearl oyster bearing human embryos, surreal oil on canvas",
        "comment": "This isn't what I was thinking of, but I like how I can recognize both the luster of pearls and the outline of human embryos."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1006640991832379512/craiyon_150952_an_angular_antique_bowl_with_aqua_and_yellow_horizontal_color_blocks_and_small_black_.png",
        "date": "08/09/2022",
        "text": "an angular antique bowl with aqua and yellow horizontal color blocks and small black squares",
        "comment": "Based on a dream I had last night that I rendered a path-traced bowl. These bowl pictures aren't exactly the same as what I dreamed of, very likely because of my poor verbal description."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1006998887434817606/craiyon_145345_nautilus__mascot_design.png",
        "date": "08/10/2022",
        "text": "nautilus, mascot design"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1008085642141507594/craiyon_145129_sea_cucumber__geometric_sculpture.png",
        "date": "08/13/2022",
        "text": "sea cucumber, geometric sculpture",
        "comment": "Looking for inspiration for CG."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1008504321199050802/craiyon_183508_an_orange_sea_cucumber_surrounded_by_purple_sea_urchins__underwater_photography.png",
        "date": "08/14/2022",
        "text": "an orange sea cucumber surrounded by purple sea urchins, underwater photography",
        "comment": "Inspired by a random Google image after finishing my [url=https://www.shadertoy.com/view/Nldczs]sea cucumber shader[/url]. Those colorful echinoderms."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1008506524030738453/craiyon_184207_a_cluster_of_starfishes_on_a_tree_branch__photography.png",
        "date": "08/14/2022",
        "text": "a cluster of starfishes on a tree branch, photography",
        "comment": "Try another echinoderm. It's interesting that the AI generates both on-land scenes and underwater scenes."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1008507706283401256/craiyon_184907_the_skeleton_of_radiolarian_made_from_chrome__jewelry_photography.png",
        "date": "08/14/2022",
        "text": "the skeleton of radiolarian made from chrome, jewelry photography",
        "comment": "Based on I saw someone else's radiolarians on Shadertoy, which looked cool."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009150087517184040/craiyon_132151_a_shiny_blue_steel_beetle_decorated_with_gems__jewelry_photography.png",
        "date": "08/16/2022",
        "text": "a shiny blue steel beetle decorated with gems, jewelry photography"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009162873785819206/craiyon_141217_a_beetle_with_zebra_patterns__close_up_photography.png",
        "date": "08/16/2022",
        "text": "a beetle with zebra patterns, close-up photography",
        "comment": "I like these natural-looking beetles with flowers and leaves."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009193240139931818/craiyon_161243_a_beetle_in_the_shape_of_a_5_pointed_star__close_up_photography.png",
        "date": "08/16/2022",
        "text": "a beetle in the shape of a 5-pointed star, close-up photography",
        "comment": "I don't see the star, but it's nice to see a variety of beetles and backgrounds."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009195573657743500/craiyon_162216_a_dung_beetle_rolling_a_moon_model_on_a_table__dark_room_photography.png",
        "date": "08/16/2022",
        "text": "a dung beetle rolling a moon model on a table, dark room photography",
        "comment": "I expected a full moon, but crescent moons are also nice."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009198153725137037/craiyon_163142_jellyfish__Hawaiian_traditional_painting.png",
        "date": "08/16/2022",
        "text": "jellyfish, Hawaiian traditional painting",
        "comment": "I like how these pictures are visually prettier than a traditional painting I could imagine."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009200564845957290/craiyon_163828_feminine_air_spirit__fantasy_digital_art.png",
        "date": "08/16/2022",
        "text": "feminine air spirit, fantasy digital art",
        "comment": "I was thinking about a flying half-human-half-air spirit, possibly in a diagonal composition. Despite being attractive, I'm told that I should not be a fan of a bunch of \"sexy\" figures with very similar compositions."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009202631442444348/craiyon_164842_octopuses_being_compressed_into_cubes_by_a_machine_on_an_industrial_production_line__.png",
        "date": "08/16/2022",
        "text": "octopuses being compressed into cubes by a machine on an industrial production line, surreal oil painting",
        "comment": "Not what I'm looking for but I like those creepy cephalopods."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009205392905093120/craiyon_170042_a_cartoon_like_brain_curiously_looking_at_its_surroundings_with_its_eyes.png",
        "date": "08/16/2022",
        "text": "a cartoon-like brain curiously looking at its surroundings with its eyes",
        "comment": "I keep this here because I like the idea."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009207001680728064/craiyon_170802_a_colorful_nautilus_figure_on_the_stained_glass_window_of_a_church__photography.png",
        "date": "08/16/2022",
        "text": "a colorful nautilus figure on the stained glass window of a church, photography"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009501349160960010/craiyon_123731_the_clouds__the_waves__and_the_tempest__abstract_color_marbling.png",
        "date": "08/17/2022",
        "text": "the clouds, the waves, and the tempest, abstract color marbling"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009501787990008001/craiyon_123924_the_clouds__the_waves__and_the_tempest__abstract_paint_splatter.png",
        "date": "08/17/2022",
        "text": "the clouds, the waves, and the tempest, abstract paint splatter"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009502228391936020/craiyon_124110_the_clouds__the_waves__and_the_tempest__abstract_cubism_painting.png",
        "date": "08/17/2022",
        "text": "the clouds, the waves, and the tempest, abstract cubism painting",
        "comment": "I tried to see if this AI can make abstract art. I'm quite satisfied with these ones."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009502843364970626/craiyon_124338_the_clouds__the_waves__and_the_tempest__hyperrealistic_oil_painting.png",
        "date": "08/17/2022",
        "text": "the clouds, the waves, and the tempest, hyperrealistic oil painting",
        "comment": "Try to see what a realistic tempest sea looks like after going through abstract art styles. I like the style of these images equally as I like the style of the cubism one."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009621294419021945/craiyon_203402_a_walking_man_with_his_head_replaced_by_a_nautilus_shell_and_the_shell_s_empty_openin.png",
        "date": "08/17/2022",
        "text": "a walking man with his head replaced by a nautilus shell and the shell's empty opening as his face, surreal painting"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1009622810882224128/craiyon_204017_a_car_in_the_form_of_a_nautilus_shell__surreal_3D_CAD_design.png",
        "date": "08/17/2022",
        "text": "a car in the form of a nautilus shell, surreal 3D CAD design"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1011719904866598995/craiyon_153242_nautilus__watermelon_sculpture.png",
        "date": "08/23/2022",
        "text": "nautilus, watermelon sculpture"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1011728438194884729/craiyon_154405_a_nautilus_with_an_orange_peel_shell_and_watermelon_skin_tentacles__fruit_sculpture.png",
        "date": "08/23/2022",
        "text": "a nautilus with an orange peel shell and watermelon skin tentacles, fruit sculpture",
        "comment": "A watermelon with orange pulp must be delicious!"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1011729592312148088/craiyon_161159_a_miniature_snowman_family_made_of_seashells.png",
        "date": "08/23/2022",
        "text": "a miniature snowman family made of seashells",
        "comment": "I can't tell what they are made of. Seashells? Snow? Ceramic? Or flour? But they look cute anyway."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1011731119865081856/craiyon_161503_a_miniature_fairy_house_made_from_a_chestnut__digital_painting.png",
        "date": "08/23/2022",
        "text": "a miniature fairy house made from a chestnut, digital painting",
        "comment": "Inspired by the chestnut trees in my living area with a lot of raw fruits."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1012047360475537560/craiyon_131430_a_snail_trapped_inside_a_glass_dome__depressed_tone__hyperrealistic_oil_painting.png",
        "date": "08/24/2022",
        "text": "a snail trapped inside a glass dome, depressed tone, hyperrealistic oil painting"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1012076785430708315/craiyon_151125_3D_geometric_sculpture_of_a_nautilus_with_curved__flowy_spikes.png",
        "date": "08/24/2022",
        "text": "3D geometric sculpture of a nautilus with curved, flowy spikes"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1013101509430476861/craiyon_110229_a_blue_frog_on_a_table_staring_at_a_miniature_green_marble_planet__still_photography.png",
        "date": "08/27/2022",
        "text": "a blue frog on a table staring at a miniature green marble planet, still photography",
        "comment": "I was thinking about the side view of a frog and a marble \"staring at each other.\""
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1013103208878571560/craiyon_110952_a_blue_frog_and_a_miniature_green_marble_planet_trapped_inside_a_dome__hyperrealistic.png",
        "date": "08/27/2022",
        "text": "a blue frog and a miniature green marble planet trapped inside a dome, hyperrealistic oil painting"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1026276727091101766/craiyon_193618_rendered_imagery_of_a_drone_with_five_propellers_arranged_on_a_pentagon_flying_over_t.png",
        "date": "10/02/2022",
        "text": "rendered imagery of a drone with five propellers arranged on a pentagon flying over the spectacular mountains",
        "comment": "Thoughts after joining the autonomous drone racing team at the University of Toronto"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1027371623138988063/craiyon_200722_A_half_molten_abstract_geometric_sculpture_made_of_shiny_metal_dripping_into_a_puddle.png",
        "date": "10/05/2022",
        "text": "A half molten abstract geometric sculpture made of shiny metal dripping into a puddle",
        "comment": "I was thinking about melting metal. I don't know why there's water."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1027775645553537054/craiyon_225305_colored_glass_blown_double_helix_artworks_on_display.png",
        "date": "10/06/2022",
        "text": "colored glass-blown double helix artworks on display"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1028888468396453918/craiyon_003425_a_five_tentacled_creature_floating_under_the_moonlight_on_the_surface_of_peaceful_wat.png",
        "date": "10/10/2022",
        "text": "a five-tentacled creature floating under the moonlight on the surface of peaceful water, digital drawing",
        "comment": "Late-night thoughts."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1036017478133886976/craiyon_164203_heart_shaped_translucent_jellyfish_glowing_under_dark_water__digital_drawing.png",
        "date": "10/29/2022",
        "text": "heart-shaped translucent jellyfish glowing under dark water, digital drawing",
        "comment": "I'm not too satisfied with the visual, but at least it understands what I was thinking about. 💙💚"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1036020566009839626/craiyon_165231_emojis_blew_from_colored_glass_displayed_on_a_table.png",
        "date": "10/29/2022",
        "text": "emojis blew from colored glass displayed on a table",
        "comment": "I like the depth of field and how they are arranged in a regular pattern. What was in my mind had more variety, they include nature and item emojis and not only the yellow circular faces."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1058286734091227247/craiyon_023211_bolts_and_nuts_arranged_into_sophisticated_geometry__photography.png",
        "date": "12/30/2022",
        "text": "bolts and nuts arranged into sophisticated geometry, photography",
        "comment": "First in two months."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1058288323849891880/craiyon_023846_finite_element_stress_analysis_of_a_spirula_shell_subject_to_water_pressure__3D_techn.png",
        "date": "12/30/2022",
        "text": "finite element stress analysis of a spirula shell subject to water pressure, 3D technical rendering",
        "comment": "I'm writing FEM analysis code in C++ from scratch during my winter break. Might be nice to see some cool visuals beforehand?"
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1058290653446017034/craiyon_024647_a_bolt_made_of_half_steel_and_half_jade_inverted_on_a_marble_table__still_life_photog.png",
        "date": "12/30/2022",
        "text": "a bolt made of half steel and half jade inverted on a marble table, still-life photography",
        "comment": "I was thinking about a bolt with the cap facing down and the steel and jade split in a diagonal. DALL-E captures the background and lighting in my imagination, but not the object."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1058294594040758342/craiyon_030333_icon_of_a_mobile_app_that_renders_3D_mathematical_functions_and_surfaces.png",
        "date": "12/30/2022",
        "text": "icon of a mobile app that renders 3D mathematical functions and surfaces",
        "comment": "Inspired by my [url=https://harry7557558.github.io/spirula/]3D implicit surface grapher[/url]. It's interesting to see 3D shapes pop out of screens."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1058295830286708787/craiyon_030630_________.png",
        "date": "12/30/2022",
        "text": "🐚🔮🌊💻",
        "comment": "It's impressive to see that DALL-E can generate meaningful images from emojis. I wonder if AIs understand emojis better than text since there are different ways to state something in the text but an emoji (especially an object one) only means something specific."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1058297507676958750/craiyon_031508________.png",
        "date": "12/30/2022",
        "text": "🌊🍃🍇⌛",
        "comment": "Trying to randomly put some emojis. It's impressive that the AI generates images that I couldn't imagine."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1058298863263424613/craiyon_031916__________.png",
        "date": "12/30/2022",
        "text": "❄️👁️🐚🔥",
        "comment": "This is probably the most satisfying set of images that DALL-E ever generated for me. I was impressed by how DALL-E generates images with spiral and polar symmetry and seamlessly combines fire and ice in an unexpected way."
    },
    {
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1058301150677446716/craiyon_032842_________.png",
        "date": "12/30/2022",
        "text": "🍒🐠🌉🔮",
        "comment": "I was intentionally imagining something this time. I thought about a suspension bridge inside a crystal ball with fish surrounding it. DALL-E was thinking about something else, but the result is still not disappointing."
    }
];

function clickPreview(event) {
    let container_full = document.getElementById("container-full");
    let container = event.target;
    while (!/^craiyon_/.test(container.id)) {
        container = container.parentElement;
        if (container.tagName.toLowerCase() == "body") {
            container_full.style.display = "none";
            document.body.style.overflow = null;
            if (document.location.hash != "")
                document.location.hash = null;
            return;
        }
    }
    let fulls = container_full.children;
    for (var i = 0; i < fulls.length; i++) {
        if (fulls[i].id == "close-button")
            continue;
        if (fulls[i].id == container.id.replace(/\-thumb$/, ''))
            fulls[i].style.display = null;
        else fulls[i].style.display = "none";
    }
    container_full.style.display = null;
    document.body.style.overflow = "hidden";
    if (document.location.hash != container.id)
        document.location.hash = container.id.replace(/-thumb$/, '');
}

function main(objects) {
    let container = document.getElementById("container");
    let container_full = document.getElementById("container-full");

    for (var oi = objects.length; oi--;) {
        var object = objects[oi];

        let title = object.filename;
        let original = object.original;
        title = original.split('/')[original.split('/').length - 1].replace(/\.png$/, '');
        let thumb = "thumbs/" + title + ".jpg";
        let full = "jpg/" + title + ".jpg";
        let date = object.date;
        let time = original.match(/_(\d{6})_/)[1];
        let text = object.text;

        var comment = object.comment;
        if (comment != undefined) {
            // from Shadertoy
            comment = comment.replace(/(\[url=)(.*?)(\])(.*?)(\[\/url\])/gi, '<a href="$2" class="regular" target="_blank">$4</a>');
            comment = comment.replace(/(\[url\])(.*?)(\[\/url\])/gi, '<a href="$2" class="regular" target="_blank">$2</a>');
            comment = comment.replace(/(\[b\])([.\s\S]*?)(\[\/b\])/gi, '<strong>$2</strong>');
            comment = comment.replace(/(\[i\])([.\s\S]*?)(\[\/i\])/gi, '<em>$2</em>');
            comment = comment.replace(/(\[u\])([.\s\S]*?)(\[\/u\])/gi, '<u>$2</u>');
            comment = comment.replace(/(\[ul\])([.\s\S]*?)(\[\/ul\])/gi, '<ul>$2</ul>');
            comment = comment.replace(/(\[li\])([.\s\S]*?)(\[\/li\])/gi, '<li>$2</li>');
            comment = comment.replace(/(\[code\])([.\s\S]*?)(\[\/code\])/gi, '<pre>$2</pre>');
            // comment = comment.repalce(/\r?\n/gi, '<br/>');
        }

        // full image
        {
            // container/image
            let div_img = document.createElement("div");
            div_img.className = "object-img";
            let img = document.createElement("img");
            img.className = "img-full";
            img.src = full;
            img.alt = title;
            img.textContent = "Loading...";
            img.loading = "lazy";
            {  // initial width/height before load
                let w0 = window.innerWidth, h0 = window.innerHeight;
                var h = 0, w = 0;
                if (w0 / h0 <= 5. / 6.) // mobile
                    w = 0.95 * w0, h = w / 0.82;
                else h = 0.95 * h0, w = h * 0.82;
                img.style.width = w + "px";
                img.style.height = h + "px";
            }
            img.onload = function (event) {
                event.target.style.width = null;
                event.target.style.height = null;
            };
            div_img.appendChild(img);
            // text
            let div_info = document.createElement("div");
            div_info.className = "object-info";
            let div_info_inner = document.createElement("div");
            div_info_inner.className = "object-info-inner";
            let div_date = document.createElement("div");
            div_date.className = "info-date";
            div_date.textContent = date + " " +
                (new Date(0, 0, 0, Number(time.substr(0, 2)), Number(time.substr(2, 2))))
                    .toLocaleTimeString('en-US', { timeStyle: 'short' });
            div_info_inner.appendChild(div_date);
            let div_text = document.createElement("div");
            div_text.className = "info-text";
            div_text.textContent = text;
            div_info_inner.appendChild(div_text);
            if (comment != undefined) {
                let div_comment = document.createElement("div");
                div_comment.className = "info-comment";
                div_comment.innerHTML = comment;
                div_info_inner.appendChild(div_comment);
            }
            div_info.appendChild(div_info_inner);
            // append
            let div = document.createElement("div");
            div.className = "object-full";
            div.id = title;
            div.style.display = "none";
            div.appendChild(div_img);
            div.appendChild(div_info);
            container_full.appendChild(div);
        }

        // thumbnail
        {
            let div = document.createElement("div");
            div.id = title + '-thumb';
            div.className = "object-thumb";
            div.addEventListener("click", clickPreview);
            let img = document.createElement("img");
            img.className = "img-thumb";
            img.loading = "lazy";
            img.src = thumb;
            img.alt = title;
            img.textContent = "Loading...";
            div.appendChild(img);
            let p_text = document.createElement("div");
            p_text.textContent = text;
            p_text.className = "prompt-text-thumb";
            div.appendChild(p_text);
            container.appendChild(div);
        }

        // break;
    }
    container.removeChild(document.getElementById("loading"));

    container_full.addEventListener("click", function (event) {
        if (event.target == container_full || /^craiyon_/.test(event.target.id)) {
            container_full.style.display = "none";
            document.body.style.overflow = null;
            if (document.location.hash != "")
                document.location.hash = null;
        }
    });
    // container.children[0].click();

    function updateHash(event) {
        var url = event.newURL;
        if (!/#/.test(url)) url += '#';
        var hash = url.substring(url.search('#') + 1);
        var object = document.getElementById(hash);
        if (object == null) object = container_full;
        clickPreview({ target: object });
    };
    window.onhashchange = updateHash;
    updateHash({ newURL: document.URL });

    document.getElementById("close-button").addEventListener("click", clickPreview);
    document.getElementById("updated-date").textContent = "Harry Chen - Updated " + objects[objects.length - 1].date;

}

(function () {
    main(OBJECTS);
})();