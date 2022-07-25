const OBJECTS = [
    {
        "filename": "craiyon_234008_Cat_eat_cephalopod_nbsp_.jpg",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/993723030071148614/craiyon_234008_Cat_eat_cephalopod_nbsp_.jpg.png",
        "date": "07/04/2022",
        "text": "Cat eat cephalopod",
        "comment": "As a joke with my mom, this is my first input to the DALL-E model."
    },
    {
        "filename": "craiyon_151723_conch__website_logo",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998671475148083260/craiyon_151723_conch__website_logo.png",
        "date": "07/18/2022",
        "text": "conch, website logo",
        "comment": "Looking for inspiration for a nicer logo for my website."
    },
    {
        "filename": "craiyon_151855_conch__app_icon",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998671474766389358/craiyon_151855_conch__app_icon.png",
        "date": "07/18/2022",
        "text": "conch, app icon",
        "comment": "Someone showed me that this AI is good at generating APP icons."
    },
    {
        "filename": "craiyon_152017_conch_pfp",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998763843872358511/craiyon_152017_conch_pfp.png",
        "date": "07/18/2022",
        "text": "conch pfp",
        "comment": "Inspired by my new [url=https://www.shadertoy.com/view/Nt2yW3]profile photo[/url]. Try to see whether this AI is more creative than me. 👀"
    },
    {
        "filename": "craiyon_152520_hermit_crab__app_icon",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998672422838476901/craiyon_152520_hermit_crab__app_icon.png",
        "date": "07/18/2022",
        "text": "hermit crab, app icon",
        "comment": "Try more APP icon prompts after discovering that this AI is good at generating them."
    },
    {
        "filename": "craiyon_153306_nautilus__app_icon",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998673860847206471/craiyon_153306_nautilus__app_icon.png",
        "date": "07/18/2022",
        "text": "nautilus, app icon",
        "comment": "I have beem fanscinated with the spiral shells of mollusks, especially symmetrical and mathematical nautilus shells. I'm quite satisfied with these results. I may consider the middle-right one as a composition for my new website logo."
    },
    {
        "filename": "craiyon_203313_natural_scenery_from_Xinjiang__China",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998749393048043520/craiyon_203313_natural_scenery_from_Xinjiang__China.png",
        "date": "07/18/2022",
        "text": "natural scenery from Xinjiang, China",
        "comment": "My dad gave this prompt. He's a fan of natural landscapes in China. I was impressed by these photorealistic results."
    },
    {
        "filename": "craiyon_211935_a_cloud_floating_under_the_sea_with_a_red_fish_on_it__photorealistic_style",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998763844262441080/craiyon_211935_a_cloud_floating_under_the_sea_with_a_red_fish_on_it__photorealistic_style.png",
        "date": "07/18/2022",
        "text": "a cloud floating under the sea with a red fish on it, photorealistic style",
        "comment": "I tried to use this example to convince my dad that the model does not search the web for images but generated them."
    },
    {
        "filename": "craiyon_212734_Elsa_fighting_Te_Ka_from_Moana",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/998763408126136390/craiyon_212734_Elsa_fighting_Te_Ka_from_Moana.png",
        "date": "07/18/2022",
        "text": "Elsa fighting Te Ka from Moana",
        "comment": "[i]Frozen[/i] and [i]Moana[/i] are two of my favorite Disney movies. I don't see lava or Moana, but I worder whether the AI memorized all frames from the movie with faces uglified?"
    },
    {
        "filename": "craiyon_235312_a_still_display_of_the_skeleton_of_a_cephalopod",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/999524570652483604/craiyon_235312_a_still_display_of_the_skeleton_of_a_cephalopod.png",
        "date": "07/20/2022",
        "text": "a still display of the skeleton of a cephalopod",
        "comment": "The skeleton of mollusks with tentacles are scary."
    },
    {
        "filename": "craiyon_160837_protests_outside_SparkNotes_office_after_Shakespeare_translation_become_paywalled",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000495179905630319/craiyon_160837_protests_outside_SparkNotes_office_after_Shakespeare_translation_become_paywalled.png",
        "date": "07/23/2022",
        "text": "protests outside SparkNotes office after Shakespeare translation become paywalled",
        "comment": "Based protest."
    },
    {
        "filename": "craiyon_162548_a_marble_with_a_spiral_on_it",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000499665910898810/craiyon_162548_a_marble_with_a_spiral_on_it.png",
        "date": "07/23/2022",
        "text": "a marble with a spiral on it",
        "comment": "I have created numerous marbles using CGI, where two Shadertoy examples are [url=https://www.shadertoy.com/view/fdVfW1]this[/url] and [url=https://www.shadertoy.com/view/NscXRj]this[/url]. The marbles here are not as shiny but look more realistic."
    },
    {
        "filename": "craiyon_162718_a_marble_with_a_Discord_logo_on_it",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000499666233851955/craiyon_162718_a_marble_with_a_Discord_logo_on_it.png",
        "date": "07/23/2022",
        "text": "a marble with a Discord logo on it",
        "comment": "I was thinking about marble balls, but I don't hate marble rocks."
    },
    {
        "filename": "craiyon_163119_a_palace_made_of_ice_with_fire_beneath_it__photorealistic_style",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000500430918393956/craiyon_163119_a_palace_made_of_ice_with_fire_beneath_it__photorealistic_style.png",
        "date": "07/23/2022",
        "text": "a palace made of ice with fire beneath it, photorealistic style",
        "comment": "Although there isn't fire, I'm still stunned by these compositions, especially the top right and the bottom right ones."
    },
    {
        "filename": "craiyon_134418_A_flame_ball_in_the_shape_of_the_Stanford_Bunny",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000820863857344592/craiyon_134418_A_flame_ball_in_the_shape_of_the_Stanford_Bunny.png",
        "date": "07/24/2022",
        "text": "A flame ball in the shape of the Stanford Bunny",
        "comment": "This deviates from what was in my mind, but it's cool to have fire and ice next to each other."
    },
    {
        "filename": "craiyon_140159_a_beetle_trapped_inside_transparent_glass",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000825247957786624/craiyon_140159_a_beetle_trapped_inside_transparent_glass.png",
        "date": "07/24/2022",
        "text": "a beetle trapped inside transparent glass",
        "comment": "Insects and plants embedded inside transparent resin is also my fanscination."
    },
    {
        "filename": "craiyon_160540_icy_force__award_winning_photography",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000856518989729892/craiyon_160540_icy_force__award_winning_photography.png",
        "date": "07/24/2022",
        "text": "icy force, award-winning photography",
        "comment": "I was thinking about glaciers. But these images do like award-winning photos I saw on art/photography sites. With waterprints."
    },
    {
        "filename": "craiyon_163432_photorealistic_rendering_of_an_underwater_palace_of_mermaids",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000863650803896320/craiyon_163432_photorealistic_rendering_of_an_underwater_palace_of_mermaids.png",
        "date": "07/24/2022",
        "text": "photorealistic rendering of an underwater palace of mermaids",
        "comment": "\"Would you rather be able to fly, or have the ability to live in water?\""
    },
    {
        "filename": "craiyon_163915_fantasy_eye__a_universe_within",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000864899402043412/craiyon_163915_fantasy_eye__a_universe_within.png",
        "date": "07/24/2022",
        "text": "fantasy eye, a universe within",
        "comment": "I was inspired by the [url=https://harry7557558.github.io/Graphics/UI/Homework/AVI3M/index.html]eye drawing project[/url] in my grade 11 visual art class."
    },
    {
        "filename": "craiyon_192231_butterflies_surround_a_broken_glass_cup_with_miniature_blooms_inside_it",
        "original": "https://cdn.discordapp.com/attachments/989936230470934558/1000906429345054730/craiyon_192231_butterflies_surround_a_broken_glass_cup_with_miniature_blooms_inside_it.png",
        "date": "07/24/2022",
        "text": "butterflies surround a broken glass cup with miniature blooms inside it",
        "comment": "Based on an overused idea from my junior high school art teacher."
    }
];

function clickPreview(event) {
    let container_full = document.getElementById("container-full");
    let container = event.target;
    while (!/^craiyon_/.test(container.id)) {
        container = container.parentElement;
        if (container.tagName.toLowerCase() == "body") {
            container_full.style.display = "none";
            return;
        }
    }
    let fulls = container_full.children;
    for (var i = 0; i < fulls.length; i++) {
        if (fulls[i].id == "close-button")
            continue;
        if (fulls[i].id == container.id)
            fulls[i].style.display = null;
        else fulls[i].style.display = "none";
    }
    container_full.style.display = null;
}

function main(objects) {
    let container = document.getElementById("container");
    let container_full = document.getElementById("container-full");

    for (var oi = objects.length; oi--;) {
        var object = objects[oi];

        let title = object.filename;
        let thumb = "thumbs/" + title + ".jpg";
        let full = "jpg/" + title + ".jpg";
        let original = object.original;
        let date = object.date;
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
            div_date.textContent = date;
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
            div.id = title;
            div.className = "object-thumb";
            div.addEventListener("click", clickPreview);
            let img = document.createElement("img");
            img.className = "img-thumb";
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
        if (event.target == container_full || /^craiyon_/.test(event.target.id))
            container_full.style.display = "none";
    });
    // container.children[0].click();

    document.getElementById("close-button").addEventListener("click", clickPreview);
    document.getElementById("updated-date").textContent = "Harry Chen - Updated " + objects[objects.length - 1].date;
}

(function () {
    main(OBJECTS);
})();