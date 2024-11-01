import { NextRequest, NextResponse } from 'next/server';

const getRandomStars = () => {
  const stars = Math.floor(Math.random() * 3) + 3; // Random number between 3-5
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

const productDescriptionTemplate = (data, images) => `
  <html lang="en">
  <head>
    <title>${data.title} - Product Page</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      h1 {
        font-size: 2.5em;
        color: #000;
        margin-bottom: 10px;
      }
      h2 {
        font-size: 1.8em;
        color: #333;
        margin-top: 30px;
      }
      .price {
        font-size: 1.5em;
        font-weight: bold;
        color: #000;
        margin: 20px 0;
      }
      ul {
        padding-left: 20px;
      }
      li {
        margin-bottom: 10px;
      }
      .reviews {
        margin-top: 40px;
        background-color: #f8f9fa;
        padding: 40px 20px;
        border-radius: 12px;
      }
      
      .reviews h2 {
        text-align: center;
        margin-bottom: 30px;
        color: #2d3748;
      }
      
      .review {
        background-color: white;
        padding: 24px;
        margin-bottom: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s ease;
      }
      
      .review:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      
      .review-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        gap: 12px;
      }
      
      .review-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .review-avatar img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .review-info {
        flex-grow: 1;
      }
      
      .review-name {
        font-weight: 600;
        color: #2d3748;
        margin-bottom: 4px;
      }
      
      .review-stars {
        color: #f6ad55;
        letter-spacing: 2px;
      }
      
      .review-content {
        color: #4a5568;
        line-height: 1.6;
        font-size: 0.95em;
        font-style: italic;
      }
      
      .feature-section {
        margin: 48px 0;
      }
      
      .feature-container {
        display: flex;
        align-items: center;
        gap: 32px;
        margin: 48px 0;
      }
      
      .feature-container:nth-child(even) {
        flex-direction: row-reverse;
      }
      
      .feature-image {
        width: 50%;
      }
      
      .feature-image img {
        width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .feature-content {
        width: 50%;
      }
      
      .feature-title {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      
      @media (max-width: 768px) {
        .feature-container {
          flex-direction: column !important;
        }
        
        .feature-image,
        .feature-content {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
     <div style="text-align: center; margin: 20px 0;">
     <div style="display: flex; justify-content: center; align-items: center; gap: 16px; margin-bottom: 24px;">
      <p style="font-weight: bold;"> Trusted by 5,000+ Customers</p>
      <img
        src="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-5.svg"
        alt="5-Star Rating"
        width="120"
        height="24"
      />
    </div>

      <div style="display: flex; justify-content: space-between; max-width: 800px; margin: 0 auto; padding: 0 20px;">
        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
            <svg style="width: 40px; height: 40px; margin-bottom: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
          </svg>
          <h3 style="font-weight: 600; font-size: 14px;">Fast Shipping</h3>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
          <svg class="w-10 h-10" style="width: 40px; height: 40px; margin-bottom: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 style="font-weight: 600; font-size: 14px;">Satisfaction Guaranteed</h3>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
            <svg style="width: 40px; height: 40px; margin-bottom: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <h3 style="font-weight: 600; font-size: 14px;">24/7 Support</h3>
        </div>
      </div>
    </div>
    <p>${data.description}</p>


    <div class="feature-section">
      <h2 style="text-align: center; font-size: 1.8em; margin-bottom: 24px;">Why You'll Love This Product</h2>
      
      ${images
        .slice(0, Math.min(3, data.keyPoints.length))
        .map(
          (image, index) => `
        <div class="feature-container">
          <div class="feature-image">
            <img 
              src="${image}"
              alt="Feature ${index + 1}"
              width="400"
              height="400"
            />
          </div>
          <div class="feature-content">
    
            <p>${data.keyPoints[index]}</p>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>

    <div class="reviews">
      <h2>What Our Customers Say</h2>
      ${data.reviews
        .map(
          (review, index) => `
        <div class="review">
          <div class="review-header">
            <div class="review-avatar">
              <img 
                src="${images[index % images.length]}"
                alt="${review.name}'s avatar"
              />
            </div>
            <div class="review-info">
              <div class="review-name">${review.name}</div>
              <div class="review-stars">${getRandomStars()}</div>
              <div style="color: #28a745; font-size: 12px;">✓ Verified Purchase</div>
            </div>
          </div>
          <div class="review-content">
            "${review.content}"
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  </body>
</html>
`;

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const template = productDescriptionTemplate(data, data.images);
    return NextResponse.json({ template });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message:
      'This route is for generating product description templates. Use POST to generate a template.',
  });
}
