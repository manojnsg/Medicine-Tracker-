if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('service-worker.js');
}

let medicines=JSON.parse(localStorage.getItem("medicines"))||[];
let history=JSON.parse(localStorage.getItem("history"))||[];
let appointments=JSON.parse(localStorage.getItem("appointments"))||[];

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.style.display="none");
document.getElementById(id).style.display="block";
}
showPage("home");

function enableNotifications(){
Notification.requestPermission();
}

function signup(){
localStorage.setItem("user",signupUser.value);
localStorage.setItem("pass",signupPass.value);
alert("Signup Success");
}

function login(){
if(loginUser.value===localStorage.getItem("user") &&
loginPass.value===localStorage.getItem("pass")){
showPage("dashboard");
}else alert("Invalid");
}

function logout(){showPage("home");}

function addMedicine(){
let name=medName.value;
let dose=medDose.value;
let time=medTime.value;

if(dose>1000){
overdoseMsg.innerText="⚠ Overdose Warning!";
showPage("overdose");
return;
}

medicines.push({name,dose,time});
localStorage.setItem("medicines",JSON.stringify(medicines));
displayMedicines();
scheduleNotification(name,time);
}

function scheduleNotification(name,time){
let now=new Date();
let reminder=new Date();
reminder.setHours(time.split(":")[0]);
reminder.setMinutes(time.split(":")[1]);

let delay=reminder-now;

if(delay>0){
setTimeout(()=>{
navigator.serviceWorker.ready.then(reg=>{
reg.showNotification("Medicine Reminder 💊",{
body:"Time to take "+name,
icon:"icon.png"
});
});
history.push(name+" taken");
localStorage.setItem("history",JSON.stringify(history));
displayHistory();
},delay);
}
}

function displayMedicines(){
todayList.innerHTML="";
medicines.forEach(m=>{
todayList.innerHTML+=`<li>${m.name} ${m.dose}mg at ${m.time}</li>`;
});
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
reg.showNotification("Appointment Reminder 🏥",{
body:"Appointment with "+doc
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
alert("Saved");
}

displayMedicines();
displayHistory();
displayAppointments();