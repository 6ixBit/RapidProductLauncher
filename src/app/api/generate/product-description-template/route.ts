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
      }
      .review {
        background-color: #f9f9f9;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 5px;
      }
      .review-name {
        font-weight: bold;
        margin-bottom: 5px;
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
      <h2>What our customers say</h2>
      ${data.reviews
        .map(
          (review) => `
        <div class="review">
          <div class="review-name">${review.name} ⭐⭐⭐⭐⭐</div>
          <p>${review.content}</p>
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
