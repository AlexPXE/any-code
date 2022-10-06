"use strict";
/**
 * **Just different timer classes and functions.**
 * 
 * @module timers
 */

/**
 * Any object that contains a property 'textContent'.
 * @typedef {Object} OutputObject 
 * @property {string} textContent Property for storing the text to be outputted.
 */

/**
 * Container for the output elements ([see OutputObject]{@link module:timers~OutputObject}).
 * 
 * @typedef {Object} TimerOutput 
 * @property {OutputObject} days
 * @property {OutputObject} hours
 * @property {OutputObject} minutes
 * @property {OutputObject} seconds
 */


/**
 * **Interface for classes that represent a timers.**
 * 
 * @interface Timer
 */
 class Timer {          
 
     constructor() {
        if(this.constructor === Timer) {
            throw new TypeError(`Cannot construct Timer instances directly!`);
        }        
     }

     /**
      * Starts the timer.
      */
     start() {
        throw new Error(`${ this.constructor.name }: Not implemented!`);
     }

     /**
      * Stops the timer.
      */
     stop() {
        throw new Error(`${ this.constructor.name }: Not implemented!`);
     }

     /**
      * Resets the timer.
     */
     reset() {
        throw new Error(`${ this.constructor.name }: Not implemented!`);
     }

     /**
      * Pauses the timer.
      */
     pause() {
        throw new Error(`${ this.constructor.name }: Not implemented!`);
     }

    /**
     * Resumes the timer.
     */
    resume() {
        throw new Error(`${ this.constructor.name }: Not implemented!`);
    }
 }


/**
 * The ReverseTimer class dose not have such features as pause/resume, it does not implements the [Timer interface]{@link module:timers~Timer}.
 * 
 */
class ReverseTimer {
    /**
     * Creates a new ReverseTimer instance.
      To the start the timer, you need to call the [startTimer(deadline) method.]{@link module:timers~TimerOutput#startTimer}
     * @param {TimerOutput} elements [See TimerOutput]{@link module:timers~TimerOutput}     
     */
    constructor({days, hours, minutes, seconds}) { 
        
        let timerId;        

        /**
         * If number less then 10, then add a zero before it.
         * 
         * @param {number} numb 
         * @returns {string}
         */
        const zeroBefore = numb => {
            return `${((numb < 10) && '0') || ""}${numb}`;
        };
        
        /**
         * Outputs the time to the elements.
         * 
         * @param {number} sec Seconds left.
         * @returns {void}
         */
        const display = sec => {                        
            days.textContent = zeroBefore(~~(sec / 86400));             // ~~(sec / seconds in a day)
            hours.textContent = zeroBefore(~~((sec % 86400) / 3600));   // ~~(sec % seconds in a day) / seconds in an hour 
            minutes.textContent = zeroBefore( ~~(sec / 60) % 60);       // ~~(sec / seconds in a minute) % minutes in an hour
            seconds.textContent = zeroBefore(sec % 60);                 // sec % seconds in a minute
        };
        

        /**
         * Stops the timer. Values ​​of the output elements will not be set to zero.
         * @returns {void}          
         */
        this.stopTimer = () => {
            if(timerId !== undefined) {
                timerId = clearInterval(timerId);                
                return console.log('Stop timer!');
            } 
            
            return console.log('Timer not running!');
        };
        
        /**
         * Start the timer. If the timer is already running, then it will be stopped and restarted with the new deadline.      
         * 
         * @param {string|number} deadLine String date in the format 'YYYY-MM-DD HH:MM:SS' or any format date 
         * compatible with the RFC2822 / IETF or ISO 8601 standard or number of second.
         * (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse MDN Web Docs}).          
         * @returns {void}
         * @throws {Error} If the *deadLine* is not valid.
         */

        this.startTimer = deadLine => {
            
            if(timerId) {
                this.stopTimer();
            }

            let stopDate;

            switch(typeof deadLine) {
                case 'string':
                    stopDate = ~~(Date.parse(deadLine)/ 1000);

                    if(Number.isNaN(stopDate)) {
                        throw new Error('Invalid deadline!');
                    }     

                    break;                    

                case 'number':
                    stopDate = deadLine + ~~(Date.now() / 1000);
            }
            
            timerId = setInterval(() => {               
                let secNow = ~~(Date.now() / 1000);

                if(stopDate > secNow) {
                    display(stopDate - secNow);
                } else {
                    this.resetTimer();
                }
            }, 1000);
        };

        /**
         * If the timer is already running then stops and resets values of the output elements to zero. 
          Else just resets values of the output elements to zero.     
         * @returns {void}
         */
        this.resetTimer = () => {   
            if(timerId) {
                this.stopTimer();
            }

            display(0);
        };
    }
}

/**
 * Creates a new **ReverseTimer** instance and returns start timer function for the instance.
 * * For example:  
 *  ```JavaScript 
 *     const startAgain = newReverseTimer(timerOutput)('2022-06-04T17:28:00')()(); //etc...
 * ```  
 * or
 *  ```JavaScript 
 *     const start = newReverseTimer(timerOutput); //inicialization timer
 *     const stop = start('2022-06-04T17:28:00');  //start timer
 *     const reset = stop();                       //stop timer
 *     const startAgain = reset();                 //reset timer
 *     startAgain('2022-06-04T17:40:00');          //start again etc...
 * ```
 * * *newReverseTimer(timerOutput) => startTimer("2022-06-04T17:28:00") => stopTimer() => resetTimer() => startTimer("2022-06-04T17:40:00");*
 * 
 * @function newReverseTimer 
 * @param {TimerOutput} timerOutput [See TimerOutput]{@link module:timers~TimerOutput}
 * @returns {Function} Start timer function.
 * @tutorial newReverseTimer 
 */
const newReverseTimer = timerOutput => {    
    let {startTimer, stopTimer, resetTimer} = new ReverseTimer(timerOutput);

    /**
     * Starts the timer and returns the stop timer function.
     * @function start     
     * @param {string|number} deadLine 
     * @returns {Function} Stop timer function.     
     */
    const start  = deadLine => {
        startTimer(deadLine);

        /**
         * Returns a function that resets the timer.
         * @return {Function} Reset timer function.
         */
        return () => {
            stopTimer();
            /**
             * Resets timer and returns the start timer function.
             * @return {Function} Start timer function.
             */
            return () => {
                resetTimer();
                return start;
            };
        };
    };

    return start;
};

async function asyncTimer(deadLine) {
    let stopDate;
    let timerId;

    switch (typeof deadLine) {
        case 'string':
            stopDate = ~~(Date.parse(deadLine) / 1000);

            if (Number.isNaN(stopDate)) {
                throw new Error('Invalid deadline!');
            }
            break;

        case 'number':
            stopDate = deadLine + ~~(Date.now() / 1000);
    }

    await new Promise((resolve, reject) => {
        timerId = setInterval(() => {
            let secNow = ~~(Date.now() / 1000);
    
            if (secNow >= stopDate) {
                clearInterval(timerId);
                resolve();                
            }
        }, 1000);        
    });

    return 0;
}

export {ReverseTimer, newReverseTimer, asyncTimer};