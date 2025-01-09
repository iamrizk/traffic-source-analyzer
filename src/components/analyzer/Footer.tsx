export const Footer = () => {
  // Increment this number whenever you make changes to the project
  const buildNumber = '14'; // Updated to reflect current number of changes
  const buildDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <footer className="m-0 pb-8 text-center">
      <div className="mb-2 text-sm text-muted-foreground">
        <span>Build #{buildNumber}</span>
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