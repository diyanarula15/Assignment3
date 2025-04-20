import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../contexts/PortfolioContext';
import ProjectCard from '../components/Projects/ProjectCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Sound from '../components/Sound';
import { Search, X, Tag, Filter, SlidersHorizontal, Cuboid } from 'lucide-react';
import ARScene from '../components/ARScene';

const projects = [
  {
    title: "Angry Birds",
    type: "Game",
    description: "2D physics simulation with Java & LibGDX.",
    image: "/assets/5bf9eabe-a2c4-417f-a0dc-21c0524b44e9.png",
    link: "https://github.com/diyanarula15/angry-birds-clone",
    tags: ["game", "physics", "java"]
  },
  {
    title: "ResQpet",
    type: "Mobile App",
    description: "Flutter app with Firebase backend for reporting injured animals.",
    image: "/assets/e213d346-a135-47c8-8368-310863217275.png",
    link: "https://github.com/diyanarula15/ResQpet",
    tags: ["mobile", "flutter", "firebase"]
  },
  {
    title: "TempStat",
    type: "Data Processing",
    description: "Real-time processing of 50M+ weather records in C.",
    image: "/assets/df84435f-9aa3-4ec1-8f28-550e2e17b150.png",
    link: "https://github.com/diyanarula15/tempstat",
    tags: ["data", "processing", "c"]
  },
  {
    title: "KUSH",
    type: "Systems / Shell",
    description: "Custom bash/zsh-like shell with piping, redirection, and user-defined commands.",
    image: "/assets/a674f60c-95a9-4e93-ba51-6a4590623b81.png",
    link: "https://github.com/diyanarula15/Kush",
    tags: ["systems", "shell", "c"]
  },
  {
    title: "Directory Management System",
    type: "CLI Tool",
    description: "Command-line system for adding, moving, aliasing, and searching files/folders.",
    image: "/assets/448f6df1-d24b-49ea-a401-6d8438b57dcb.png",
    link: "https://github.com/diyanarula15/Directory-Management-System",
    tags: ["cli", "tool", "system"]
  }
];

type FilterType = 'all' | 'game' | 'mobile' | 'data' | 'systems' | 'cli';

const Projects: React.FC = () => {
  const { setActivePage } = usePortfolio();
  const [filter, setFilter] = useState<FilterType>('all');
  const [visibleProjects, setVisibleProjects] = useState(projects);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)));

  useEffect(() => {
    setActivePage('projects');
    document.title = "Projects - Diya Narula";
    window.scrollTo(0, 0);
  }, [setActivePage]);

  useEffect(() => {
    let filtered = projects;

    if (filter !== 'all') {
      filtered = filtered.filter(project => {
        const type = project.type.toLowerCase();
        switch (filter) {
          case 'game':
            return type.includes('game');
          case 'mobile':
            return type.includes('mobile') || type.includes('app');
          case 'data':
            return type.includes('data');
          case 'systems':
            return type.includes('systems') || type.includes('shell');
          case 'cli':
            return type.includes('cli') || type.includes('tool');
          default:
            return true;
        }
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.type.toLowerCase().includes(term) ||
        project.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    if (activeTags.length > 0) {
      filtered = filtered.filter(project =>
        activeTags.some(tag => project.tags.includes(tag))
      );
    }

    setVisibleProjects(filtered);
  }, [filter, searchTerm, activeTags]);

  const toggleTag = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setFilter('all');
    setSearchTerm('');
    setActiveTags([]);
    if (searchRef.current) {
      searchRef.current.value = '';
    }
  };

  useEffect(() => {
    if (isFilterOpen && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isFilterOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <Sound />

      <section className="relative pt-28 pb-16 px-6 bg-gradient-to-b from-aurora-100 to-white overflow-hidden">
        <div className="container mx-auto relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-aurora-900">
              <span className="relative inline-block">
                My Projects
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-1 bg-primary"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </h1>
            <p className="text-lg max-w-3xl mx-auto text-aurora-700">
              A collection of my work spanning various technologies and problem domains.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-8"
            >
              <Button
                variant="outline"
                size="lg"
                className="group bg-white/80 backdrop-blur-sm border-primary/20 hover:bg-primary/10 transition-all"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                {isFilterOpen ? "Hide Filters" : "Advanced Filters"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.section
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border-y border-gray-100 overflow-hidden"
          >
            <div className="container mx-auto py-6 px-6">
              <div className="flex flex-col space-y-6 md:space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    ref={searchRef}
                    placeholder="Search projects..."
                    className="pl-10 border-gray-300 focus:border-primary"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Tag size={16} className="mr-2" />
                    <span>Filter by tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={activeTags.includes(tag) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs capitalize ${activeTags.includes(tag)
                          ? "bg-primary text-white"
                          : "bg-gray-50 hover:bg-gray-100"
                          }`}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-xs text-gray-600 hover:text-primary"
                  >
                    Clear all filters
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center justify-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full mb-3">
              <Cuboid className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-gray-600">Interactive Experience</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-aurora-900">
              Mixed Reality Playground
            </h2>
            <p className="text-lg max-w-3xl mx-auto text-aurora-700">
              Experience my projects in 3D space. Interact with objects directly in your browser with this
              mixed reality visualization.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="max-w-5xl mx-auto shadow-xl rounded-xl overflow-hidden"
          >
            <ARScene />
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-white shadow-sm sticky top-16 z-30 backdrop-blur-md bg-white/90">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {(['all', 'game', 'mobile', 'data', 'systems', 'cli'] as FilterType[]).map((key) => (
              <Button
                key={key}
                variant={filter === key ? 'default' : 'outline'}
                onClick={() => setFilter(key)}
                className={`transition-all duration-300 ${filter === key ? 'bg-primary scale-105' : 'hover:scale-105'}`}
              >
                {key === 'all' ? 'All Projects' : key.charAt(0).toUpperCase() + key.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-aurora-50 to-white">
        <div className="container mx-auto px-6">
          <AnimatePresence mode="popLayout">
            {visibleProjects.length > 0 ? (
              <motion.div
                layout
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {visibleProjects.map((project, index) => (
                  <motion.div
                    key={project.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProjectCard
                      title={project.title}
                      type={project.type}
                      description={project.description}
                      image={project.image}
                      link={project.link}
                      index={index}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Filter className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-aurora-700">No projects found with the current filters.</h3>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Reset all filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </motion.div>
  );
};

export default Projects;
