import { createClient } from "contentful";

// Ryan's super code block - take data from contentful

// Initialize Contentful Client
const contentfulClient = createClient({
  space: import.meta.env.VITE_CONTENTFUL_SPACE_ID!,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN!,

});

// Fetch all posts
const getAllPosts = async () => {

  try {
    return await contentfulClient.getEntries({ content_type: 'post' })
  }
  catch (error) {
    console.error('Error fetching data from contentful', error)
  }
}

// Fetch logo by asset ID
const fetchLogo = async () => {
  try {
    const asset = await contentfulClient.getAsset('3o2vRgsBM5LnzZ9b2YQBUg'); // Previous logo asset ID 1stL718OQUXgGrjw7gglNE  
    console.log('Fetched logo asset:', asset); // Debugging output
    // Replace with your actual asset ID
    if (asset.fields.file) {
      return `https:${asset.fields.file.url}`;
    } else {
      console.error('Error fetching logo from Contentful: Asset file is undefined');
      return null;
    }
  } catch (error) {
    console.error('Error fetching logo from Contentful:', error);
    return null;
  }
};

export { contentfulClient, getAllPosts, fetchLogo };
