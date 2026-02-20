if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('service-worker.js');
}

let medicines = JSON.parse(localStorage.getItem("medicines")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

function goTo(id){
document.querySelectorAll(".page").forEach(p=>p.style.display="none");
document.getElementById(id).style.display="block";
}

goTo("home");

function signup(){
localStorage.setItem("user",signupUser.value);
localStorage.setItem("pass",signupPass.value);
alert("Signup Success");
goTo("login");
}

function login(){
if(loginUser.value===localStorage.getItem("user") &&
loginPass.value===localStorage.getItem("pass")){
goTo("dashboard");
displayMedicines();
}else{
alert("Invalid Login");
}
}

function logout(){
goTo("home");
}

function addMedicine(){
let name=medName.value;
let dose=parseInt(medDose.value);
let time=medTime.value;

if(dose>1000){
overdoseMsg.innerText="Dose too high! Please check.";
goTo("overdose");
return;
}

medicines.push({name,dose,time});
localStorage.setItem("medicines",JSON.stringify(medicines));
displayMedicines();
scheduleReminder(name,time);
alert("Medicine Saved");
}

function displayMedicines(){
todayList.innerHTML="";
medicines.forEach(m=>{
todayList.innerHTML+=`<li>${m.name} - ${m.dose}mg at ${m.time}</li>`;
});
}

function scheduleReminder(name,time){

Notification.requestPermission();

let now=new Date();
let reminder=new Date();
reminder.setHours(time.split(":")[0]);
reminder.setMinutes(time.split(":")[1]);
reminder.setSeconds(0);

let delay=reminder-now;

if(delay>0){
setTimeout(()=>{

// Notification
navigator.serviceWorker.ready.then(reg=>{
reg.showNotification("💊 Medicine Reminder",{
body:"Time to take "+name,
icon:"icon.png",
vibrate:[200,100,200]
});
});

// Alarm sound
let audio=new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
audio.play();

history.push(name+" taken at "+time);
localStorage.setItem("history",JSON.stringify(history));
displayHistory();

},delay);
}
}

function displayHistory(){
historyList.innerHTML="";
history.forEach(h=>{
historyList.innerHTML+=`<li>${h}</li>`;
});
}

function addAppointment(){
let doc=docName.value;
let date=new Date(appDate.value);

appointments.push({doc,date});
localStorage.setItem("appointments",JSON.stringify(appointments));
displayAppointments();

let delay=date-new Date();

if(delay>0){
setTimeout(()=>{
navigator.serviceWorker.ready.then(reg=>{
reg.showNotification("🏥 Appointment Reminder",{
body:"Appointment with "+doc,
vibrate:[300,200,300]
});
});
},delay);
}
}

function displayAppointments(){
appointmentList.innerHTML="";
appointments.forEach(a=>{
appointmentList.innerHTML+=`<li>${a.doc}</li>`;
});
}

function saveProfile(){
localStorage.setItem("profile",profileName.value);
alert("Profile Saved");
}
