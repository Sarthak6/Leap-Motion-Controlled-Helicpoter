// CONTROLLING A HELICOPTER USING LEAP MOTION WITH AN ARDUINO 

// programmed in javascript but controls arduino 
//used johnny five libraries to do so 
// javascipt for ease of retrieval of leap motion data

//this sets up the websocket for the leapmotion 
var webSocket = require('ws'),
//leap motion standard port 
    ws = new webSocket('ws://127.0.0.1:6437'),
    //sets up connection to johhnny five library - enabling the use of javascript in controlling arduino 
    //johnny five library communicates with the standard firmata plus on arduino 
    five = require('johnny-five'),
    //palm data 
    palm = Array(),
    //arduino set up 
    board = new five.Board(),
    led, frame, servo1;


board.on('ready', function() {
    //test led 
    led = new five.Led(13);
    //initializing servos for different controls
    // started at zero position for each respective control
    //yaw servo 
    servoyaw = new five.Servo({
          pin: 9,
        range: [0, 180],
        startAt: 90
    });
    //pitch servo 
    servopitch = new five.Servo({
        pin: 10,
        range: [0, 180],
        startAt: 90
    });
    //throttle servo 
    servothrottle = new five.Servo({
        pin: 11,
        range: [10, 180],
        startAt: 10
    });


    ws.on('message', function(data, flags) {
        //getting data from websocket of leap motion and parsing it as a json file
        frame = JSON.parse(data); 
        //initiating control
        if (frame.hands && frame.hands.length > 0) {
            led.on();
            //retrieving leap motion data - plotting palm position
            palm[0] = frame.hands[0].palmPosition[0]; // x value
            palm[1] = frame.hands[0].palmPosition[1]; // y value
            palm[2] = frame.hands[0].palmPosition[2]; // z value 

            // mapping the palm position onto the servos 
            // the servos control the joy stick of the plane
            //mapping involves calculating the respective positions of joystick and range of hand movements 
            //obsevre leap motion sample json data to understand this 
            servothrottle.to(140*palm[1]/475);
            servoyaw.to(90+0.5*palm[0]);
            servopitch.to(90+0.5*palm[2]);



         // safety when the hand is not there, the helicopter is turned off immediately 
        }
        else {
            led.off();

            // the default positions 
            servopitch.to(90);
            servoyaw.to(90);
            servothrottle.to(10)

        }
    });
});

