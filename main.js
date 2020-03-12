//Замыкания

let myCounter = function() {
    let privateCounter = 0;

    function changeValue(value) {
        privateCounter += value;
    }

    //return object
    return {
        //Add +1
        increment: function() {
            changeValue(1);
        },

        //-1
        decrement: function() {
            changeValue(-1);
        },

        //Return privateCounter Info
        value: function() {
            return privateCounter;
        }
    }
}

let counter1 = myCounter();
//Add +1
counter1.increment();

console.log(counter1.value());