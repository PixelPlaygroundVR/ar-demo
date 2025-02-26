document.addEventListener('DOMContentLoaded', () => {
  /*----------------------------*
   * Background Music & Sounds  *
   *----------------------------*/
  // Background track (looped at low volume)
  const bgAudio = new Audio('sounds/cyberpunk-bg.mp3');
  bgAudio.loop = true;
  bgAudio.volume = 0.2;
  bgAudio.play().catch(() => {
    // User interaction might be required on some mobile browsers
    console.log('Background audio playback initiated on user interaction.');
  });

  // Hover sound
  const hoverSound = new Audio('sounds/hover.mp3');
  hoverSound.volume = 0.5;

  // Function to play hover sound
  function playHoverSound() {
    hoverSound.currentTime = 0;
    hoverSound.play();
  }

  /*--------------------------*
   * Code Rain Animation Code *
   *--------------------------*/
  const canvas = document.getElementById('codeRain');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const fontSize = 16;
  const columns = Math.floor(width / fontSize);
  const drops = Array(columns).fill(1);
  const characters = '01HACKTHEPLANET';

  function drawCodeRain() {
    // Translucent BG to create trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);
    
    ctx.fillStyle = '#00ff00';
    ctx.font = fontSize + 'px Courier New';
    
    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctx.fillText(text, x, y);
      // Reset drop after reaching bottom with a random chance
      if (y > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(drawCodeRain, 33);
  
  // Resize canvas on window resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
  
  /*-----------------------------*
   * Device Orientation Tilt UI  *
   *-----------------------------*/
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      const beta = e.beta;   // x-rotation [-180,180]
      const gamma = e.gamma; // y-rotation [-90,90]
      // Map device orientation to a slight tilt on main content
      document.body.style.transform = `rotateX(${beta / 20}deg) rotateY(${gamma / 20}deg)`;
    });
  }
  
  /*--------------------------*
   * Deals and Packages Data  *
   *--------------------------*/
  const deals = [
    {
      id: 1,
      name: "Neon Laptop",
      image: "https://via.placeholder.com/300x200?text=Neon+Laptop",
      originalPrice: 1500,
      salePrice: 1200,
      discount: "20%"
    },
    {
      id: 2,
      name: "Cyber Phone",
      image: "https://via.placeholder.com/300x200?text=Cyber+Phone",
      originalPrice: 800,
      salePrice: 650,
      discount: "18%"
    },
    {
      id: 3,
      name: "Pixel Drone",
      image: "https://via.placeholder.com/300x200?text=Pixel+Drone",
      originalPrice: 500,
      salePrice: 400,
      discount: "20%"
    }
  ];
  
  /*-----------------------*
   * Populate Deals Cards  *
   *-----------------------*/
  const dealsContainer = document.querySelector('.deals-container');
  deals.forEach(deal => {
    const card = document.createElement('div');
    card.classList.add('deal-card');
    
    card.innerHTML = `
      <img src="${deal.image}" alt="${deal.name}">
      <h3>${deal.name}</h3>
      <p>Original Price: $${deal.originalPrice}</p>
      <p>Sale Price: $${deal.salePrice}</p>
      <p>Discount: ${deal.discount}</p>
      <a class="ar-btn" href="ar.html?model=${encodeURIComponent(deal.name)}">View in AR</a>
    `;
    
    // Play hover sound on mouseenter
    card.addEventListener('mouseenter', playHoverSound);
    
    dealsContainer.appendChild(card);
  });
  
  /*--------------------------*
   * Generate Package Cards   *
   *--------------------------*/
  const packages = [];
  const packagesContainer = document.querySelector('.packages-container');
  
  // Helper: shuffle and pick 'num' random deals
  function getRandomDeals(num) {
    const shuffled = [...deals].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, num);
  }
  
  for (let i = 1; i <= 50; i++) {
    const numDeals = Math.random() < 0.5 ? 2 : 3;
    const selectedDeals = getRandomDeals(numDeals);
    
    const totalOriginal = selectedDeals.reduce((sum, d) => sum + d.originalPrice, 0);
    const totalSale = selectedDeals.reduce((sum, d) => sum + d.salePrice, 0);
    const packagePrice = +(totalSale * 0.85).toFixed(2); // 15% discount
    const savings = +(totalSale - packagePrice).toFixed(2);
    
    const pkg = {
      id: i,
      name: `Cyber Bundle ${i}`,
      items: selectedDeals.map(d => d.name),
      totalOriginal: totalOriginal.toFixed(2),
      totalSale: totalSale.toFixed(2),
      packagePrice: packagePrice.toFixed(2),
      savings: savings.toFixed(2)
    };
    packages.push(pkg);
    
    const pkgCard = document.createElement('div');
    pkgCard.classList.add('package-card');
    pkgCard.innerHTML = `
      <h3>${pkg.name}</h3>
      <p>Items: ${pkg.items.join(', ')}</p>
      <p>Total Original: $${pkg.totalOriginal}</p>
      <p>Total Sale: $${pkg.totalSale}</p>
      <p>Package Price (15% off): $${pkg.packagePrice}</p>
      <p>Savings: $${pkg.savings}</p>
      <a class="ar-btn" href="ar.html?model=package-${pkg.id}">View in AR</a>
      <button class="order-btn" data-package-id="${pkg.id}">Order Now</button>
    `;
    
    // Add hover listener for sound
    pkgCard.addEventListener('mouseenter', playHoverSound);
    
    packagesContainer.appendChild(pkgCard);
  }
  
  /*--------------------------------*
   * Populate Order Modal Dropdown  *
   *--------------------------------*/
  const orderPackageSelect = document.getElementById('orderPackage');
  packages.forEach(pkg => {
    const option = document.createElement('option');
    option.value = pkg.id;
    option.textContent = `${pkg.name} ($${pkg.packagePrice})`;
    orderPackageSelect.appendChild(option);
  });
  
  /*-----------------------------*
   * Order Modal Functionality   *
   *-----------------------------*/
  const orderModal = document.getElementById('orderModal');
  const closeButton = document.querySelector('.close-button');
  const orderForm = document.getElementById('orderForm');
  
  // Open modal when any Order Now button is clicked
  const orderButtons = document.querySelectorAll('.order-btn');
  orderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      playHoverSound();
      const pkgId = btn.getAttribute('data-package-id');
      orderPackageSelect.value = pkgId;
      orderModal.style.display = 'flex';
    });
  });
  
  // Close modal when the close button is clicked
  closeButton.addEventListener('click', () => {
    orderModal.style.display = 'none';
  });
  
  // Submit order form
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('orderName').value;
    const email = document.getElementById('orderEmail').value;
    const packageId = orderPackageSelect.value;
    const selectedPkg = packages.find(p => p.id == packageId);
    
    const orderDetails = { name, email, package: selectedPkg };
    console.log("Order Details:", orderDetails);
    alert("Order submitted successfully!");
    orderForm.reset();
    orderModal.style.display = 'none';
  });
  
  /*------------------------------*
   * Animate Cards Pop-in Effect  *
   *------------------------------*/
  const allCards = document.querySelectorAll('.deal-card, .package-card');
  allCards.forEach((card, index) => {
    card.style.opacity = 0;
    setTimeout(() => {
      card.style.transition = "opacity 0.5s ease-out";
      card.style.opacity = 1;
    }, index * 50);
  });
}); 