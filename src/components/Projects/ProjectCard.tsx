
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, ExternalLink, Tag } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectCardProps {
  title: string;
  type: string;
  description: string;
  image: string;
  link: string;
  index: number;
  tags?: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  type,
  description,
  image,
  link,
  index,
  tags = []
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        {/* Progressive disclosure - Image and type badge */}
        <div className="relative overflow-hidden aspect-video">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {type}
          </div>
        </div>

        {/* Content section with progressive disclosure */}
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
          
          {/* Initial content */}
          <p className="text-gray-600 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Expandable content with chunking */}
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? 'auto' : 0 }}
            className="overflow-hidden"
          >
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag, i) => (
                  <Tooltip key={i}>
                    <TooltipTrigger>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-xs">
                        <Tag size={12} />
                        {tag}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Related to {tag}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
          </motion.div>

          {/* Action buttons with clear affordances */}
          <div className="flex items-center justify-between mt-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Eye size={20} />
                  <span className="text-sm">
                    {isExpanded ? 'Show Less' : 'Show More'}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isExpanded ? 'Hide details' : 'View project details'}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink size={20} />
                  <span className="text-sm">Visit Project</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open project in new tab</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Visual affordance for interactivity */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-xl transition-colors pointer-events-none" />
      </motion.div>
    </TooltipProvider>
  );
};

export default ProjectCard;
