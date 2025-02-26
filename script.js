// Define our three mock deals
const deals = [
    {
        id: 1,
        name: "Neon Laptop",
        image: "https://via.placeholder.com/300x200?text=Neon+Laptop",
        originalPrice: 1500,
        salePrice: 1200,
        discount: "20%",
        buyLink: "#",
        tagline: "Light up your workflow!"
    },
    {
        id: 2,
        name: "Cyber Phone",
        image: "https://via.placeholder.com/300x200?text=Cyber+Phone",
        originalPrice: 800,
        salePrice: 650,
        discount: "18%",
        buyLink: "#",
        tagline: "Dial into the future!"
    },
    {
        id: 3,
        name: "Pixel Drone",
        image: "https://via.placeholder.com/300x200?text=Pixel+Drone",
        originalPrice: 500,
        salePrice: 400,
        discount: "20%",
        buyLink: "#",
        tagline: "Fly high in neon skies!"
    }
];

// Populate the deals section
const dealsContainer = document.querySelector('.deals-container');

deals.forEach(deal => {
    const dealCard = document.createElement('div');
    dealCard.classList.add('deal-card');
    dealCard.innerHTML = `
        <img src="${deal.image}" alt="${deal.name}">
        <h3>${deal.name}</h3>
        <p class="tagline">${deal.tagline}</p>
        <p>Original Price: $${deal.originalPrice}</p>
        <p>Sale Price: $${deal.salePrice}</p>
        <p>Discount: ${deal.discount}</p>
        <a href="${deal.buyLink}" target="_blank">Buy Now</a>
    `;
    dealsContainer.appendChild(dealCard);
});

// Generate 50 unique packages
const packages = [];
const packagesContainer = document.querySelector('.packages-container');

// Helper function to shuffle and pick unique deals
function getRandomDeals(num) {
    // Copy deals array and shuffle
    const shuffled = [...deals].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

for (let i = 1; i <= 50; i++) {
    // Randomly decide to pick 2 or 3 deals; Note: Math.random() returns [0,1)
    const numDeals = Math.random() < 0.5 ? 2 : 3;
    const selectedDeals = getRandomDeals(numDeals);

    const totalSalePrice = selectedDeals.reduce((acc, deal) => acc + deal.salePrice, 0);
    const packagePrice = +(totalSalePrice * 0.85).toFixed(2); // Apply 15% discount
    const savings = +(totalSalePrice - packagePrice).toFixed(2);

    // Create a unique package name
    const packageName = `Cyber Bundle ${i}`;

    // Brag line adjustment based on package price (this is just a sample)
    const bragLine = packagePrice < 1000 
                      ? "Steal of the century!" 
                      : "Unbeatable tech combo!";

    const packageObj = {
        id: i,
        name: packageName,
        items: selectedDeals.map(deal => deal.name),
        totalSalePrice: totalSalePrice.toFixed(2),
        packagePrice: packagePrice.toFixed(2),
        savings: savings.toFixed(2),
        bragLine: bragLine
    };

    packages.push(packageObj);

    // Create package card
    const packageCard = document.createElement('div');
    packageCard.classList.add('package-card');
    packageCard.innerHTML = `
        <h3>${packageObj.name}</h3>
        <p>Items: ${packageObj.items.join(', ')}</p>
        <p>Total Sale Price: $${packageObj.totalSalePrice}</p>
        <p>Package Price (15% off): $${packageObj.packagePrice}</p>
        <p>Savings: $${packageObj.savings}</p>
        <p><em>${packageObj.bragLine}</em></p>
    `;
    packagesContainer.appendChild(packageCard);
}

// Populate the package dropdown in the order form
const packageSelect = document.getElementById('packageSelect');
packages.forEach(pkg => {
    const option = document.createElement('option');
    option.value = pkg.id;
    option.textContent = pkg.name + " ($" + pkg.packagePrice + ")";
    packageSelect.appendChild(option);
});

// Handle order form submission
const orderForm = document.getElementById('orderForm');
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const selectedPackageId = document.getElementById('packageSelect').value;
    
    const selectedPackage = packages.find(pkg => pkg.id == selectedPackageId);
    
    const orderDetails = {
        name,
        email,
        package: selectedPackage
    };
    
    console.log("Order Details:", orderDetails);
    alert("Order submitted successfully!");
    
    // Optionally, reset the form
    orderForm.reset();
}); 