const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <span className="text-base font-bold font-display tracking-tight text-primary mb-4 block">
                Pixel Cyber Tech
              </span>
              <div className="space-y-2 text-base text-muted-foreground">
                <a href="mailto:shivansh@pixlcyber.com" className="block hover:text-primary transition-colors">
                  shivansh@pixlcyber.com
                </a>
                <a href="tel:+916304484526" className="block hover:text-primary transition-colors">
                  +91 6304484526
                </a>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <span className="text-base text-muted-foreground/60 font-mono text-right">
                Built with React + Vite<br/>
                Hosted somewhere secure (obviously)
              </span>
              <span className="text-base text-muted-foreground font-mono">
                © 2026 Pixel Cyber Tech
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
