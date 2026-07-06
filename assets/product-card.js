const SELECTED_SWATCH_CLASSES = ['ring-1!', 'ring-offset-1!', 'ring-[#0A4874]!', 'ring-offset-white!'];

class ProductCard extends HTMLElement {
  constructor() {
    super();

    const dataEl = this.querySelector('[data-product-card-variants]');
    this.variants = dataEl ? JSON.parse(dataEl.textContent) : [];

    this.image = this.querySelector('[data-product-card-image]');
    this.media = this.querySelector('[data-product-card-media]');
    this.badge = this.querySelector('[data-product-card-badge]');
    this.priceSale = this.querySelector('[data-product-card-price-sale]');
    this.priceCompare = this.querySelector('[data-product-card-price-compare]');
    this.swatches = Array.from(this.querySelectorAll('[data-product-card-swatch]'));

    this.currentVariant =
      this.variants.find((variant) => variant.selected) ||
      this.variants.find((variant) => variant.available) ||
      this.variants[0];

    this.swatches.forEach((swatch) => {
      swatch.addEventListener('click', (event) => {
        event.preventDefault();
        this.selectColor(swatch.dataset.color);
      });
    });

    if (this.media) {
      this.media.addEventListener('mouseenter', () => this.showHoverImage());
      this.media.addEventListener('mouseleave', () => this.showMainImage());
    }
  }

  selectColor(color) {
    const variant = this.variants.find((item) => item.color === color);
    if (!variant) return;

    this.currentVariant = variant;
    this.showMainImage();
    this.updatePrice(variant);
    this.updateSwatchSelection(color);
  }

  showMainImage() {
    if (this.image && this.currentVariant && this.currentVariant.image) {
      this.image.src = this.currentVariant.image;
    }
  }

  showHoverImage() {
    if (this.image && this.currentVariant && this.currentVariant.hoverImage) {
      this.image.src = this.currentVariant.hoverImage;
    }
  }

  updatePrice(variant) {
    if (variant.onSale) {
      this.badge.classList.remove('hidden');
      this.priceCompare.classList.remove('hidden');
      // Formatted price strings come from the shop's own trusted `money` filter
      // (its output can legitimately include markup, e.g. `<span class="money">`,
      // depending on the shop's currency formatting settings), so innerHTML here
      // mirrors how the server-rendered initial price is inserted.
      this.priceCompare.innerHTML = variant.compareAtPriceFormatted;
    } else {
      this.badge.classList.add('hidden');
      this.priceCompare.classList.add('hidden');
    }
    this.priceSale.classList.toggle('text-[#FF0000]', variant.onSale);
    this.priceSale.classList.toggle('text-[#111111]', !variant.onSale);
    this.priceSale.innerHTML = variant.priceFormatted;
  }

  updateSwatchSelection(color) {
    this.swatches.forEach((swatch) => {
      const isSelected = swatch.dataset.color === color;
      swatch.setAttribute('aria-checked', String(isSelected));
      SELECTED_SWATCH_CLASSES.forEach((className) => {
        swatch.classList.toggle(className, isSelected);
      });
    });
  }
}

if (!customElements.get('product-card')) {
  customElements.define('product-card', ProductCard);
}
