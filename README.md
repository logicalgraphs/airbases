# airbases
An analysis of wikidata with respect to airbases of the world in their .
geopolitical-settings

## The process

1. I [query wikidata](https://query.wikidata.org/) with my SPARQL queries (in 
this repository).
2. I export the results as CSV, saving them to my queries/neo4j/etl/data/
directory.
3. I write the appropriate loader, then run that in neo4j, overlaying data into
the graph.

## Considerations

Wikidata isn't the cleanest nor the most structured data in the world. Let's 
take a look at the domains and the problems, and my solutions, for each.

## Countries

First up, countries.

Oh, boy.

Countries are named differently throughout wikidata, and sometimes there are 
multiple q-identifiers for a particular country. This, notwithstanding, the 
geopolitical landscape of the world for the, oh, past 4,000+ years.

The first SPARQL query to retrieve countries was straightforward.

[countries-and-iso-codes.sparql](queries/wikidata/countries-and-iso-codes.sparql)

AND most of the countries have been cleaned up since the last time I ran this
query, four years ago back in 2020. BUT STILL!
[wd:Q148](https://www.wikidata.org/wiki/Q148) is labeled "People's Republic
of China" here, but is elsewhere referenced simply as "China."

The query, now, contains the solution there: the ISO 3166-1 alpha-3 code, or
[wdt:P298](https://www.wikidata.org/wiki/Property:P298).

That I can reference, everywhere.

But I do need consistent country-names across data-sets.

That's where, on the neo4j-side, my
[countries-corrections](queries/neo4j/etl/02-countries-corrections.cyph)
post-processing file comes in. It's a manual override of country-names to ones
I find consistent across data-sets.

I also come to find that the Netherlands are in two continents: North America
AND Europe, given the way I format the query, but the reason for that is that
the Netherlands owns territories abroad.


## Alliances
