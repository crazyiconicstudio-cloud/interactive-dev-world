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
        <p className="text-lg">
          Hi! I'm a <span className="gradient-text font-semibold">Full-Stack Developer</span> passionate 
          about creating immersive digital experiences.
        </p>
        <p className="text-muted-foreground">
          I love turning complex problems into simple, beautiful solutions. When I'm not coding, 
          you'll find me exploring new technologies, contributing to open source, or playing video games.
        </p>
        <div className="flex gap-4 pt-4">
          <div className="glass-panel px-4 py-2">
            <span className="text-2xl">🎮</span>
            <p className="text-sm text-muted-foreground mt-1">Gamer</p>
          </div>
          <div className="glass-panel px-4 py-2">
            <span className="text-2xl">🎨</span>
            <p className="text-sm text-muted-foreground mt-1">Designer</p>
          </div>
          <div className="glass-panel px-4 py-2">
            <span className="text-2xl">💻</span>
            <p className="text-sm text-muted-foreground mt-1">Developer</p>
          </div>
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
            <div key={skill.name} className="glass-panel p-3">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground text-sm">{skill.level}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full loading-bar transition-all duration-500"
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
      <div className="space-y-4">
        {[
          { name: '3D Portfolio', desc: 'Interactive WebGL experience', tech: ['Three.js', 'React'] },
          { name: 'E-Commerce Platform', desc: 'Full-stack shopping experience', tech: ['Next.js', 'Stripe'] },
          { name: 'AI Chat App', desc: 'Real-time AI conversations', tech: ['OpenAI', 'WebSocket'] },
        ].map((project, i) => (
          <div key={i} className="glass-panel p-4 hover:scale-[1.02] transition-transform cursor-pointer">
            <h4 className="font-semibold text-lg">{project.name}</h4>
            <p className="text-muted-foreground text-sm mb-2">{project.desc}</p>
            <div className="flex gap-2">
              {project.tech.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">
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
            <div className="w-3 h-3 rounded-full bg-primary mt-2 animate-pulse-glow" />
            <div className="flex-1 glass-panel p-4">
              <h4 className="font-semibold">{exp.role}</h4>
              <p className="text-muted-foreground">{exp.company}</p>
              <p className="text-sm text-muted-foreground">{exp.period}</p>
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
        <p className="text-muted-foreground">
          Let's build something amazing together!
        </p>
        <div className="space-y-3">
          {[
            { icon: '📧', label: 'Email', value: 'hello@myportfolio.dev' },
            { icon: '🐙', label: 'GitHub', value: 'github.com/myprofile' },
            { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/myprofile' },
            { icon: '🐦', label: 'Twitter', value: '@myhandle' },
          ].map((contact) => (
            <div key={contact.label} className="glass-panel p-3 flex items-center gap-3 hover:scale-[1.02] transition-transform cursor-pointer">
              <span className="text-xl">{contact.icon}</span>
              <div>
                <p className="text-sm text-muted-foreground">{contact.label}</p>
                <p className="font-medium">{contact.value}</p>
              </div>
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
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{data.icon}</span>
            <h3 className="text-2xl font-bold gradient-text">{data.title}</h3>
          </div>
          <button
            onClick={() => setActiveZone(null)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto pr-2">
          {data.content}
        </div>
      </div>
    </div>
  );
};
