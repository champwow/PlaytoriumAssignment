let cart = [];
let sumPrice = 0;
let campaigns = [];
let yourPoint = 68;

function addToCart(name, price, category) {
  cart.push({name: name, price: price, category: category}); 
  updateCart(); 
}
function updateCart() {
  const cartList = document.getElementById("cart-list");
  cartList.innerHTML = '';
  cart.forEach((product) => {
    cartList.innerHTML += ` <li class="list-group-item">${product.name} ราคา <span>${product.price}</span></li>`;
  });
  addPrice(cart);
}

function updateCampaign() {
  const Campaign = document.getElementById("Campaign-list");
  Campaign.innerHTML = '';
  campaigns.forEach((campaign) => {
    Campaign.innerHTML += ` <li class="list-group-item">${campaign.Campaign}</span></li>`;
  });
  
  addPrice(cart);
}

function addPrice() {
  sumPrice = 0;
  const ansPrice = document.getElementById("sumPrice");
  ansPrice.innerHTML = ""
  cart.forEach((product) => {
    sumPrice += product.price
  });
  ansPrice.innerHTML += `${sumPrice}`
}

function addCampaign(Campaign, type,  priority) {
  if (!campaigns.some(item => item.type === type)) {
    campaigns.push({Campaign: Campaign, type: type, priority: priority});
  }
  else {
    const index = campaigns.findIndex(item => item.type === type);
    if (index !== -1) {
      campaigns[index] = { Campaign: Campaign, type: type, priority: priority };
    }
  }
  campaigns.sort((a, b) => b.priority - a.priority);
  updateCampaign()
}

function clearCart() {
  cart = [];
  updateCart();
}
function clearCampaign() {
  campaigns = [];
  updateCampaign();
}
  

function calculate() {
  let CouponDiscount = 0;
  let OntopDiscount = 0;
  let SeasonalDiscount = 0;
  const Price = document.getElementById("sumPrice").innerHTML;
  campaigns.forEach(campaign => {
    if (campaign.type === "Coupon") {
      CouponDiscount = CouponCal(Price, campaign.Campaign);
    }
    else if (campaign.type === "On top") {
      OntopDiscount = OntopCal(Price - CouponDiscount, campaign.Campaign);
    }
    else if (campaign.type === "Seasonal") {
      SeasonalDiscount = SeasonalCal(Price - CouponDiscount - OntopDiscount);
    }
    
  });
  const finalPricePrint = document.getElementById("Final-price");
  finalPricePrint.innerHTML =`<p>ราคาหลังหักโปรโมชันคือ  ${Price- CouponDiscount - OntopDiscount - SeasonalDiscount} </p>`;
}

function CouponCal(Price, type,) {
  let finalDiscount = 0;
  let priceForCal = Price;
  let Discounts = 50;
  let Percentage = 10;

  if (type === "Fixed amount") {
    finalDiscount =  Discounts;
  }
  else if (type === "Percentage discount") {
    finalDiscount = (priceForCal * Percentage / 100);
  }
return finalDiscount;
}

function OntopCal(Price, type,) {
  let finalDiscount = 0;
  let priceClothes = 0;
  let priceForCal = 0;
  let Percentage = 15;
  let twentyPercentPrice = 0;
  
  if (type === "Percentage discount by item category") {
    cart.forEach((product) => {
      if (product.category === "clothes") {
        priceClothes += product.price;
      }
      else {
        priceForCal += product.price;
      }
    });
    finalDiscount = (priceClothes * Percentage / 100);
  }
  else if (type === "Discount by points") {
    twentyPercentPrice = (Price * 20 / 100);
    if (yourPoint > twentyPercentPrice) {
      finalDiscount = twentyPercentPrice;
    }
    else { 
      finalDiscount = yourPoint;
    }
  }
  return finalDiscount;
}

function SeasonalCal(Price) {
  EveryPriceForDiscount = 300;
  let finalDiscount = 0;
  Discount = 40;
  console.log(Price, "Price");
  for (let i = 0; i <= Price; i += EveryPriceForDiscount) {
    if (i > 0) {
    finalDiscount += Discount;
    }
  }
  return finalDiscount;
}

fetch("product.json")
  .then((response) => response.json())
  .then((data) => {
    const productList = document.getElementById("product-list");
    data.forEach((product) => {
      productList.innerHTML += `
      <div class="col-12 col-md-4 col-lg-4">
      <div class="card mb-4">
          <img src="https://cdn.discordapp.com/attachments/603631846525501460/1213037171187908628/image.png?ex=660fb366&is=65fd3e66&hm=e84ff1dfb27495b0cc5fc4180ba66ff0467c881d63559a5579c0a0235ef1f8b1&" class="card-img-top" alt="...">
          <div class="card-body">
              <h5 class="card-title">${product.name}</h5>
              <p class="card-text">${product.price} THB</p>
              <button class="btn btn-primary" onclick="addToCart('${product.name}', ${product.price}, '${product.category}')">Add to Cart</button>
          </div>
      </div>
  </div>
            `;
    });
  })
  .catch((error) => console.error("Error fetching JSON:", error));
