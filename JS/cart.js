// Panier sauvegardé dans localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");

// Rendu du panier
function renderCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} x${item.qty}</span>
      <div>
        <button onclick="decreaseQty(${index})">-</button>
        <button onclick="increaseQty(${index})">+</button>
        <button onclick="removeItem(${index})">x</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  cartTotal.textContent = total.toLocaleString("fr-FR");
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Fonctions panier
function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function increaseQty(index) {
  cart[index].qty++;
  renderCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty--;
  } else {
    cart.splice(index, 1);
  }
  renderCart();
}

clearCartBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
});

// Commander via WhatsApp
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  let message = "Bonjour, je souhaite commander :%0A";
  let total = 0;
  cart.forEach(item => {
    message += `- ${item.name} x${item.qty} = ${(item.price * item.qty).toLocaleString("fr-FR")} FCFA%0A`;
    total += item.price * item.qty;
  });
  message += `%0ATotal : ${total.toLocaleString("fr-FR")} FCFA`;

  // ⚠️ Change ce numéro par ton vrai WhatsApp
  const phone = "+33659012335";
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, "_blank");
});

// Activer les boutons "Ajouter au panier"
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".product-card");
    const name = card.querySelector(".product-name").textContent;
    const price = parseInt(card.querySelector(".price").dataset.price, 10);
    addToCart(name, price);
  });
});

// Affichage initial
renderCart();
