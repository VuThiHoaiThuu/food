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


//Adding Click Event on ProfileBtn
profileBtn.addEventListener("click", toggleProfileDropdown);

// Adding Click Event on Document to Close Profile Dropdown
document.addEventListener("click", closeProfileDropdown);


const addBtns = document.querySelectorAll(".item__add");


async function cartCount() {
  const url = `cart/count`;
  const cart = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },

  });
  const response = await cart.json();
  const count = +response.items.length;
  //Selecting Cart Count Span Element
  const countSpan = document.getElementById("cartCount");
  countSpan.innerHTML = count;
  return;
}



async function postCart(id) {
  const url = `cart/${id}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // The content to update
    body: JSON.stringify({}), //No Body Or Payload
  });
  cartCount(); //Updating Cart Count
  return;
}



//Change + Sign to Tick Sign After Item Added to Cart
function changetoTick(event) {
  event.target.innerHTML = "&check;";
  event.target.classList.add("item__ticked");
  return;
}

//Cart Add Function
async function cartAdd(event) {
  let itemId = null;

  const btn = event.target;
  const children = btn.parentElement.children;

  //Converting HTML Collection to Array for Using forEach
  Array.from(children).forEach((element) => {
    if (element.id == "itemId") {
      itemId = element.value;
    }
  });
  changetoTick(event);
  await postCart(itemId);
  return;
}


//Adding Click Event on Cart Add Button
addBtns.forEach((btn) => {
  btn.addEventListener("click", cartAdd);
});

function sortItems() {
  const sortType = document.getElementById("sort").value;
  const menuItems = Array.from(document.querySelectorAll(".menu__item"));

  menuItems.sort((a, b) => {
    const priceA = parseFloat(a.querySelector(".item__price").innerText.replace('$', ''));
    const priceB = parseFloat(b.querySelector(".item__price").innerText.replace('$', ''));
    const nameA = a.querySelector(".item__name").innerText.toUpperCase();
    const nameB = b.querySelector(".item__name").innerText.toUpperCase();

    switch (sortType) {
      case "price-asc":
        return priceA - priceB;
      case "price-desc":
        return priceB - priceA;
      case "name-asc":
        return nameA.localeCompare(nameB);
      case "name-desc":
        return nameB.localeCompare(nameA);
      default:
        return 0;
    }
  });

  // Cập nhật danh sách sản phẩm trên giao diện
  const menuGrid = document.getElementById("menuItems");
  menuGrid.innerHTML = "";
  menuItems.forEach(item => menuGrid.appendChild(item));
}

