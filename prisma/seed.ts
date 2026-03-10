import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { generatePlan } from "../src/lib/planner";
import { createPlan } from "../src/lib/db/queries/plans";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const NATUREGRASS_REQUEST = `Generate a 90-day plan for SoMe posts for the Facebook and Instagram profile 'Naturegrass'. The plan must include a minimum of 12 posts relevant to promoting the Naturegrass webshop and/or its products. For each post, create 3 drafts. Each draft must include finished ad copy and a graphic for the SoMe posts.`;

async function main() {
  console.log("🌱 Seeding database...");

  // Create default workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: "default" },
    update: {},
    create: {
      name: "Default Workspace",
      slug: "default",
      id: "default-workspace",
    },
  });

  console.log(`✓ Workspace: ${workspace.name} (${workspace.id})`);

  // Create connectors for workspace
  const connectorTypes = ["BROWSER", "ANTHROPIC", "INSTAGRAM", "FACEBOOK"] as const;
  for (const type of connectorTypes) {
    await prisma.connector.upsert({
      where: { workspaceId_type: { workspaceId: workspace.id, type } },
      update: {},
      create: {
        workspaceId: workspace.id,
        type,
        name: type,
        enabled: true,
      },
    });
  }

  console.log(`✓ Connectors: ${connectorTypes.join(", ")}`);

  // Create Naturegrass demo request
  const existingRequest = await prisma.request.findFirst({
    where: {
      workspaceId: workspace.id,
      rawInput: { contains: "Naturegrass" },
    },
  });

  if (existingRequest) {
    console.log(`✓ Naturegrass demo already exists (${existingRequest.id}) — skipping`);
  } else {
    const request = await prisma.request.create({
      data: {
        workspaceId: workspace.id,
        rawInput: NATUREGRASS_REQUEST,
        title: "90-day SoMe plan for Naturegrass…",
        status: "PLANNING",
      },
    });

    const { plan } = await generatePlan({
      rawInput: NATUREGRASS_REQUEST,
      workspaceId: workspace.id,
    });

    await createPlan(request.id, plan);

    await prisma.request.update({
      where: { id: request.id },
      data: { status: "PLAN_READY" },
    });

    console.log(`✓ Naturegrass demo request created (${request.id})`);
    console.log(`  Plan: ${plan.interpretedGoal.substring(0, 80)}...`);
  }

  console.log("✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
