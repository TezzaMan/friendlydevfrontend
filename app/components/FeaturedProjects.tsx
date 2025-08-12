import ProjectCard from './ProjectCard';
import type { Project } from '~/types';

type FeaturedProjectsProps = {
  projects: Project[],
  count: number
}

const FeaturedProjects = ({ projects, count = 4 }: FeaturedProjectsProps ) => {
  //const featured = projects.filter((p) => p.featured).slice(0, count);
  if (projects.length === 0) return null;
  return (
    <section>
      <h2 className='text-2xl font-bold mb-6 text-gray-800 dark:text-white'>
        🌟 Featured Projects
      </h2>
      <div className='grid gap-6 sm:grid-cols-2'>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProjects