class Timer{

    // constructor for timer obj: duration, startButton, pauseButton, callbacks is optional
    constructor(durationInput, startButton, pauseButton, callbacks){
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.pauseButton = pauseButton;
        // false is no callbacks as undefined
        if (callbacks){
            this.onStart = callbacks.onStart;
            this.onTick = callbacks.onTick;
            this.onComplete = callbacks.onComplete;
        }

        // build events & attached methods into object
        this.startButton.addEventListener('click', this.start);
        this.pauseButton.addEventListener('click', this.pause);
    }

    // to insure start uses current Timer as 'this'
    // define start() method w/ Arrow function
    // start function is moved into constructor of class via Class Properites JS feature
    // this makes last 'this' reference link to current Timer (rule for Arrows)
    // alternate use = BIND to call method, override THIS to desired object
    // this.start.bind(this) - older way of achieving this
    start = () => {
        if (this.onStart){
            this.onStart(this.timeRemaining);
        }
        // call tick every second
        // misses first tick as waits 1 second to show count
        // manually call first tick to avoid 1 second delay of view
        this.tick();
        // setInterval returns Timer object, use for Pause
        // returns an INT that is ID of that timer object
        // caputre ID in interval var for use in pause()
        this.interval = setInterval(this.tick, 50);
    };

    pause = () => {
        // use Timer ID above to stop ticking of setInterval
        clearInterval(this.interval);
    };

    tick = () => {
        if (this.timeRemaining <= 0){
            this.pause();
            if (this.onComplete){
                this.onComplete();
            }
        } else {
        // input is string must parse to numeric value
        // GET and SET below creates instance var of method name timeRemaining
        // avoids needing () also on method call and hides implementation
        this.timeRemaining = this.timeRemaining - 0.05;
        if (this.onTick){
            this.onTick(this.timeRemaining);
        }
        }
    };

    // GET & SET keyword allows treating method name as instnace variable
    // getters/setters newer JS feature
    get timeRemaining(){
        return parseFloat(this.durationInput.value);
    }

    set timeRemaining(time){
        this.durationInput.value = time.toFixed(2);
    }
}