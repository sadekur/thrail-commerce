const requireContext = require.context(".", true, /\.(js|jsx|tsx)$/);
// requireContext.keys().forEach(requireContext);
const activeBlocks = window.THRAILCOMMERCE.activeBlocks || [];

// Function to check if a path matches any active block
const isActiveBlock = (path) => {
    return activeBlocks.some(block => path.includes(block));
};

// Load only the active blocks
requireContext.keys().forEach(path => {
    if (isActiveBlock(path)) {
        requireContext(path);
    }
});
