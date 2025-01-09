export const Footer = () => {
  // Increment this number whenever you make changes to the project
  const buildNumber = '16'; // Updated build number
  const buildDate = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <footer className="m-0 pb-8 text-center">
      <div className="mb-2 text-sm text-muted-foreground">
        <span>v{buildNumber}</span>
        <span className="mx-2">•</span>
        <span>{buildDate}</span>
      </div>
      <div className="text-sm text-muted-foreground">
        <a 
          href="https://www.linkedin.com/in/iamrizk" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          Ihab Rizk
        </a>
        {" © 2025"}
      </div>
    </footer>
  );
};