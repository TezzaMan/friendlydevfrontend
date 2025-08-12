import type { Route } from "./+types/index";
import FeaturedProjects from "~/components/FeaturedProjects";
import AboutPreview from "~/components/about-preview";
import LatestPosts from "~/components/LatestPosts";
import type { Post } from "~/types";
import type { Project, StrapiResponse, StrapiProject, StrapiPost } from "~/types"

export function meta({}: Route.MetaArgs) {
  return [
    { title : 'The Friendly Dev' },
    { name: 'description', content: 'SSR App'},
  ];
}

export async function loader({
  request,
}: Route.LoaderArgs): Promise<{ projects: Project[]; posts: Post[] }> {
  const url = new URL(request.url);

  const [projectsRes, postsRes] = await Promise.all([
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/projects?filters[featured][$eq]=true&populate=*`
    ),
    fetch(
      `${
        import.meta.env.VITE_API_URL
      }/posts?sort[0]=date:desc&pagination[limit]=3&populate=*`
    ),
  ]);

  if (!projectsRes.ok || !postsRes.ok) {
    throw new Error('Failed to fetch projects or posts');
  }

  const projectsJson: StrapiResponse<StrapiProject> = await projectsRes.json();
  const postsJson: StrapiResponse<StrapiPost> = await postsRes.json();

  const projects = projectsJson.data.map((item) => ({
    id: item.id,
    documentId: item.documentId,
    title: item.title,
    description: item.description,
    image: item.image?.url ? `${item.image.url}` : '/images/no-image.png',
    url: item.url,
    date: item.date,
    category: item.category,
    featured: item.featured,
  }));

  const posts = postsJson.data.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    excerpt: item.excerpt,
    body: item.body,
    image: item.image?.url
      ? `${item.image.url}`
      : '/images/no-image.png',
    date: item.date,
  }));

  return { projects, posts };
}

const Home = ({ loaderData}: Route.ComponentProps ) => {
  const { projects, posts } = loaderData;

  return (
    <>
      <FeaturedProjects projects={projects} count={2}/>
      <AboutPreview />
      <LatestPosts posts={posts} />
    </>
  );
}

export default Home