import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { NextRequest, NextResponse } from 'next/server';

const getRandomStars = () => {
  const stars = Math.floor(Math.random() * 3) + 3; // Random number between 3-5
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
};

// Function to get random subset of avatar URLs from S3
async function getRandomAvatarUrls(count: number = 10) {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
  });

  try {
    const response = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: process.env.S3_BUCKET_NAME!,
        Prefix: 'avatars/',
      }),
    );

    // Filter out the folder itself and get all avatar URLs
    const allAvatarUrls =
      response.Contents?.filter((obj) => obj.Key !== 'avatars/')?.map(
        (obj) =>
          `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.S3_BUCKET_NAME}/${obj.Key}`,
      ) ?? [];

    // Randomly select 'count' number of avatars
    const randomAvatars = allAvatarUrls
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    return randomAvatars;
  } catch (error) {
    console.error('Error fetching avatar URLs:', error);
    return [];
  }
}

const productDescriptionTemplate = (data, images, getRandomAvatar) => `
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
        padding: 24px;
        border: 1px solid #e5e7eb;
        border-radius: 16px;
        background: white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      .feature-container:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      .feature-image {
        width: 50%;
      }
      
      .feature-image img {
        width: 100%;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      
      .feature-content {
        width: 50%;
        padding: 20px;
      }
      
      .feature-content h2 {
        color: #1a202c;
        font-size: 1.5rem;
        margin-bottom: 1rem;
        font-weight: 600;
      }
      
      .feature-content p {
        color: #4a5568;
        line-height: 1.625;
      }
      
      @media (max-width: 768px) {
        .feature-container {
          flex-direction: column !important;
          padding: 16px;
        }
        
        .feature-image,
        .feature-content {
          width: 100%;
          padding: 12px;
        }
      }
    </style>
  </head>
  <body>

    <div style="text-align: center; margin: 20px 0;">
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 24px;">
    
        <p style="font-weight: 600; font-size: 14px; margin: 0;">Rated 5/5 Excellent</p>
        <img
          src="https://cdn.trustpilot.net/brand-assets/4.1.0/stars/stars-5.svg"
          alt="5-Star Rating"
          width="120"
          height="24"
        />
        <p style="font-weight: 700; color: #4a5568; font-size: 14px; margin: 0;">TrustPilot</p>
      </div>
    </div>

      ${
        data.subheader
          ? `
      <h2 style="font-size: 1.25rem; color: #4B5563; margin-top: 0.5rem; margin-bottom: 1.5rem; font-weight: normal; line-height: 1.4;">
        ${data.subheader}
      </h2>
    `
          : ''
      }

    <p>${data.description}</p>

    <div class="feature-section">
      <h2 style="text-align: center; font-size: 1.8em; margin-bottom: 24px;">Why You'll Love This Product</h2>
      
      ${images
        .slice(0, Math.min(3, data.keyPoints.length))
        .map(
          (image, index) => `
        <div class="feature-container" style="flex-direction: ${index % 2 === 0 ? 'row' : 'row-reverse'};">
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

    <div style="display: flex; justify-content: space-between; max-width: 800px; margin: 0 auto; padding: 0 20px;">
      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
        <svg style="width: 40px; height: 40px; margin-bottom: 8px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
          <path d="M112 0C85.5 0 64 21.5 64 48l0 48L16 96c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 208 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 160l-16 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l16 0 176 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 224l-48 0c-8.8 0-16 7.2-16 16s7.2 16 16 16l48 0 144 0c8.8 0 16 7.2 16 16s-7.2 16-16 16L64 288l0 128c0 53 43 96 96 96s96-43 96-96l128 0c0 53 43 96 96 96s96-43 96-96l32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64 0-32 0-18.7c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7L416 96l0-48c0-26.5-21.5-48-48-48L112 0zM544 237.3l0 18.7-128 0 0-96 50.7 0L544 237.3zM160 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm272 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z"/>
        </svg>
        <h3 style="font-weight: 600; font-size: 14px;">Fast Shipping</h3>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
        <img 
          src="https://img.icons8.com/pulsar-color/48/instagram-check-mark.png" 
          alt="Verified Badge"
          width="40" 
          height="40" 
          style="margin-bottom: 8px;"
          loading="lazy"
          onerror="this.onerror=null; this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><circle cx=%2212%22 cy=%2212%22 r=%2210%22 fill=%22%231DA1F2%22/><path d=%22M9 12l2 2 4-4%22 stroke=%22white%22 stroke-width=%222%22 fill=%22none%22/></svg>';"
        />
        <h3 style="font-weight: 600; font-size: 14px;">Satisfaction Guaranteed</h3>
      </div>

      <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
        <svg style="width: 40px; height: 40px; margin-bottom: 8px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/>
        </svg>
        <h3 style="font-weight: 600; font-size: 14px;">24/7 Support</h3>
      </div>
    </div>

    <div class="reviews">
      <h2>What Our Customers Say</h2>
      ${data.reviews
        .map(
          (review) => `
        <div class="review">
          <div class="review-header">
            <div class="review-avatar">
              <img 
                src="${getRandomAvatar()}"
                alt="${review.name}'s avatar"
                loading="lazy"
                onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><circle cx=%2212%22 cy=%2212%22 r=%2210%22 fill=%22%23ddd%22/></svg>';"
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

//TODO: Make a sports version of this template or a fashion version of this template
//TODO: So that users can choose a template that matches their store
//TODO: Allow user to enter a primary colour that will be used in the template

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const avatarUrls = await getRandomAvatarUrls(10);

    // Create a copy of avatarUrls that we'll use up as we assign avatars
    let availableAvatars = [...avatarUrls];

    // Function to get a unique avatar and remove it from available pool
    const getUniqueAvatar = () => {
      if (availableAvatars.length === 0) {
        // If we run out of unique avatars, refill the pool
        availableAvatars = [...avatarUrls];
      }
      const randomIndex = Math.floor(Math.random() * availableAvatars.length);
      return availableAvatars.splice(randomIndex, 1)[0];
    };

    const template = productDescriptionTemplate(
      data,
      data.images,
      getUniqueAvatar,
    );
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
