import { useEffect, useState } from 'react';

export const MobileFallback = () => {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
        ('ontouchstart' in window && window.innerWidth < 1024) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show loading state until we determine device type
  if (isMobile === null) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🚗</div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="min-h-screen p-6">
        {/* Header */}
        <header className="text-center mb-12 pt-8">
          <div className="text-6xl mb-4">🚗</div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Developer Portfolio
          </h1>
          <p className="text-muted-foreground">
            Best experienced on desktop with keyboard controls
          </p>
        </header>

        {/* Sections */}
        <div className="space-y-8 max-w-lg mx-auto">
          {/* About */}
          <section className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">👤</span>
              <h2 className="text-2xl font-bold">About Me</h2>
            </div>
            <p className="text-muted-foreground">
              Full-Stack Developer passionate about creating immersive digital experiences.
              I love turning complex problems into simple, beautiful solutions.
            </p>
          </section>

          {/* Skills */}
          <section className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚡</span>
              <h2 className="text-2xl font-bold">Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'TypeScript', 'Three.js', 'Node.js', 'Python', 'WebGL'].map((skill) => (
                <span key={skill} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🚀</span>
              <h2 className="text-2xl font-bold">Projects</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold">3D Portfolio</h4>
                <p className="text-sm text-muted-foreground">Interactive WebGL experience</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold">E-Commerce Platform</h4>
                <p className="text-sm text-muted-foreground">Full-stack shopping experience</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold">AI Chat App</h4>
                <p className="text-sm text-muted-foreground">Real-time AI conversations</p>
              </div>
            </div>
          </section>

          {/* Experience */}
          <section className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💼</span>
              <h2 className="text-2xl font-bold">Experience</h2>
            </div>
            <div className="space-y-3">
              <div className="border-l-2 border-primary pl-4">
                <h4 className="font-semibold">Senior Developer</h4>
                <p className="text-sm text-muted-foreground">Tech Corp • 2022 - Present</p>
              </div>
              <div className="border-l-2 border-primary/60 pl-4">
                <h4 className="font-semibold">Full-Stack Developer</h4>
                <p className="text-sm text-muted-foreground">StartupXYZ • 2020 - 2022</p>
              </div>
              <div className="border-l-2 border-primary/30 pl-4">
                <h4 className="font-semibold">Junior Developer</h4>
                <p className="text-sm text-muted-foreground">WebAgency • 2018 - 2020</p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="glass-panel p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">✉️</span>
              <h2 className="text-2xl font-bold">Contact</h2>
            </div>
            <div className="space-y-2">
              <a href="mailto:hello@myportfolio.dev" className="block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                📧 hello@myportfolio.dev
              </a>
              <a href="#" className="block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                🐙 github.com/myprofile
              </a>
              <a href="#" className="block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                💼 linkedin.com/in/myprofile
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pb-8 text-muted-foreground text-sm">
          <p>Visit on desktop for the full 3D experience 🎮</p>
        </footer>
      </div>
    </div>
  );
};

export default MobileFallback;
