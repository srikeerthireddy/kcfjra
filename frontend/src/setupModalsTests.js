
// setupTests.js
// import '@testing-library/jest-dom/extend-expect';
import Modal from 'react-modal';

const setupModal = () => {
  // Create a div with id 'root' and append it to the document body
  const root = document.createElement('div');
  root.setAttribute('id', 'root');
  document.body.appendChild(root);

  // Set the app element to the newly created div
  Modal.setAppElement(root);
};

setupModal();

// Optional: You can export setupModal to use in other setup files if needed
export { setupModal };
