export const liquidTemplate_1_edited = `{% comment %}
  Save this as: templates/product.custom.liquid
{% endcomment %}

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.css">
<script src="https://cdn.jsdelivr.net/npm/swiper@8/swiper-bundle.min.js" async></script>
<script src="https://cdn.tailwindcss.com" async></script>
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    var productThumbs = new Swiper('.product-thumbs', {
      spaceBetween: 10,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    var productSwiper = new Swiper('.product-swiper', {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: productThumbs,
      },
    });

    var testimonialSwiper = new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });

    function incrementQuantity() {
      var quantityInput = document.getElementById('quantity');
      var currentValue = parseInt(quantityInput.value, 10);
      quantityInput.value = currentValue + 1;
    }

    function decrementQuantity() {
      var quantityInput = document.getElementById('quantity');
      var currentValue = parseInt(quantityInput.value, 10);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    }
  });
</script>

<style>
  .testimonial-swiper {
    padding-bottom: 50px;
  }
  .testimonial-swiper .swiper-pagination {
    bottom: 0;
  }
  .testimonial-swiper .swiper-pagination-bullet {
    width: 12px;
    height: 12px;
    background: #4B5563;
    opacity: 0.2;
  }
  .testimonial-swiper .swiper-pagination-bullet-active {
    opacity: 1;
  }
</style>

<div class="container mx-auto px-8 sm:px-6 lg:px-8 xl:max-w-7xl 2xl:max-w-full py-8">
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12">
    {% comment %}Product Images{% endcomment %}
    <div class="product-images">
      <div class="swiper product-swiper">
        <div class="swiper-wrapper">
          {% for image in product.images %}
            <div class="swiper-slide flex items-center justify-center">
              <img 
                src="{{ image.url }}" 
                alt="{{ image.alt }}" 
                class="w-full h-auto rounded-lg"
              >
            </div>
          {% endfor %}
        </div>
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
      </div>

      {% if product.images.size > 1 %}
        <div class="swiper product-thumbs mt-4">
          <div class="swiper-wrapper">
            {% for image in product.images %}
              <div class="swiper-slide opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                <img 
                  src="{{ image.url }}" 
                  alt="{{ image.alt }}" 
                  class="w-full h-20 object-cover rounded-lg"
                >
              </div>
            {% endfor %}
          </div>
        </div>
      {% endif %}
    </div>

    {% comment %}Product Details{% endcomment %}
    <div class="product-details">
      {% comment %}5-Star Reviews{% endcomment %}
      <div class="flex items-center mb-4">
        <div class="flex text-yellow-400">
          {% for i in (1..5) %}
            <svg class="w-10 h-10 fill-current" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          {% endfor %}
        </div>
        <span class="ml-2 text-gray-600 text-lg uppercase font-bold">123 reviews</span>
      </div>

      <h1 class="text-3xl font-bold mb-2">{{ product.title }}</h1>

      {% comment %}Price{% endcomment %}
      <div class="price-container mb-6">
        {% if product.compare_at_price > product.price %}
          <p class="flex items-center">
            <span class="text-3xl font-bold text-red-600">{{ product.price | money }}</span>
            <s class="text-gray-500 ml-2">{{ product.compare_at_price | money }}</s>
            <span class="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded-full text-sm">
              Save {{ product.compare_at_price | minus: product.price | money }}
            </span>
          </p>
        {% else %}
          <p class="text-3xl font-bold">{{ product.price | money }}</p>
        {% endif %}
      </div>

      {% comment %}Key Actions{% endcomment %}
      <div class="space-y-4 mb-6">
        <div class="flex items-center">
          <svg
            class="w-6 h-6 mr-2 text-green-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span class="uppercase text-lg font-semibold">Free shipping on orders over $50</span>
        </div>
        <div class="flex items-center">
          <svg
            class="w-6 h-6 mr-2 text-blue-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="uppercase text-lg font-semibold">30-day money-back guarantee</span>
        </div>
        <div class="flex items-center">
          <svg
            class="w-6 h-6 mr-2 text-purple-500 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <span class="uppercase text-lg font-semibold">Secure checkout</span>
        </div>
      </div>

      {% comment %}Product Form{% endcomment %}
      <div class="space-y-6">
        <input type="hidden" name="id" value="{{ product.selected_or_first_available_variant.id }}">

        {% unless product.has_only_default_variant %}
          {% for option in product.options_with_values %}
            <div class="variant-selection">
              <label class="block text-md font-medium mb-2">
                {{ option.name }}
              </label>
              <select
                name="options[{{ option.name }}]"
                class="w-auto border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {% for value in option.values %}
                  <option
                    value="{{ value | escape }}"
                    {% if option.selected_value == value %}
                      selected="selected"
                    {% endif %}
                  >
                    {{ value }}
                  </option>
                {% endfor %}
              </select>
            </div>
          {% endfor %}
        {% endunless %}

        {% comment %}Quantity Selector{% endcomment %}
        <div class="quantity-selector mb-4">
          <label class="block text-md font-medium mb-2">Quantity</label>
          <div class="flex items-center border border-gray-300 rounded-md w-32">
            <button type="button" class="px-3 py-2 text-gray-600 hover:bg-gray-100" onclick="decrementQuantity()">-</button>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value="1"
              min="1"
              class="w-full text-center border-none focus:ring-0"
              readonly
            >
            <button type="button" class="px-3 py-2 text-gray-600 hover:bg-gray-100" onclick="incrementQuantity()">+</button>
          </div>
        </div>

        {% comment %}Add to Cart Button{% endcomment %}
        <button
          type="submit"
          name="add"
          class="w-full bg-black hover:bg-slate-800 text-white font-medium py-3 px-6 rounded-md transition duration-200 {% unless product.available %}opacity-50 cursor-not-allowed{% endunless %}"
          {% unless product.available %}
            disabled
          {% endunless %}
        >
          {% if product.available %}
            Add to Cart
          {% else %}
            Sold Out
          {% endif %}
        </button>

        {% comment %}Buy Now Button{% endcomment %}
        {% comment %}
          {{ form | payment_button }}
        {% endcomment %}
      </div>

      {% comment %}Trustpilot Badge{% endcomment %}
      <div class="mt-6 flex justify-center">
        <p class="pr-4 font-bold">Trustpilot</p>
        <a target="_blank" rel="noopener">
          <img
            src="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-5.svg"
            alt="Trustpilot rating"
            width="120"
            height="24"
          >
        </a>
      </div>

      {% comment %}3-Column Icon + Text Section{% endcomment %}
      <div class="my-10 flex flex-row justify-between items-start space-x-4 px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center text-center flex-1 min-w-0">
          <svg
            class="w-10 h-10 text-gray-800 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20"></path>
          </svg>
          <h3 class="font-semibold text-sm sm:text-base mb-1">First Class Shipping</h3>
        </div>

        <div class="flex flex-col items-center text-center flex-1 min-w-0">
          <svg
            class="w-10 h-10 text-gray-800 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="font-semibold text-sm sm:text-base mb-1">Money-Back Guarantee</h3>
        </div>

        <div class="flex flex-col items-center text-center flex-1 min-w-0">
          <svg
            class="w-10 h-10 text-gray-800 mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <h3 class="font-semibold text-sm sm:text-base mb-1">24/7 Customer Support</h3>
        </div>
      </div>
    </div>
  </div>

  {% comment %}Full-width sections{% endcomment %}
  <div class="mt-12">
    {% comment %}Testimonial Carousel{% endcomment %}
    <div class="mb-12 relative">
      <h2 class="md:text-5xl text-4xl font-bold my-10">What Our Customers Say</h2>
      <div class="swiper testimonial-swiper">
        <div class="swiper-wrapper">
          {% for i in (1..5) %}
            <div class="swiper-slide">
              <div class="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
                <img src="https://via.placeholder.com/100?text=Customer{{i}}" alt="Customer {{ i }}" class="w-20 h-20 rounded-full mb-4">
                <div class="flex text-yellow-400 mb-2">
                  {% for star in (1..5) %}
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                  {% endfor %}
                </div>
                <p class="text-gray-600 text-center mb-4">
                  "This is testimonial {{ i }}. The product exceeded my expectations. It's well-made, durable, and looks great. I highly recommend it!"
                </p>
                <p class="font-semibold">Happy Customer {{ i }}</p>
              </div>
            </div>
          {% endfor %}
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </div>

    {% comment %}Multi-column Component{% endcomment %}
    <div class="mb-12 space-y-12 lg:space-y-24">
      <h2 class="text-2xl font-bold mb-6 text-center">Product Features</h2>
      {% for i in (1..2) %}
        <div class="flex flex-col {% if i == 1 %}lg:flex-row{% else %}lg:flex-row-reverse{% endif %} items-center gap-8">
          <div class="w-full lg:w-1/2">
            <img
              src="https://images.stockcake.com/public/e/0/b/e0bde8cf-64b8-4959-b5ab-6dde4491eecc_large/warehouse-work-night-stockcake.jpg"
              alt="Feature {{ i }}"
              class="w-full h-auto rounded-lg shadow-lg"
              width="400"
              height="400"
            >
          </div>
          <div class="w-full lg:w-1/2 space-y-4">
            <h3 class="text-xl font-semibold">Feature {{ i }} Heading</h3>
            <p class="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat.
            </p>
          </div>
        </div>
      {% endfor %}
    </div>

{% comment %}FAQ Accordion{% endcomment %}
<div class="mb-12">
  <h2 class="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
  <div class="space-y-4" x-data="{ activeIndex: null }">
    {% assign faqs = 'What are the shipping options?|How long does shipping take?|What is your return policy?|How do I care for this product?'
      | split: '|'
    %}
    {% assign answers = 'We offer standard and express shipping.|Shipping typically takes 3-5 business days.|We offer a 30-day return policy for unused items.|Please refer to the care instructions included with the product.'
      | split: '|'
    %}

    {% for question in faqs %}
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <button
          @click="activeIndex = activeIndex === {{ forloop.index }} ? null : {{ forloop.index }}"
          class="flex justify-between items-center w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        >
          <span class="font-bold text-gray-900">{{ question }}</span>
          <svg
            :class="{'rotate-180': activeIndex === {{ forloop.index }} }"
            class="w-5 h-5 text-gray-500 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          x-show="activeIndex === {{ forloop.index }}"
          x-collapse
          class="px-4 py-3 bg-white border-t border-gray-200"
        >
          <p class="text-gray-700 mt-2">{{ answers[forloop.index0] }}</p>
        </div>
      </div>
    {% endfor %}
  </div>
</div>

  </div>
</div>
`;
