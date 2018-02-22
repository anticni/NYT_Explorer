#DONE
-input tags -- year, month and FIND button
-display search results using ajax in react
-mapping first 20 results to render in app

#TODO

-creating class component for rendering urls
-adding LinkPreview API
-progress bar
-results in pageview


#BACKLOG

-bookmarking
-responsive (mobile-first) styling
-css style - page design
-styling of results




# Requirements

## Implementational constraints

- Styling must be implemented from scratch (no Twitter Bootstrap or something similar is allowed)
- Must use JQuery for AJAX
- Must use specified APIs
- Must use React JS for, at least, search results display
- Project source code must be properly structured (split CSS/HTML/JS source code in files)

Note: Please, use only English in your source code!

## Functional requirements

- Display 20 search results
- Display search results in 4x5 grid on desktop
- Display search results in 2x10 grid on tablet
- Display search results in 1x20 grid on mobile
- Each search result display item must have: title, description and preview image
- Search result details display must contain stringified JSON that is in preatty print format
- Optional: display some progress during fetching articles
- Optional: display all results in pages
- Optional: support "Add to Bookmarks" button for selected search result display item
