const profile__menu = document.querySelector(".profile__menu");
const profileBtn = document.getElementById("profileBtn");



function toggleProfileDropdown(event) {
  event.target.classList.toggle("icon-hover"); 
  event.target.classList.toggle("icon-active"); 
  profile__menu.classList.toggle("profile__menu-active");
}


function closeProfileDropdown(event) {
  if (event.target.id != "profileBtn") {
    if (profile__menu.classList.contains("profile__menu-active")) {
      profileBtn.classList.remove("icon-active");
      profileBtn.classList.toggle("icon-hover");
      profile__menu.classList.remove("profile__menu-active");
    }
  }
}


profileBtn.addEventListener("click", toggleProfileDropdown);

document.addEventListener("click", closeProfileDropdown);


const order = document.querySelectorAll(".order");



async function getOrder(orderId) {
  const url = `orders/${orderId}`;
  location.assign(url);
}


function orderClick(event) {
  let orderId = null;
  const children = event.target.children;

  Array.from(children).forEach((element) => {
    if (element.id == "orderId") {
      orderId = element.value;
      return;
    }
  });
  getOrder(orderId);
}


order.forEach((tile) => {
  tile.addEventListener("click", orderClick);
});
