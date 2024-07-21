## Context

GeoClicker is a simple game that I am making in order to learn Angular. The goal is for the player to click on a map within the bounds of a given region. For example, if the game is happening in switzerland and the type of region is NUTS 3, the game will give the name a Canton and the player must click on the map somewhere inside of the Canton.

Additionnal features could include :

- Selectable difficulty level (NUTS and LAU)
- Selectable region (a country or all of europe)
- A timer
- 1 vs 1 gameplay
- whole world

This game was chosen as it gives the opportunity to implement features that are similar to the ones of Citiwatts, the project that I will be working on.

### 21.07.2024

`map-components.ts` displays Switzerland in grey and clicked Cantons in blue. Data is fetched from local geoJSON `NUTS_switzerland` . Canton selection state is saved directely in the fetched geoJSON (in the components attribute not in the actual geoJSON file).

`game-menu.components.ts` displays the list of Cantons. Data is fetched from local geoJSON `NUTS_switzerland` 

At this point there is redundant loading of the geoJSON.

The game-menu and the map do not interact.
