// ============================================================================
// DATABASE SEED SCRIPT
// ----------------------------------------------------------------------------
// Seeds the database with pre-defined relationship prompts
// Requirement: 2.1 - Display a list of all pre-seeded prompts
// ============================================================================

import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

/**
 * Pre-defined relationship prompts for the audit
 * These cover key areas of relationship compatibility and expectations
 */
const RELATIONSHIP_PROMPTS = [
  {
    text: "What does a typical weekday evening look like for you, and how do you envision spending evenings together as a couple?",
    order: 1,
  },
  {
    text: "How do you handle disagreements or conflicts? Describe a recent conflict and how you resolved it.",
    order: 2,
  },
  {
    text: "What are your expectations around finances? How should we handle joint expenses, savings, and individual spending?",
    order: 3,
  },
  {
    text: "How important is family to you? What role do you see extended family playing in our lives?",
    order: 4,
  },
  {
    text: "What are your thoughts on having children? If you want children, how many and when?",
    order: 5,
  },
  {
    text: "How do you express love and feel most loved? What makes you feel appreciated in a relationship?",
    order: 6,
  },
  {
    text: "What are your career goals for the next 5-10 years? How do you see our careers fitting together?",
    order: 7,
  },
  {
    text: "How do you handle stress? What do you need from a partner during difficult times?",
    order: 8,
  },
  {
    text: "What role does faith or spirituality play in your life? How should we approach religious practices as a couple?",
    order: 9,
  },
  {
    text: "What are your expectations around household responsibilities? How should we divide chores and tasks?",
    order: 10,
  },
  {
    text: "How do you feel about maintaining friendships outside the relationship? What boundaries are important to you?",
    order: 11,
  },
  {
    text: "What does quality time together look like for you? How much alone time do you need?",
    order: 12,
  },
  {
    text: "How do you approach health and wellness? What lifestyle habits are important to you?",
    order: 13,
  },
  {
    text: "What are your views on intimacy and physical affection in a relationship?",
    order: 14,
  },
  {
    text: "Where do you see us living? Are you open to relocating for career or family reasons?",
    order: 15,
  },
];

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing prompts (for development)
  await prisma.prompt.deleteMany();
  console.log("  Cleared existing prompts");

  // Insert all prompts
  const result = await prisma.prompt.createMany({
    data: RELATIONSHIP_PROMPTS,
  });

  console.log(`  Created ${result.count} prompts`);
  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
