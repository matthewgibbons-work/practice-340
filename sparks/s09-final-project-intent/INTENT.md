> Model answer for the instructor's practice repo. The definition is left as a placeholder on purpose: yours is in your own words.

# Final Project intent brief

## Reader

My cousin Jess, a high-school senior who loves art class and is choosing a major. When I said I was making a Digital Humanities site, she asked: "Isn't that just history with computers? What would I actually *do*?"

## My definition, first draft

[Placeholder: a student's first-draft definition goes here, two to four sentences in their own words. The model repo leaves it out so nobody copies it.]

## Examples

- **William Blake Archive** (https://www.blakearchive.org/): it puts Blake's illuminated books online as images *and* as searchable text, so you can compare copies of the same poem side by side. It fits because it's about looking closely at art, which is what Jess already likes.
- **Slave Voyages** (https://www.slavevoyages.org/): a database of tens of thousands of slaving voyages you can search, map, and chart. It fits because it shows how counting and mapping can make a history visible that no single document shows.
- **Mapping Inequality** (https://dsl.richmond.edu/panorama/redlining/): the 1930s "redlining" maps of US cities, scanned and placed on a modern map you can zoom. It fits because it connects an old document to the neighbourhoods people live in now.

## Data

- **Wikipedia page summaries**, at build time: `https://en.wikipedia.org/api/rest_v1/page/summary/William_Blake_Archive` and `…/summary/Voyages:_The_Trans-Atlantic_Slave_Trade_Database`. Fields: `title`, `extract`, `content_urls.desktop.page`. Serves the Blake and Slave Voyages example pages (a short "what others say" box with a link). Mapping Inequality has no Wikipedia article, so its page doesn't get one.
- **Art Institute of Chicago search**, in the browser: `https://api.artic.edu/api/v1/artworks/search?q=William%20Blake&fields=id,title,artist_title,date_display,image_id&limit=6`. The island always searches within Blake: it sends `q=William Blake ` plus the reader's word, and my own code keeps only results whose `artist_title` is "William Blake". Fields: `title`, `artist_title`, `date_display`, `image_id` (the picture comes from `https://www.artic.edu/iiif/2/{image_id}/full/400,/0/default.jpg`). Serves the Blake page: "Blake's prints you can see in Chicago."
- No key for either. I opened all three URLs in the browser and saw the fields.

## Pages and islands

- Home: my definition, two sources, a preview card per example. Built.
- Examples index: a card per example from the collection. Built.
- One page per example (dynamic route): overview, my analysis, credited image, links, and the Wikipedia box where there is one. Built.
- Blake prints island on the Blake page: a search form (labeled, errors in words) that asks the Art Institute for prints by a search word and shows them. Island, `client:visible` (it's far down the page).
- Reflections. Built.
- Notes index and one page per `NOTES.md` (dynamic route). Built.

## My "done" list

1. The home page's first paragraph answers Jess's question in under 100 words.
2. Each example page names one specific thing I searched, read, or tried in that project.
3. Each example page's image has `alt` text and a credit line that links to where it came from.
4. Both Wikipedia boxes show the summary and a "Read more on Wikipedia" link, and the Mapping Inequality page has no empty box.
5. The Blake search with an empty box says "Type a word to search for" in words, and focus stays in the box.
6. A search with no results says "No prints found for …", not a blank space.
7. If the Art Institute is down, the island says so and the rest of the page still works.
8. The nav marks the current page with `aria-current="page"` on every page.
9. Every page passes axe in Playwright, and works with Tab alone.
10. By Sat Dec 5, Jess reads the home page and one example. It passes if she can name one thing she'd actually *do* in one of the projects; I write her answer in `final-project/NOTES.md` either way.

## Risks

- **The Art Institute search is slow or down during the demo.** Plan B: the island shows a clear error and a link to search the museum's own site.
- **Mapping Inequality's images have unclear reuse terms.** Plan B: a screenshot I take myself, credited, or a link with no image.

## Changes after review

- **Done item 10** had no date and passed even if Jess didn't get it. It now has a date (Dec 5, so there's a week to fix things) and a pass line: she names one thing she'd do.
- **The Blake island searches within Blake only.** "Tiger" would have returned every tiger in the museum.
- **The Blake page says the copy comparison happens on the Archive**, with a link to one poem's copies. The island answers a different question (what can you see in person), and I say so on the page.
- **Kept:** the Wikipedia boxes. Claude's right that they say what each project *is*, but Jess asked that too; my analysis is where the "what you'd do" goes.
- **Kept, but watching:** the Blake page is the biggest. If it's not done by Dec 2, the island moves to its own page.
