function scheduleReminder(name, dose, time){

Notification.requestPermission();

let now = new Date();
let reminder = new Date();

let hours = time.split(":")[0];
let minutes = time.split(":")[1];

reminder.setHours(hours);
reminder.setMinutes(minutes);
reminder.setSeconds(0);

let delay = reminder - now;

if(delay > 0){

setTimeout(()=>{

navigator.serviceWorker.ready.then(reg=>{
reg.showNotification("💊 " + name + " " + dose + "mg", {
body: "Please take your medicine now.",
icon: "icon.png",
vibrate: [200,100,200],
requireInteraction: true
});
});

// Alarm Sound
let audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
audio.play();

}, delay);

}
}
