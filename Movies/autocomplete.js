// ALWAYS MODULARIZE CODE AS MUCH AS POSSIBLE
// ADDING THIS CLASS TO MAKE MOVIE SEARCH WIDGETS MORE USABLE OUTSIDE THIS PROJECT, beyond movies
// use Obj and Funcs are args to peronalize autocomplete, here used on movies as return list
// config is object with configurations defining how this call of autocomplete should work
// destructuring of root, renderOption func, onOptionSelect func, inputValue func (for movie title) 
// out of config object argument below
const createAutoComplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {

    // adding Bulma classes to html for drop down search added below
    // keeping seperate from direct into HTML allows easier reuse on site
    // site adds 2nd search bar, now only type once
    //where to render autocomplete
    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
                <div class="dropdown-conent results"></div>
            </div>
        </div>
    `;

    // track while USER is typing in search bar for debounce
    // using 'root" instead of document makes code more modular
    // root comes from argument sent in
    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    // async + await as promise made with fetch
    // input into text box is event, used in fetch
    // has built in 1 sec delay so not constant fetch - see debounce in utils
    const onInput = async event => {
        //how to fetch data defined by arg above
        const items = await fetchData(event.target.value);

        // handle drop-down staying open when movie search/results are removed
        if (!items.length){
            dropdown.classList.remove('is-active');
            return;
        }
        
        // remove previous movies
        resultsWrapper.innerHTML = '';

        dropdown.classList.add('is-active');

        for (let item of items){
            const option = document.createElement('a');
            option.classList.add('dropdown-item');
            //renderOption destructured from arg obj into createAutoComplete
            //how to show items
            option.innerHTML = renderOption(item);

            //handle click on movie from drop-down list
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                //what to backfill inside search bar on click
                input.value = inputValue(item);
                //use movie clicked on to call func to get movie IMDB details
                //what to do when item is clicked
                onOptionSelect(item);
            });

            resultsWrapper.appendChild(option);
        }
    };//end onInput in search bar

    // create timeout with 1 sec then Fetch
    // if timeoutId hits 1 sec/completes, then fetch
    input.addEventListener('input', debounce(onInput, 500));

    // closing drop-down of serach when clicking outside of the area
    //below is GLOBAL event listener for any/all clicks
    document.addEventListener('click', event => {
        //root was used as area containing drop-down and search
        //event.target is the click
        //if click is anywhere outside of ROOT, remove is-active class
        //hides the dropdown after class is removed
        if (!root.contains(event.target)){
            dropdown.classList.remove('is-active');
        }
    });

};