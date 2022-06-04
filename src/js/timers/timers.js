"use strict";
/**
 * Just different timer classes.
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
 * The ReverseTimer class dose not have such features as pause/resume.
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
            days.textContent = zeroBefore(~~(sec / 86400));
            hours.textContent = zeroBefore(~~((sec % 86400) / 3600));
            minutes.textContent = zeroBefore( ~~(sec / 60) % 60);
            seconds.textContent = zeroBefore(sec % 60);            
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
          compatible with the RFC2822 / IETF or ISO 8601 standard or number of second.
          (see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/parse MDN Web Docs}).          
         * @returns {void}
         * @throws {Error} If the deadline is not valid.
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
 * Creates a new new  ReverseTimer instance and returns start timer function for the instance.
 * @param {TimerOutput} TimerOutput
 * @returns {Function} Start timer function. 
 */
const newReverseTimer = TimerOutput => {    
    let {startTimer, stopTimer, resetTimer} = new ReverseTimer(TimerOutput);

    /**
     * Starts the timer and returns the stop timer function.
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

export {ReverseTimer, newReverseTimer};



class Foo {
    constructor(name) {
        this.text = '';
        this.name = name + ': ';
    }

    set textContent(text) {
        this.text = text;
        console.log(this.name, this.text);
    }
}

const timerOutputFactory = () => {    
    return {
        days: new Foo('days'),
        hours: new Foo('hours'),
        minutes: new Foo('minutes'),
        seconds: new Foo('seconds')    
    };
};

const stopTimer = newReverseTimer( timerOutputFactory() )('2022-06-04 16:44:00');

setTimeout(() => {
    stopTimer()();
    setTimeout(stopTimer, 10000);
}, 10000);





/*

//console.log(~~((Date.parse('2022-06-03T00:41:30') - Date.now()) / 1000));

*/
