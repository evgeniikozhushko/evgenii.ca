import { createClient } from "contentful";

// Ryan's super code block - take data from Contentful

// Initialize Contentful Client
const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID!,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN!,
});

// Fetch all posts - The Magic Function
const getAllPosts = async (options = {}) => {
  try {
    return await contentfulClient.getEntries({
      content_type: 'post',
      ...options // Allow passing any additional query parameters like order
    })
  }
  catch (error) {
    console.error('Error fetching data from Contentful', error)
  }
}

// Helper function to get posts in a specific order
const getOrderedPosts = async (orderField = 'sys.createdAt', direction = 'desc') => {
  return getAllPosts({
    order: `${direction === 'desc' ? '-' : ''}${orderField}`
  });
}

// Fetch light mode logo
// const fetchLightLogo = async () => {
//   try {
//     const asset = await contentfulClient.getAsset('5a9M6OeE3ahl6acbTv7x9c'); // Light mode logo asset ID
//     if (asset.fields.file) {
//       console.log("asset.theme.files", asset.fields.file)
//       return `https:${asset.fields.file.url}`;
//     }
//     console.error('Error fetching light logo from Contentful: Asset file is undefined');
//     return null;
//   } catch (error) {
//     console.error('Error fetching light logo from Contentful:', error);
//     return null;
//   }
// };

// Fetch dark mode logo
// const fetchDarkLogo = async () => {
//   try {
//     const asset = await contentfulClient.getAsset('4VXJNCzxU1zqhVrUQLGMYO'); // Dark mode logo asset ID
//     if (asset.fields.file) {
//       return `https:${asset.fields.file.url}`;
//     }
//     console.error('Error fetching dark logo from Contentful: Asset file is undefined');
//     return null;
//   } catch (error) {
//     console.error('Error fetching dark logo from Contentful:', error);
//     return null;
//   }
// };

// // Fetch logo by asset ID
// const fetchLogo = async () => {
//   try {
//     const asset = await contentfulClient.getAsset('5a9M6OeE3ahl6acbTv7x9c'); // Previous logo asset ID 1stL718OQUXgGrjw7gglNE  
//     console.log('Fetched logo asset:', asset); // Debugging output
//     // Replace with your actual asset ID
//     if (asset.fields.file) {
//       return `https:${asset.fields.file.url}`;
//     } else {
//       console.error('Error fetching logo from Contentful: Asset file is undefined');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching logo from Contentful:', error);
//     return null;
//   }
// };
  
// // Fetch Intro Image by asset ID
// const fetchIntroImage = async () => {
//   try {
//     const asset = await contentfulClient.getAsset('62PiAERiHiE9luyQW07dY5');
//     console.log('Fetched Intro image asset:', asset); // Debugging output
//     // Replace with your actual asset ID
//     if (asset.fields.file) {
//       return `https:${asset.fields.file.url}`;
//     } else {
//       console.error('Error fetching logo from Contentful: Asset file is undefined');
//       return null;
//     }
//   } catch (error) {
//     console.error('Error fetching logo from Contentful:', error);
//     return null;
//   }
// };

export { contentfulClient, getAllPosts, getOrderedPosts }; // Subtracted because not fetching from Contentful - fetchLightLogo, fetchDarkLogo 
