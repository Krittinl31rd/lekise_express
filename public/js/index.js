const sidebarpanel = document.getElementById('sidebarpanel');
const sidebarControl = document.getElementById('sidebarcontrol');
const sidebarControlBtn = document.getElementById('sidebarcontrolbtn');
const navpanel = document.getElementById('navpanel');

sidebarControlBtn.addEventListener('click', () => {
    //const isSidebarVisible = !sidebarpanel.classList.contains('hidden');
    const isSidebarVisible = !(sidebarpanel.style.display == "none");

    if (isSidebarVisible) {
        // Hide sidebar
        sidebarpanel.style.display = "none";
        //sidebarpanel.classList.add("hidden");
        //sidebarpanel.classList.remove("w-[284px]");
        //sidebarControl.classList.remove("ml-[274px]");
        //sidebarControl.classList.add("ml-[18px]");
        sidebarControl.style.marginLeft  = '8px'; // Move button to 16px
        sidebarControlBtn.innerHTML = "<i class='bx bx-chevron-right' ></i>"; // Change button text
        navpanel.style.marginLeft  = '21px';
        //navpanel.classList.remove("ml-0");
        //navpanel.classList.add("ml-[21px]");
    } else {
        // Show sidebar
        sidebarpanel.style.display = "";
        //sidebarpanel.classList.remove("hidden");
        //sidebarControl.classList.remove("ml-[18px]");
        //sidebarControl.classList.add("ml-[274px]");
        //sidebarpanel.classList.add("w-[284px]");
        sidebarControl.style.marginLeft  = '274px'; // Move button back to 274px
        sidebarControlBtn.innerHTML = "<i class='bx bx-chevron-left' ></i>"; // Change button text
        navpanel.style.marginLeft  = '0px';
        //navpanel.classList.remove("ml-[21px]");
        //navpanel.classList.add("ml-0");
    }
});