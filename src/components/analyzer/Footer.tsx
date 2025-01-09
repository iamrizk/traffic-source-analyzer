export const Footer = () => {
  const buildNumber = import.meta.env.VITE_BUILD_NUMBER || '1';
  const buildDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <footer className="m-0 pb-8 text-center text-gray-600">
      <div className="mb-2 text-sm">
        <span>Build #{buildNumber}</span>
        <span className="mx-2">•</span>
        <span>{buildDate}</span>
      </div>
      <a 
        href="https://www.linkedin.com/in/iamrizk" 
        target="_blank" 
        rel="noopener noreferrer"
        className="hover:text-blue-600 transition-colors"
      >
        Ihab Rizk
      </a>
      {" © 2025"}
    </footer>
  );
};