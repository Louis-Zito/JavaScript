// Debounce helper function: take func as arg AND returns func
// Modular way to guarding how often a func can be invoked
// calling API each time you type a letter, some have cost limits
// want a delay to happen while typing, if stop 1 second, then fetchData
// called DEBOUNCING AN INPUT; use default delay of 1000 if not given
const debounce = (func, delay = 1000) => {
    let timeoutId;
    // return func guards how often func can be invoked
    return (...args) => {
        if (timeoutId){
        // keep resetting a timeout if user is typing using Debounce
        // ID exists as long as time isn't hit in timeout
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            // apply takes the mul args and applies each to func
            func.apply(null, args);
        }, delay);
    };
};