# airbases
An analysis of wikidata with respect to airbases of the world in their .
geopolitical-settings

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

![countries-and-iso-codes.sparql](wikidata/countries-and-iso-codes.sparql)

AND most of the countries have been cleaned up since the last time I ran this
query, four years ago back in 2020. BUT STILL!
![wd:Q148](https://www.wikidata.org/wiki/Q148) is labeled "People's Republic
of China" here, but is elsewhere referenced simply as "China."

The query, now, contains the solution there: the ISO 3166-1 alpha-3 code, or
![wdt:P298](https://www.wikidata.org/wiki/Property:P298).

That I can reference, everywhere.

But I do need consistent country-names across data-sets.

That's where my 
