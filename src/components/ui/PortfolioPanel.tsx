import { useGameStore, ZoneType } from '@/stores/gameStore';
import { X } from 'lucide-react';

interface PortfolioContent {
  title: string;
  icon: string;
  content: React.ReactNode;
}

const portfolioData: Record<Exclude<ZoneType, null>, PortfolioContent> = {
  about: {
    title: 'About Me',
    icon: '👤',
    content: (
      <div className="space-y-4">
        <p className="text-lg leading-relaxed">
          Hi! I'm a <span className="gradient-text font-semibold">Full-Stack Developer</span> passionate 
          about creating immersive digital experiences.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          I love turning complex problems into simple, beautiful solutions. When I'm not coding, 
          you'll find me exploring new technologies, contributing to open source, or playing video games.
        </p>
        <div className="flex gap-3 pt-4">
          {[
            { emoji: '🎮', label: 'Gamer' },
            { emoji: '🎨', label: 'Designer' },
            { emoji: '💻', label: 'Developer' },
          ].map((item) => (
            <div key={item.label} className="glass-panel px-4 py-3 flex-1 text-center hover:scale-105 transition-transform">
              <span className="text-2xl">{item.emoji}</span>
              <p className="text-sm text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  skills: {
    title: 'Skills',
    icon: '⚡',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'React', level: 95 },
            { name: 'TypeScript', level: 90 },
            { name: 'Three.js', level: 85 },
            { name: 'Node.js', level: 88 },
            { name: 'Python', level: 80 },
            { name: 'WebGL', level: 75 },
          ].map((skill) => (
            <div key={skill.name} className="glass-panel p-3 hover:scale-[1.02] transition-transform">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground text-sm">{skill.level}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full loading-bar transition-all duration-700 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  projects: {
    title: 'Projects',
    icon: '🚀',
    content: (
      <div className="space-y-3">
        {[
          { name: '3D Portfolio', desc: 'Interactive WebGL experience', tech: ['Three.js', 'React'] },
          { name: 'E-Commerce Platform', desc: 'Full-stack shopping experience', tech: ['Next.js', 'Stripe'] },
          { name: 'AI Chat App', desc: 'Real-time AI conversations', tech: ['OpenAI', 'WebSocket'] },
        ].map((project, i) => (
          <div 
            key={i} 
            className="glass-panel p-4 hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">{project.name}</h4>
                <p className="text-muted-foreground text-sm mb-3">{project.desc}</p>
              </div>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">→</span>
            </div>
            <div className="flex gap-2">
              {project.tech.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  experience: {
    title: 'Experience',
    icon: '💼',
    content: (
      <div className="space-y-4">
        {[
          { role: 'Senior Developer', company: 'Tech Corp', period: '2022 - Present' },
          { role: 'Full-Stack Developer', company: 'StartupXYZ', period: '2020 - 2022' },
          { role: 'Junior Developer', company: 'WebAgency', period: '2018 - 2020' },
        ].map((exp, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-primary mt-2 animate-pulse" />
              {i < 2 && <div className="absolute left-1/2 top-5 w-0.5 h-12 bg-border -translate-x-1/2" />}
            </div>
            <div className="flex-1 glass-panel p-4 hover:scale-[1.01] transition-transform">
              <h4 className="font-semibold text-base">{exp.role}</h4>
              <p className="text-primary font-medium text-sm">{exp.company}</p>
              <p className="text-sm text-muted-foreground mt-1">{exp.period}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  contact: {
    title: 'Contact',
    icon: '✉️',
    content: (
      <div className="space-y-4">
        <p className="text-muted-foreground text-center">
          Let's build something amazing together!
        </p>
        <div className="space-y-2">
          {[
            { icon: '📧', label: 'Email', value: 'hello@myportfolio.dev' },
            { icon: '🐙', label: 'GitHub', value: 'github.com/myprofile' },
            { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/myprofile' },
            { icon: '🐦', label: 'Twitter', value: '@myhandle' },
          ].map((contact) => (
            <div 
              key={contact.label} 
              className="glass-panel p-3.5 flex items-center gap-4 hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {contact.icon}
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{contact.label}</p>
                <p className="font-medium group-hover:text-primary transition-colors">{contact.value}</p>
              </div>
              <span className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export const PortfolioPanel = () => {
  const activeZone = useGameStore((state) => state.activeZone);
  const setActiveZone = useGameStore((state) => state.setActiveZone);

  if (!activeZone) return null;

  const data = portfolioData[activeZone];

  return (
    <div className="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-md z-30 animate-slide-up">
      {/* Backdrop blur for content behind */}
      <div className="absolute inset-0 -m-4 rounded-3xl bg-background/20 backdrop-blur-sm -z-10" />
      
      <div className="glass-panel p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <span className="text-2xl">{data.icon}</span>
            </div>
            <h3 className="text-2xl font-bold gradient-text">{data.title}</h3>
          </div>
          <button
            onClick={() => setActiveZone(null)}
            className="p-2.5 rounded-xl hover:bg-muted transition-colors group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>
        
        {/* Scrollable content */}
        <div className="max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
          {data.content}
        </div>
      </div>
    </div>
  );
};
