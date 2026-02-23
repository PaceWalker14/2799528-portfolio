//get music titles by year function
/**
 * Groups music tracks by year and returns sorted titles
 * @param {Array} tracks - Array of track objects
 * @returns {Object} - Object with years as keys and sorted title arrays as values
 */
function getMusicTitlesByYear(tracks)
{
    // if input empty 
    if (!Array.isArray(tracks) || tracks.length === 0) 
    {
        return {};
    }

    const titlesByYear = {};

    for (const track of tracks) 
    {
        //skips if track is not an object
        if (!track || typeof track !== 'object') 
        {
            continue;
        }

        const { year, title } = track;

        //skips if year is not a finite number
        if (!Number.isFinite(year)) 
        {
            continue;
        }

        //if it is not in the array, creates an empty array for the titles to go in
        if (!titlesByYear[year]) 
        {
            titlesByYear[year] = [];
        }
        //adds it to the array
        titlesByYear[year].push(title);
    }

    for (const year in titlesByYear) 
    {
        titlesByYear[year].sort((firstTitle, secondTitle) => firstTitle.localeCompare(secondTitle));
    }

    return titlesByYear;
}





//filterAndTransformTracks function 
/**
 * Filters tracks by criteria and adds decade information
 * @param {Array} tracks - Array of track objects
 * @param {Object} criteria - Filter criteria (minYear, maxYear, artist)
 * @returns {Array} - Filtered and transformed track objects
 */
function filterAndTransformTracks(tracks,criteria)
{
    //checks for parameters
        //if invalid array
        if (!Array.isArray(tracks) || tracks.length === 0)
        {
            return [];
        }

        // if criteria is not an object, sets it to an empty object to avoid errors
        const safeCriteria = criteria && typeof criteria === 'object' ? criteria : {};

        //destructures criteria, providing default values if not present
        const { minYear, maxYear, artist } = safeCriteria;

        //check if minYear and maxYear are finite numbers
        const hasMinYear = Number.isFinite(minYear);
        const hasMaxYear = Number.isFinite(maxYear);

        //check if artist is a non-empty string
        const hasArtist = typeof artist === 'string' && artist.trim() !== '';
        const normalizedArtist = hasArtist ? artist.toLowerCase() : '';

        const transformedTracks = [];


    //going through all tracks, filtering
    for (const track of tracks)
    {
        // if not an object skips
        if (!track || typeof track !== 'object')
        {
            continue;
        }

        const { title, artist: trackArtist, year } = track;

        //skips if title or artist is not a string or year is not a finite number
        if (typeof title !== 'string' || typeof trackArtist !== 'string' || !Number.isFinite(year))
        {
            continue;
        }

        //skips if year is less than minYear or greater than maxYear
        if (hasMinYear && year < minYear)
        {
            continue;
        }
        if (hasMaxYear && year > maxYear)
        {
            continue;
        }

        //skips if artist does not match(case sensative)
        if (hasArtist && trackArtist.toLowerCase() !== normalizedArtist)
        {
            continue;
        }

        //calculates decade
        const decadeStart = Math.floor(year / 10) * 10;

        //adding to output array
        transformedTracks.push({ title, artist: trackArtist,year,decade: `${decadeStart}s`});
    }

    return transformedTracks;
}









//testing
// if (require.main === module)//makes sure only runs if not imported as a module
// {
//     // const tracks = [
//     //     { title: 'Blinding Lights', artist: 'The Weeknd', year: 2020 },
//     //     { title: 'Levitating', artist: 'Dua Lipa', year: 2021 },
//     //     { title: 'Save Your Tears', artist: 'The Weeknd', year: 2020 },
//     // ];

//     const criteria = { artist: 'The weeknd' };
//     const tracks = [
//     { title: 'Blinding Lights', artist: 'The Weeknd', year: 2020 },
//     { title: 'Starboy', artist: 'The Weeknd', year: 2016 },
//     { title: 'Levitating', artist: 'Dua Lipa', year: 2021 },
//     { title: 'Thriller', artist: 'Michael Jackson', year: 1982 },
// ];

//     //console.log(getMusicTitlesByYear(tracks));
//     console.log(filterAndTransformTracks(tracks,criteria));
// }


//export 
module.exports = {
    getMusicTitlesByYear,
    filterAndTransformTracks
};