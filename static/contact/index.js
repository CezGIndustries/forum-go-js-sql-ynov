const select = document.getElementById('selectfilter').addEventListener('change', () => {
    const aide = document.getElementById("selectfilter").value;
    if (aide == "Aide") {
        document.getElementById("report").innerHTML = "Welcome to our report page.";
    } else if (aide == "SPAM") {
        document.getElementById("report").innerHTML = "Submit the link of the user.";
    } else if (aide == "Racisme") {
        document.getElementById("report").innerHTML = "Submit the cron link.";
    } else if (aide == "Bug") {
        document.getElementById("report").innerHTML = "Submit the Bug.";
    } else {
        document.getElementById("report").innerHTML = "Contact the staff";
    }
})