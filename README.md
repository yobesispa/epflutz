
# Epflutz: Mutool Run, Unleashed

Wondering what this weirdly-named tool (pronounced EPP FLOOTZ) is good for? Then continue reading, and it will be obvious to you in a moment -- hopefully!

## Prelude: Getting to know mutool

You might have heard of mutool -- a caffeinated Swiss army knife of PDF wrangling. On Ubuntu Linux, it can be installed with the command below:
  
```sh
apt-get install mupdf-tools
``` 

But in case you are among the unwary many who haven't yet heard of it, I urge you do yourself a favour and head over to https://mupdf.com/docs/mutool.html and acquaint yourself with this brilliant work of humanity. Your life will most probably be easier afterwards.

What many seem to not have heard of (or otherwise have appallingly taken for granted), though, is the `mutool run` subcommand.

As its first argument, `mutool run` takes a Javascript file; the rest of arguments serve as "script arguments" to that .JS file:

```sh
mutool run filename.js scriptArg_0 scriptArg_1 ... # et cetera
```

"What next?" you might ask. Your answer is "Whatever you please!"

`mutool run` creates a JS runtime environment and populates that environment with a huge amount of C-language PDF processing tools, and runs your script in that environment:

- Want to reverse the order of your PDF pages as non-invasively as possible? All right! 
- Want to resize the pages to whatever bounds that please you? No problem.
- Want to append an outline (i.e., a table of contents) to your PDF? Quite easy!
- Want to put a cover image as the first page of your pdf? Performed before you even ask!
- Want to pull out the guts of your PDF and inspect its obscure low-level objects to find out what keeps your PDF from displaying properly? Look no further! 

`mutool run`'s only limit is its user's imagination. The list can go on and further on.

There is a tiny problem though: to use `mutool run` effectively, low-level PDF objects must be your bread and butter. This is where Epflutz comes to rescue!

## Abstracting things away with Epflutz

Epflutz creates a thin abstraction layer between some common high-level tasks and the low-level way that `mutool run` performs them. Things like creating a table of contents (a "PDF outline"), creating a nicely stretched cover image, or mixing pages from multiple PDF files can become repetitive and error-prone. With Epflutz, that won't be the case. Examples in the `examples` folder showcase some of the capabilities of Epflutz. Just ` cd` to the subdirectory you want under `examples`, and run the script in that subdirectory with `mutool run` followed by the name of the script. My favourite one is the one at `examples/recipe-raw-with-toc-and-cover`:
  
```sh
cd './examples/recipe-raw-with-toc-and-cover'
mutool run './recipe-run-with-toc-and-cover.js'

``` 

(A great book made even better by a decent cover and a nice table of contents, by the way!) 
    
## FAQ

-  Q: How is epflutz pronounced? And what the hell does it even mean?!

   A: Epflutz is (as noted above) pronounced EPP FLOOTZ. It's a silly amalgamation of EPFL (my favourite university, alas) and "utz" (my lame abbreviation for "utilities"). 
