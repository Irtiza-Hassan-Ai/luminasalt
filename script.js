const products = [
  { id: 1, name: "Glow Bowl", price: 2000,afterdiscount : 1500, description: "Compact size, perfect for small rooms", image: "images/A (1).jpeg" },
  { id: 2, name: "Cozy Glow", price: 3000,afterdiscount : 2000,  emoji: "🏺", description: "Standard size for bedroom or office", image: "images/A (2).jpeg" },
  { id: 3, name: "Fire Bowl", price: 5000,afterdiscount : 3500,  emoji: "🏺", description: "Extra large statement piece", image: "images/A (4).jpeg" },
  { id: 4, name: "Decorative Pink Salt", price: 6500,afterdiscount : 5000 ,  emoji: "💎", description: "Beautiful pink Himalayan salt", image: "images/A (5).jpeg" },
  { id: 5, name: "Premium White Salt", price: 4000,afterdiscount : 2500,  emoji: "⚪", description: "Pure white lamp salt crystal", image: "images/A (6).jpeg" },
  { id: 6, name: "Orange Salt Lamp", price:5000,afterdiscount : 3000,  emoji: "🟠", description: "Natural orange hue crystal", image: "images/A (7).jpeg" },
  { id: 7, name: "Red Salt Crystal", price: 5500,afterdiscount : 4500,  emoji: "🔴", description: "Deep red mineral salt", image: "images/A (8).jpeg" },
  { id: 8, name: "Bedroom Set", price: 7000, afterdiscount : 6000 , emoji: "🛏️", description: "2 lamps for bedroom", image: "images/A (9).jpeg" },
  { id:  9, name: "Office Desk Lamp", price: 10000,afterdiscount : 7000 ,  emoji: "💼", description: "Compact desk salt lamp", image: "images/A (10).jpeg" },
  { id:  10, name: "Himalayan Chunk", price: 12000,afterdiscount : 9000 ,  emoji: "⛰️", description: "Raw Himalayan salt chunk", image: "images/A (11).jpeg" },
 
];
 

let cart = JSON.parse(localStorage.getItem("cart")) || []

function showPage(pageId) {
  const pages = document.querySelectorAll(".page")
  pages.forEach((page) => page.classList.remove("active"))

  const activePage = document.getElementById(pageId)
  if (activePage) {
    activePage.classList.add("active")

    const navMenu = document.getElementById("navMenu")
    if (navMenu) navMenu.classList.remove("active")
  }

  if (pageId === "products") {
    loadProducts()
  } else if (pageId === "cart") {
    updateCart()
  } else if (pageId === "checkout") {
    updateCheckoutSummary()
  }

  window.scrollTo(0, 0)
}

function loadProducts() {
  const productsGrid = document.getElementById("productsGrid");
  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    const quantity = existingItem ? existingItem.quantity : 1;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}" style="width:100%; height:180px; object-fit:cover; border-radius:10px;">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-price"> <del style='color:grey; font-weight:lighter;'> Rs : ${product.price.toFixed(2)} </del>  </div>
          <div class="product-price"> Rs ${product.afterdiscount.toFixed(2)}  </div>
        <div class="quantity-control">
          <button onclick="changeQuantity(${product.id}, -1)">-</button>
          <input type="number" value="${quantity}" min="1" id="qty-${product.id}" readonly>
          <button onclick="changeQuantity(${product.id}, 1)">+</button>
        </div>
        <button class="btn btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

document.getElementById("navToggle").addEventListener("click", function () {
    const menu = document.getElementById("navMenu");
    menu.classList.toggle("active");
});

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  const quantityInput = document.getElementById(`qty-${productId}`)
  const quantity = Number.parseInt(quantityInput?.value) || 1

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      emoji: product.emoji,
      quantity: quantity,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  alert(`${product.name} added to cart!`)
}

function changeQuantity(productId, change) {
  const input = document.getElementById(`qty-${productId}`)
  const newValue = Math.max(1, Number.parseInt(input.value) + change)
  input.value = newValue
}

function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  document.getElementById("cartCount").textContent = totalItems
}

function updateCart() {
  const cartItems = document.getElementById("cartItems")
  cartItems.innerHTML = ""

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <button class="btn btn-primary" onclick="showPage('products')">Continue Shopping</button>
      </div>
    `
    document.getElementById("subtotal").textContent = "$0.00"
    document.getElementById("tax").textContent = "$0.00"
    document.getElementById("total").textContent = "$0.00"
    return
  }

  let subtotal = 0

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity
    subtotal += itemTotal

    const cartItem = document.createElement("div")
    cartItem.className = "cart-item"
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <h3>${item.emoji} ${item.name}</h3>
        <p class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `
    cartItems.appendChild(cartItem)
  })

  const tax = subtotal * 0.1
  const total = subtotal + tax

  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`
  document.getElementById("tax").textContent = `$${tax.toFixed(2)}`
  document.getElementById("total").textContent = `$${total.toFixed(2)}`
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId)
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  updateCart()
}

function goToCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty!")
    return
  }
  showPage("checkout")
}

function updateCheckoutSummary() {
  const summary = document.getElementById("checkoutSummary")
  let subtotal = 0

  let html = "<ul style='margin-bottom: 1rem; list-style: none; padding: 0;'>"
  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity
    subtotal += itemTotal
    html += `<li style='margin-bottom: 0.5rem;'>${item.emoji} ${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}</li>`
  })
  html += "</ul>"

  const tax = subtotal * 0.1
  const total = subtotal + tax

  html += `
    <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
    <p><strong>Tax (10%):</strong> $${tax.toFixed(2)}</p>
    <p style='font-size: 1.2rem; color: var(--primary-color); border-top: 2px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;'><strong>Total:</strong> $${total.toFixed(2)}</p>
  `

  summary.innerHTML = html
}

function processCheckout(event) {
  event.preventDefault()

  const fullName = document.getElementById("fullName").value
  const email = document.getElementById("email").value
  const address = document.getElementById("address").value
  const city = document.getElementById("city").value
  const state = document.getElementById("state").value
  const zip = document.getElementById("zip").value
  const cardNumber = document.getElementById("cardNumber").value

  const orderData = {
    fullName,
    email,
    address,
    city,
    state,
    zip,
    cardNumber,
    orderDate: new Date().toLocaleDateString(),
    items: cart,
    subtotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }

  orderData.tax = orderData.subtotal * 0.1
  orderData.total = orderData.subtotal + orderData.tax

  localStorage.setItem("orderData", JSON.stringify(orderData))
  generateInvoice(orderData)

  cart = []
  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()

  showPage("invoice")
}

function generateInvoice(orderData) {
  const invoiceContent = document.getElementById("invoiceContent")

  let itemsHTML = `
    <div class="invoice-items">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
  `

  orderData.items.forEach((item) => {
    const itemTotal = item.price * item.quantity
    itemsHTML += `
      <tr>
        <td>${item.emoji} ${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.price.toFixed(2)}</td>
        <td>$${itemTotal.toFixed(2)}</td>
      </tr>
    `
  })

  itemsHTML += `
        </tbody>
      </table>
    </div>
  `

  const invoiceNum = Math.floor(Math.random() * 100000)

  const invoiceHTML = `
    <div class="invoice-header">
      <h2>LUMINA-SALT</h2>
      <p>Invoice #${invoiceNum}</p>
    </div>
    
    <div class="invoice-details">
      <div class="invoice-detail-item">
        <strong>Bill To:</strong><br>
        ${orderData.fullName}<br>
        ${orderData.email}<br>
        ${orderData.address}<br>
        ${orderData.city}, ${orderData.state} ${orderData.zip}
      </div>
      <div class="invoice-detail-item">
        <strong>Order Date:</strong> ${orderData.orderDate}<br>
        <strong>Invoice #:</strong> ${invoiceNum}<br>
        <strong>Payment Method:</strong> Card ending in ${orderData.cardNumber.slice(-4)}<br>
      </div>
    </div>
    
    ${itemsHTML}
    
    <div style="text-align: right; padding: 1rem; border-top: 2px solid var(--border-color);">
      <p><strong>Subtotal:</strong> $${orderData.subtotal.toFixed(2)}</p>
      <p><strong>Tax (10%):</strong> $${orderData.tax.toFixed(2)}</p>
      <p class="invoice-total"><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
    </div>
    
    <p style="text-align: center; margin-top: 2rem; color: #999; font-size: 0.9rem;">
      Thank you for your purchase! Your order will be shipped soon.
    </p>
  `

  invoiceContent.innerHTML = invoiceHTML
}

function printInvoice() {
  window.print()
}

function handleContactForm(event) {
  event.preventDefault()
  alert("Thank you for contacting us! We will get back to you soon.")
  event.target.reset()
}

function toggleSignup(event) {
  event.preventDefault()
  const loginForm = document.getElementById("loginForm")
  const signupForm = document.getElementById("signupForm")

  if (loginForm.style.display === "none") {
    loginForm.style.display = "flex"
    signupForm.style.display = "none"
  } else {
    loginForm.style.display = "flex"
    signupForm.style.display = "none"
  }
}

function handleLogin(event) {
  event.preventDefault()
  const email = document.getElementById("loginEmail").value
  alert(`Welcome back, ${email}!`)
  event.target.reset()
  showPage("home")
}

function handleSignup(event) {
  event.preventDefault()
  alert("Account created successfully! Please log in.")
  toggleSignup(event)
  event.target.reset()
}

updateCartCount()
showPage("home")
