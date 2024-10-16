import { NextRequest, NextResponse } from 'next/server';

const productDescriptionTemplate = (data) => `
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
    </style>
  </head>
  <body>
    <h1>${data.title}</h1>
    <p>${data.description}</p>
    <div class="price">Price: ${data.price}</div>
    <h2>Key Features</h2>
    <ul>
      ${data.keyPoints.map((point) => `<li>${point}</li>`).join('')}
    </ul>
    <h2>${data.subHeading}</h2>
    <div class="reviews">
      <h2>Customer Reviews</h2>
      ${data.reviews
        .map(
          (review) => `
        <div class="review">
          <div class="review-name">${review.name}</div>
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
    const template = productDescriptionTemplate(data);
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
