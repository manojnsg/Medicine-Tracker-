self.addEventListener("notificationclick", function(event) {

event.notification.close();

let action = event.action;
let medicineTitle = event.notification.title;
let dateTime = new Date().toLocaleString();

let record = medicineTitle + " - " + 
(action === "taken" ? "Taken ✅" : "Not Taken ❌") + 
" at " + dateTime;

// Save in localStorage (via clients)
event.waitUntil(
clients.matchAll({ type: "window" }).then(function(clientList) {
if (clientList.length > 0) {
clientList[0].postMessage({
type: "SAVE_RECORD",
data: record
});
}
})
);

});
