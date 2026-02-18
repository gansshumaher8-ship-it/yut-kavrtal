import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import type { Project } from '@/types/project';
import {
  ensureDataDir,
  readProjects,
  writeProjects
} from '@/lib/projects';

export async function GET() {
  try {
    const projects = await readProjects();

    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('GET /api/projects error', error);

    return NextResponse.json(
      { message: 'Failed to load projects' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  }
}

type IncomingProject = Omit<Project, 'id'>;

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: 'Требуется авторизация' }, { status: 401 });
  }

  try {
    await ensureDataDir();

    const body = (await request.json()) as Partial<IncomingProject> & { agentId?: string };
    let { address, metro, price, profit, status, description, images, agentId } = body;
    if ((session as any).role === 'agent' && (session as any).agentId && !agentId) {
      agentId = (session as any).agentId;
    }

    if (
      !address ||
      !metro ||
      typeof price !== 'number' ||
      typeof profit !== 'number' ||
      !status ||
      !description ||
      !Array.isArray(images) ||
      images.length === 0
    ) {
      return NextResponse.json(
        { message: 'Invalid project data' },
        { status: 400 }
      );
    }

    if (!['active', 'sold', 'renovation'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid project status' },
        { status: 400 }
      );
    }

    const projects = await readProjects();

    const id =
      (globalThis as any).crypto?.randomUUID?.() ??
      `project-${Date.now()}-${projects.length + 1}`;

    const newProject: Project = {
      id,
      address,
      metro,
      price,
      profit,
      status,
      description,
      images,
      agentId: agentId || undefined
    };

    projects.push(newProject);
    await writeProjects(projects);

    return NextResponse.json(newProject, {
      status: 201,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    console.error('POST /api/projects error', error);

    return NextResponse.json(
      { message: 'Failed to save project' },
      { status: 500 }
    );
  }
}

