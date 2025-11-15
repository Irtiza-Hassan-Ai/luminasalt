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
        <p class="cart-item-price">RS${item.price.toFixed(2)} x ${item.quantity} = RS${itemTotal.toFixed(2)}</p>
      </div>
      <div class="cart-item-controls">
        <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    `
    cartItems.appendChild(cartItem)
  })

  const tax = subtotal * 0.1
  const total = subtotal + tax

  document.getElementById("subtotal").textContent = `RS${subtotal.toFixed(2)}`
  document.getElementById("tax").textContent = `RS${tax.toFixed(2)}`
  document.getElementById("total").textContent = `RS${total.toFixed(2)}`
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
    html += `<li style='margin-bottom: 0.5rem;'>${item.emoji} ${item.name} x${item.quantity} - RS${itemTotal.toFixed(2)}</li>`
  })
  html += "</ul>"

  const tax = subtotal * 0.1
  const total = subtotal + tax

  html += `
    <p><strong>Subtotal:</strong> RS${subtotal.toFixed(2)}</p>
    <p><strong>Tax (10%):</strong> RS${tax.toFixed(2)}</p>
    <p style='font-size: 1.2rem; color: var(--primary-color); border-top: 2px solid var(--border-color); padding-top: 1rem; margin-top: 1rem;'><strong>Total:</strong> RS${total.toFixed(2)}</p>
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
        <td>RS${item.price.toFixed(2)}</td>
        <td>RS${itemTotal.toFixed(2)}</td>
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
      <p><strong>Subtotal:</strong> RS${orderData.subtotal.toFixed(2)}</p>
      <p><strong>Tax (10%):</strong> RS${orderData.tax.toFixed(2)}</p>
      <p class="invoice-total"><strong>Total:</strong> RS${orderData.total.toFixed(2)}</p>
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



// Chatbot functionality with predefined buttons
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatButtons = document.querySelectorAll('.chat-btn');

const CHATBOT_ENDPOINT = "";

// Message responses mapping
const MESSAGE_RESPONSES = {
    'hello': "Hello! Welcome to LUMINA-SALT! I'm here to help you with our premium Himalayan salt lamps. What would you like to know about our products?",
    'product': "We offer a wide range of authentic Himalayan salt lamps:\n\n• Glow Bowl - Rs 1,500\n• Cozy Glow - Rs 2,000\n• Fire Bowl - Rs 3,500\n• Decorative Pink Salt - Rs 5,000\n• Premium White Salt - Rs 2,500\n• Orange Salt Lamp - Rs 3,000\n• Red Salt Crystal - Rs 4,500\n• Bedroom Set - Rs 6,000\n• Office Desk Lamp - Rs 7,000\n• Himalayan Chunk - Rs 9,000\n\nAll our lamps are 100% authentic with 30-day guarantee!",
    'price': "Our Himalayan salt lamps range from Rs 1,500 to Rs 9,000 with special discounts:\n\n✨ All products are currently discounted!\n✨ Free shipping on orders over Rs 10,000\n✨ Bulk orders get additional discounts\n\nWhich product are you interested in?",
    'shipping': "🚚 Shipping Information:\n\n• Fast delivery within 2-3 business days\n• Free shipping on orders over Rs 10,000\n• Safe and secure packaging\n• Nationwide delivery across Pakistan\n• Order tracking available\n\nYour satisfaction is guaranteed!",
    'contact': "📞 Contact LUMINA-SALT:\n\n📧 Email: info.luminasalt@gmail.com\n📞 Phone: 03272581811\n📍 Address: Murtaza Chowrangi, Korangi Industrial Area, Karachi\n⏰ Hours: Mon-Fri: 9AM-6PM, Sat-Sun: 10AM-4PM\n\nWe'd love to hear from you!",
    'benefit': "✨ Benefits of Himalayan Salt Lamps:\n\n• Natural air purification\n• Creates calming ambiance\n• Reduces stress and improves sleep\n• Neutralizes electromagnetic radiation\n• Adds beautiful natural decor\n• Perfect for bedrooms, living rooms, and offices\n\nExperience the natural wellness benefits today!",
    'thanks': "You're very welcome! 🙏\n\nThank you for choosing LUMINA-SALT. If you have any more questions about our Himalayan salt lamps, feel free to ask. We're here to help you create a naturally beautiful space!\n\nHave a wonderful day! 🌟"
};

// Toggle chatbot visibility
chatbotToggle.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
});

chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

// Handle button clicks
chatButtons.forEach(button => {
    button.addEventListener('click', () => {
        const message = button.getAttribute('data-message');
        const buttonText = button.textContent.replace(/[👋🛍️💰🚚📞✨🙏]/g, '').trim();
        
        // Add user message to chat
        addMessage(buttonText, 'user');
        
        // Disable all buttons temporarily
        chatButtons.forEach(btn => btn.disabled = true);
        
        // Show typing indicator
        showTypingIndicator();
        
        // Send message after a short delay to simulate thinking
        setTimeout(() => {
            sendMessage(message);
        }, 1000);
    });
});

// Send message function
async function sendMessage(messageType) {
    try {
        const response = await fetch(CHATBOT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: MESSAGE_RESPONSES[messageType] || "Hello! How can I help you with LUMINA-SALT products?"
            })
        });

        if (response.ok) {
            const data = await response.json();
            removeTypingIndicator();
            
            if (data.response || data.answer || data.message) {
                const botResponse = data.response || data.answer || data.message;
                addMessage(botResponse, 'bot');
            } else {
                // Use our predefined response
                addMessage(MESSAGE_RESPONSES[messageType], 'bot');
            }
        } else {
            throw new Error('API not available');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        removeTypingIndicator();
        
        // Use our predefined response as fallback
        addMessage(MESSAGE_RESPONSES[messageType], 'bot');
    } finally {
        // Re-enable buttons
        chatButtons.forEach(btn => btn.disabled = false);
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const messageP = document.createElement('p');
    // Preserve line breaks in the response
    messageP.innerHTML = text.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(messageP);
    chatbotMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        typingDiv.appendChild(dot);
    }
    
    chatbotMessages.appendChild(typingDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

// Close chatbot when clicking outside
document.addEventListener('click', (e) => {
    if (!chatbotContainer.contains(e.target) && !chatbotToggle.contains(e.target)) {
        chatbotContainer.classList.remove('active');
    }
});

// Prevent closing when clicking inside chatbot
chatbotContainer.addEventListener('click', (e) => {
    e.stopPropagation();
});
