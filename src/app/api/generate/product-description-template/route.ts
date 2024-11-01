import { NextRequest, NextResponse } from 'next/server';

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
    <p>${data.description}</p>

    <h2>Key Features</h2>
    <ul>
      ${data.keyPoints.map((point) => `<li>${point}</li>`).join('')}
    </ul>

    <div class="feature-section">
      <h2 style="text-align: center; font-size: 1.8em; margin-bottom: 24px;">Product Features</h2>
      
      ${images
        .slice(0, 3)
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
            <h3 class="feature-title">Feature ${index + 1}</h3>
            <p>Description for Feature ${index + 1}. Replace this text with actual feature description.</p>
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
              <div class="review-stars">★★★★★</div>
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
