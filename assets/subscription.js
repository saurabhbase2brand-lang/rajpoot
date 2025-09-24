(function () {
  document.addEventListener("DOMContentLoaded", function () {
    const planSelect = document.querySelector('.custom-select');

    if (!planSelect) return;

    planSelect.addEventListener('change', function () {
      const selectedOption = this.options[this.selectedIndex];
      const selectedPlanId = selectedOption.getAttribute('data-plan-id');

      console.log('Selected Plan ID:', selectedPlanId);

      // Get all inputs inside .choose_an_offer_box
      const inputs = document.querySelectorAll('.choose_an_offer_box input[data-plan-id]');

      inputs.forEach(input => {
        const inputPlanId = input.getAttribute('data-plan-id');

        // Check if it matches
        if (inputPlanId === selectedPlanId) {
          input.checked = true;
          console.log(`Match found! Input with data-plan-id "${inputPlanId}" is now checked.`);
        } else {
          input.checked = false;
        }
      });
    });
  });
})();


// cart update data here
  (function() {
    document.addEventListener('DOMContentLoaded', function() {
      var cartButton = document.querySelector('button[id^="ProductSubmitButton-"], button.product-form__submit');
      if (!cartButton) {
        console.warn('Cart button not found!');
        return;
      }

      function updateCartAttributes(selectedInput) {
        if (!selectedInput) return;
        var planId = selectedInput.getAttribute('data-plan-id');
        var plan_price= selectedInput.getAttribute('data-plan-id');
        var frequencyTime = selectedInput.getAttribute('plan_price');
        console.log('Updating cart button with:', { planId: planId,plan_price:plan_price, frequencyTime: frequencyTime });
        cartButton.setAttribute('data-plan-id', planId);
        cartButton.setAttribute('plan_price',plan_price)
        cartButton.setAttribute('frequency_time', frequencyTime);
      }

      // Page load pe checked input find kar ke update karo
      var initiallySelected = document.querySelector('.variant-option-input:checked');
      if (initiallySelected) {
        updateCartAttributes(initiallySelected);
      }

      // Event delegation - body pe listen karo, input ke change ke liye
      document.body.addEventListener('change', function(event) {
        if (event.target.classList.contains('variant-option-input') && event.target.checked) {
          updateCartAttributes(event.target);
        }
      });
    });
  })();





// cart drawer js code 
document.addEventListener('DOMContentLoaded', () => {
  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');

  addToCartForms.forEach(form => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const variantId = formData.get('id');
      const quantity = formData.get('quantity') || 1;

      // Fetch subscription attributes from the "Add to Cart" button
      const submitButton = form.querySelector('button[type="submit"]');
      const planId = submitButton?.getAttribute('data-plan-id');
      const frequencyTime = submitButton?.getAttribute('frequency_time');

      // Build the payload with custom properties
      const payload = {
        items: [{
          id: variantId,
          quantity: parseInt(quantity, 10),
          properties: {
            ...(planId ? { 'plan_id': planId } : {}),
            ...(frequencyTime ? { 'frequency_time': frequencyTime } : {})
          }
        }]
      };

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error adding to cart:', errorData);
          alert(errorData.description || 'Failed to add to cart.');
          return;
        }

        const cartItem = await response.json();
        console.log('Item added:', cartItem);

        // Optionally update cart UI or open cart drawer
        updateCartDrawer(); // You can implement this function below

      } catch (error) {
        console.error('Cart AJAX Error:', error);
      }
    });
  });

  // Optional function to update cart drawer (if using drawer)
  async function updateCartDrawer() {
    try {
      const response = await fetch('/cart?view=drawer'); // or your drawer's endpoint
      const drawerHTML = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(drawerHTML, 'text/html');

      const newDrawerContent = doc.querySelector('.cart-drawer'); // update selector to match your drawer
      const existingDrawer = document.querySelector('.cart-drawer');

      if (newDrawerContent && existingDrawer) {
        existingDrawer.innerHTML = newDrawerContent.innerHTML;
        document.documentElement.classList.add('cart-drawer-open');
      }

    } catch (err) {
      console.error('Error updating cart drawer:', err);
    }
  }
});

(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var cartButton = document.querySelector('button[id^="ProductSubmitButton-"], button.product-form__submit');
    if (!cartButton) {
      console.warn('Cart button not found!');
      return;
    }

    function updateCartAttributes(selectedInput) {
      if (!selectedInput) return;

      var planId = selectedInput.getAttribute('data-plan-id');
      var sellingPrice = selectedInput.getAttribute('data-selling-price');
      var defaultPrice = selectedInput.getAttribute('data-default-price');
      var frequencyTime = selectedInput.getAttribute('frequency_time');

      var finalPrice = sellingPrice || defaultPrice;

      // Optional: convert to number
      finalPrice = parseFloat(finalPrice) || 0;

      console.log('Updating cart button with:', {
        planId, sellingPrice, defaultPrice, finalPrice, frequencyTime
      });

      cartButton.setAttribute('data-plan-id', planId);
      cartButton.setAttribute('data-plan-price', finalPrice);
      cartButton.setAttribute('data-frequency-time', frequencyTime);
    }

    var initiallySelected = document.querySelector('.variant-option-input:checked');
    if (initiallySelected) {
      updateCartAttributes(initiallySelected);
    }

    document.body.addEventListener('change', function(event) {
      if (event.target.classList.contains('variant-option-input') && event.target.checked) {
        updateCartAttributes(event.target);
      }
    });
  });
})();

