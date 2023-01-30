//making 2 autoCompletes, rather than write all 2x resuse what doesn't change
//will make all below enter as 1 object arg into AutoComplete via ...
const autocCompleteConfig = {
    // rendering no longer specific to autocomplete, now modular to object
    // render method is 2nd argument to createAutoComplete, can edit here now
    //arg 2
    renderOption(movie) {
        // check for missing poster images before display and handle
        //correct via Ternary expression, if missing make blank ''
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return  `
            <img src="${imgSrc}"/>
            ${movie.Title}
        `;
    },
    //funcs to decide what fills search after click on drop-down return values
    //and what movie title will fill in input text area
    //arg 3 split into 2 onOptionSelect as 2 columns so need two HTML IDs to hit
    //arg 4
    inputValue(movie){
        return movie.Title;
    },
    // use Axios instead of Fetch for requests
    // searching for films on omdbapi, see site for usage docs
    //arg 5
    async fetchData(searchTerm) {
        // 2nd argument params object gets appended to URL below
        const response = await axios.get('http://www.omdbapi.com', {
            params: {
                apikey: '399ea781',
                // from documentation s is search variable used by API
                s: searchTerm
            }
        });
    
        // not all serach inputs return anything, get error
        // in those cases return an empty array
        if (response.data.Error){
            return [];
        }
        // api response seen in Network section of dev tools
        // Search contains movie data we want (using caps)
        return response.data.Search;
    }// end fetch
}

// define argument root object and 4 helper funcs as args in function call
createAutoComplete({
    //3 helpers above into 1 object argument for createAutoComplete
    ...autocCompleteConfig,
    //arg 1
    root: document.querySelector('#left-autocomplete'),
    //arg 5 seperated to show movies on both sides, needed individual
    onOptionSelect(movie){
        //hide directions when movie search starts
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }
});
//2nd search bar/AutoComplete call, only root changed
createAutoComplete({
    //3 helpers above into 1 object argument for createAutoComplete
    ...autocCompleteConfig,
    //arg 1
    root: document.querySelector('#right-autocomplete'),
    //arg 5 as two columns, so split
    onOptionSelect(movie){
        //hide directions when movie search starts
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
});

let leftMovie;
let rightMovie;

//followup request for further movie details after click on drop-down
//uses IMDB ID with Axios/fetch/async
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: '399ea781',
            // from documentation i is search variable used by API for imdbID
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if(side === 'left'){
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie){
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach(() => {
        leftSideStats.forEach((leftStat, index) => {
            const rightStat = rightSideStats[index];

            const leftSideValue = parseInt(leftStat.dataset.value);
            const rightSideValue = parseInt(rightStat.dataset.value);

            if (rightSideValue > leftSideValue){
                leftStat.classList.remove('is-primary');
                leftStat.classList.add('is-warning');
            }
            else {
                rightStat.classList.remove('is-primary');
                rightStat.classList.add('is-warning');
            }
        })
    })
};

//HTML template for movie details display on movies
//easier than worrying about order of which stat is where
const movieTemplate = (movieDetail) => {
    //will use the HTML "data" properties tag to compare stats 
    //can just compare the values irregardless of what they are for/html article placement
    //<article data-index_number="123"> can be used in JS as article.dataset.index_number = 123
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    //add total amount of numbers for awards battle
    //split into array of values based on spaces, look up REDUCE: way to calc in a loop
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)){
            return prev;
        } else {
            return prev + value;
        }
        //0 is 2nd arg of reduce, starting value of calc
    }, 0);
    console.log(awards);

    //backticks for template literal not quotes
    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" />
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};