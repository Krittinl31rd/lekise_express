document.getElementById('darkModeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark');

    // Save user preference to localStorage
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        console.log('dark');
    } else {
        localStorage.setItem('theme', 'light');
        console.log('light');
    }
});

// Apply saved preference on page load
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    }
});



let bulb1 = 0;//0-100% warm
let bulb2 = 0;//0-100% white
let pwm1 = 0; //Drive PWM 0-255 warm
let pwm2 = 0; //Drive PWM 0-255 white

let brightness = 100;
//_temp 0-100
function SetTemperature(_temp) {
    //0=warm, 100=white
    //|----------|
    bulb1 = 100 - _temp;
    bulb2 = parseInt(_temp);

    //pwm1 = bulb1 * 2.5;
    //pwm2 = bulb2 * 2.5;
    SetBrightness(brightness);//call Brightness function for set the light
}

//_bright 0-100
function SetBrightness(_bright) {
    brightness = _bright;
    let step = 0;
    let drive1 = 0;//warm
    let drive2 = 0;//white
    if (bulb1 > bulb2) {
        step = bulb1 / 100;
        drive1 = _bright * step;
        drive2 = 100 - (_bright * step);

        pwm1 = (bulb1 - (bulb1 - drive1)) * 2.5;
        pwm2 = (bulb2 + (bulb2 - drive2)) * 2.5;
    }
    else {
        step = bulb2 / 100;
        drive1 = 100 - (_bright * step);
        drive2 = _bright * step;

        pwm1 = (bulb1 + (bulb1 - drive1)) * 2.5;
        pwm2 = (bulb2 - (bulb2 - drive2)) * 2.5;
    }
    console.log(pwm1, pwm2);//0-255//Set the light
    if (pwm1 < 0) {
        pwm1 = 0;
    }
    if (pwm2 < 0) {
        pwm2 = 0;
    }
    console.log(pwm1, pwm2);//0-255//Set the light
}